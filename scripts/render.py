#!/usr/bin/env python3
"""Render a seek(t) composition to MP4, or to a contact sheet of stills.

  python render.py film/composition.html --out film/film.mp4 --size 1920x1080
  python render.py film/composition.html --stills 12 --size 1080x1920      # contact sheet
  python render.py film/composition.html --at 0.5,2.4,6.1 --sheet qa.jpg   # exact moments
  python render.py film/composition.html --out film.mp4 --music track.mp3  # your own track + SFX
  python render.py film/composition.html --out film.mp4 --voice vo.m4a --voice-at 0.4
  python render.py film/composition.html --alpha --out overlay.mov            # graphics over Flow clips

Every frame: page.evaluate(seek(t)) then a screenshot, piped into ffmpeg.
Workers render frame ranges in parallel and the segments are joined losslessly.
Audio: the composition's CUES + MUSIC are synthesized by synth_audio.py on the
same timeline as the picture, then mixed and loudness-normalized.
"""
import argparse, json, math, os, shutil, subprocess, sys, tempfile, time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent


def launch(p):
    for ch in ("chrome", "msedge", None):
        try:
            return p.chromium.launch(channel=ch, args=["--disable-web-security", "--allow-file-access-from-files"]) if ch else p.chromium.launch()
        except Exception:
            continue
    sys.exit("No Chromium found. Install Chrome, or run: python -m playwright install chromium")


def open_page(p, comp, w, h, alpha=False):
    browser = launch(p)
    page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    url = Path(comp).resolve().as_uri() + f"?w={w}&h={h}&render"
    page.goto(url)
    page.wait_for_function("window.__ready === true", timeout=90000)
    if alpha:
        page.add_style_tag(content="html,body,#viewport,#stage{background:transparent!important}")
    return browser, page


def meta_of(comp, w, h):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, page = open_page(p, comp, w, h)
        m = page.evaluate("({d: window.DURATION, fps: window.FPS, cues: window.CUES || [], music: window.MUSIC || {}})")
        b.close()
    return m


def render_range(args):
    comp, w, h, fps, f0, f1, seg, crf, quality, alpha = args
    from playwright.sync_api import sync_playwright
    codec = ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"] if alpha else         ["-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p"]
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(fps), "-i", "-", *codec, "-r", str(fps), seg]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, page = open_page(p, comp, w, h, alpha)
        for f in range(f0, f1):
            page.evaluate(f"window.seek({f / fps:.6f})")
            shot = page.screenshot(type="png", omit_background=True) if alpha else page.screenshot(type="jpeg", quality=quality)
            proc.stdin.write(shot)
        b.close()
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError(f"ffmpeg failed on {seg}")
    return seg


def stills(comp, w, h, times, sheet, cols=None):
    from playwright.sync_api import sync_playwright
    from PIL import Image, ImageDraw, ImageFont
    shots = []
    with sync_playwright() as p:
        b, page = open_page(p, comp, w, h)
        for t in times:
            page.evaluate(f"window.seek({t:.4f})")
            path = Path(tempfile.gettempdir()) / f"_still_{os.getpid()}_{len(shots)}.png"
            page.screenshot(path=str(path))
            shots.append((t, path))
        b.close()
    tw = 480 if w >= h else 300
    th = round(tw * h / w)
    cols = cols or (4 if w >= h else 6)
    rows = math.ceil(len(shots) / cols)
    pad, lab = 8, 22
    sheet_img = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + pad + lab) + pad), (18, 20, 22))
    d = ImageDraw.Draw(sheet_img)
    try:
        font = ImageFont.truetype("arial.ttf", 15)
    except Exception:
        font = ImageFont.load_default()
    for i, (t, path) in enumerate(shots):
        im = Image.open(path).convert("RGB").resize((tw, th), Image.LANCZOS)
        x, y = pad + (i % cols) * (tw + pad), pad + (i // cols) * (th + pad + lab)
        sheet_img.paste(im, (x, y + lab))
        d.text((x + 2, y + 3), f"#{i + 1}  t={t:.2f}s", fill=(141, 182, 0), font=font)
        path.unlink(missing_ok=True)
    sheet_img.save(sheet, quality=90)
    print(f"contact sheet: {sheet}  ({len(shots)} frames)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("composition")
    ap.add_argument("--out", help="output mp4 (default: next to composition)")
    ap.add_argument("--size", default="1920x1080", help="WxH, e.g. 1080x1920, 1080x1080, 1080x1350")
    ap.add_argument("--fps", type=int, default=0, help="override the composition's FPS")
    ap.add_argument("--from", dest="t0", type=float, default=0)
    ap.add_argument("--to", dest="t1", type=float, default=0)
    ap.add_argument("--workers", type=int, default=max(1, min(4, (os.cpu_count() or 2) // 2)))
    ap.add_argument("--crf", type=int, default=18)
    ap.add_argument("--quality", type=int, default=94, help="jpeg quality of captured frames")
    ap.add_argument("--stills", type=int, default=0, help="contact sheet with N evenly spaced frames")
    ap.add_argument("--at", default="", help="contact sheet at these times, comma separated")
    ap.add_argument("--sheet", default="", help="contact sheet path")
    ap.add_argument("--no-audio", action="store_true")
    ap.add_argument("--alpha", action="store_true", help="transparent overlay: ProRes 4444 .mov, no audio (remove the bg layer)")
    ap.add_argument("--music", default="", help="your own licensed track (replaces synthesized music; SFX kept)")
    ap.add_argument("--voice", default="", help="voiceover audio (e.g. from flow_narrate); ducks the music under it")
    ap.add_argument("--voice-at", type=float, default=0.0, help="seconds into the film where the voiceover starts")
    ap.add_argument("--lufs", type=float, default=-14.0)
    a = ap.parse_args()

    comp = str(Path(a.composition).resolve())
    w, h = map(int, a.size.lower().split("x"))
    m = meta_of(comp, w, h)
    dur, fps = float(m["d"]), a.fps or int(m["fps"])
    t1 = a.t1 or dur
    base = Path(comp).with_suffix("")
    tag = f"{w}x{h}"

    if a.stills or a.at:
        times = [float(x) for x in a.at.split(",") if x.strip()] if a.at else \
            [a.t0 + (t1 - a.t0) * (i + 0.5) / a.stills for i in range(a.stills)]
        stills(comp, w, h, times, a.sheet or f"{base}_sheet_{tag}.jpg")
        return

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found on PATH")
    out = a.out or f"{base}_{tag}.{'mov' if a.alpha else 'mp4'}"
    if a.alpha:
        a.no_audio = True
    f0, f1 = round(a.t0 * fps), round(t1 * fps)
    n = f1 - f0
    workers = max(1, min(a.workers, n // (fps * 2) or 1))
    tmp = Path(tempfile.mkdtemp(prefix="creavia_"))
    step = math.ceil(n / workers)
    jobs = [(comp, w, h, fps, s, min(f1, s + step), str(tmp / f"seg{i:02d}.{'mov' if a.alpha else 'mp4'}"), a.crf, a.quality, a.alpha)
            for i, s in enumerate(range(f0, f1, step))]
    t_start = time.time()
    print(f"rendering {n} frames {tag} @{fps}fps with {len(jobs)} worker(s)…")
    if len(jobs) == 1:
        segs = [render_range(jobs[0])]
    else:
        with ProcessPoolExecutor(len(jobs)) as ex:
            segs = list(ex.map(render_range, jobs))
    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{Path(s).as_posix()}'\n" for s in segs))
    video = tmp / ("video.mov" if a.alpha else "video.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(video)], check=True)
    print(f"picture done in {time.time() - t_start:.1f}s")

    if a.no_audio:
        shutil.move(str(video), out)
    else:
        sys.path.insert(0, str(HERE))
        from synth_audio import synth
        cues = [c for c in m["cues"] if a.t0 <= c["t"] < t1]
        for c in cues:
            c["t"] -= a.t0
        music = dict(m["music"] or {})
        if a.music:
            music["mood"] = "none"
        wav = tmp / "audio.wav"
        synth(cues, t1 - a.t0, music, str(wav))
        (Path(out).with_suffix(".cues.json")).write_text(json.dumps({"cues": cues, "music": m["music"]}, indent=1))
        inputs, chain, last, k = [], [], "[1:a]", 2
        if a.music:
            inputs += ["-i", a.music]
            chain.append(f"[{k}:a]atrim=0:{t1 - a.t0},afade=t=out:st={max(0, t1 - a.t0 - 1.5)}:d=1.5,volume=0.8[m];{last}[m]amix=inputs=2:normalize=0[bed]")
            last, k = "[bed]", k + 1
        if a.voice:
            # voice on top; the bed is ducked whenever the voice speaks
            inputs += ["-i", a.voice]
            ms = int(a.voice_at * 1000)
            chain.append(f"[{k}:a]adelay={ms}|{ms},volume=1.6,asplit=2[v][vsc];{last}[vsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[duck];[duck][v]amix=inputs=2:normalize=0[vo]")
            last = "[vo]"
        chain.append(f"{last}loudnorm=I={a.lufs}:TP=-1.5[a]")
        mix = [*inputs, "-filter_complex", ";".join(chain), "-map", "0:v", "-map", "[a]"]
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(wav), *mix,
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", out], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"done: {out}  ({time.time() - t_start:.1f}s total)")


if __name__ == "__main__":
    main()
