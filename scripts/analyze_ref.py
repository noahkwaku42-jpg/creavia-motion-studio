#!/usr/bin/env python3
"""Study reference videos before writing any code.

  python analyze_ref.py OUT_DIR video1.mp4 [video2.mp4 ...] [--frames 16]

For each video writes OUT_DIR/<name>_sheet.jpg (an evenly spaced 4x4 frame grid)
and prints duration, size, hard-cut count and average shot length. Few hard cuts
on a long video means it moves by continuous transitions (morphs, match cuts,
camera moves), which is how most pro explainers are built.
Read every sheet, then write style_guide.md: palette, type, motion grammar,
transitions, pacing, what to take and what NOT to take (subjects, logos).
"""
import argparse, subprocess, json
from pathlib import Path


def probe(v):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height:format=duration", "-of", "json", v], capture_output=True, text=True).stdout
    j = json.loads(out)
    s = j["streams"][0]
    return float(j["format"]["duration"]), s["width"], s["height"]


def cuts(v, thr=0.3):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", v, "-vf", f"select='gt(scene,{thr})',showinfo", "-an", "-f", "null", "-"],
                       capture_output=True, text=True)
    return [float(l.split("pts_time:")[1].split()[0]) for l in r.stderr.splitlines() if "pts_time:" in l]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("videos", nargs="+")
    ap.add_argument("--frames", type=int, default=16)
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    side = int(a.frames ** 0.5)
    for v in a.videos:
        d, w, h = probe(v)
        name = Path(v).stem[:40]
        sheet = out / f"{name}_sheet.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", v, "-vf",
                        f"fps={a.frames / max(d, 1):.5f},scale=400:-2,tile={side}x{side}:padding=4:color=white",
                        "-frames:v", "1", str(sheet)], check=True)
        c = cuts(v)
        print(f"{name:40s} {w}x{h} {d:6.1f}s  cuts={len(c):3d}  avg_shot={d / (len(c) + 1):5.2f}s  "
              f"cut_times={[round(x, 1) for x in c[:12]]}{'…' if len(c) > 12 else ''}")
        print(f"   sheet: {sheet}")


if __name__ == "__main__":
    main()
