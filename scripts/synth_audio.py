#!/usr/bin/env python3
"""Synthesize a music bed + sound effects on the same timeline as the picture.

  python synth_audio.py cues.json out.wav --duration 15

cues.json: {"cues": [{"t": 0.25, "type": "pop", "gain": 0.7}, ...],
            "music": {"mood": "tech", "bpm": 120, "gain": 0.5}}

Moods: tech, upbeat, calm, cinematic, playful, none.
SFX: whoosh, swoosh, click, pop, tick, type, riser, impact, ding, glitch, shimmer.
Pure numpy, deterministic (seeded noise), 48 kHz stereo 16-bit.
"""
import argparse, json, wave
import numpy as np

SR = 48000
RNG = np.random.default_rng(7)

MOODS = {
    #            root Hz, chords as semitone stacks per bar, drums, bass pattern, arp
    "tech":      dict(root=110.0, chords=[[0, 3, 7, 10], [-4, 0, 3, 7], [-9, -5, -2, 3], [-2, 2, 5, 9]], kick="four", hats=True, bass="eighths", arp=False, pad=0.22),
    "upbeat":    dict(root=130.81, chords=[[0, 4, 7, 11], [7, 11, 14, 17], [9, 12, 16, 19], [5, 9, 12, 16]], kick="four", hats=True, bass="quarters", arp=True, pad=0.18),
    "calm":      dict(root=87.31, chords=[[0, 4, 7, 11], [9, 12, 16, 19], [2, 5, 9, 12], [7, 11, 14, 17]], kick="none", hats=False, bass="whole", arp=True, pad=0.26),
    "cinematic": dict(root=73.42, chords=[[0, 3, 7, 12], [-4, 0, 3, 8], [3, 7, 10, 15], [-2, 2, 5, 10]], kick="half", hats=False, bass="whole", arp=False, pad=0.3),
    "playful":   dict(root=130.81, chords=[[0, 4, 7, 12], [5, 9, 12, 17], [7, 11, 14, 19], [0, 4, 7, 12]], kick="four", hats=True, bass="bounce", arp=True, pad=0.14),
}


def env_ar(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def tone(freq, dur, harm=(1, .35, .15), detune=0.0):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for k, amp in enumerate(harm, 1):
        out += amp * np.sin(2 * np.pi * freq * k * (1 + detune) * t)
    return out


def lowpass(x, alpha):
    # one-pole, alpha scalar or per-sample array in (0,1]
    y = np.empty_like(x)
    acc = 0.0
    al = np.broadcast_to(alpha, x.shape)
    for i in range(len(x)):
        acc += al[i] * (x[i] - acc)
        y[i] = acc
    return y


def noise(n):
    return RNG.standard_normal(n)


# ---------------- SFX ----------------
def sfx(kind):
    if kind in ("whoosh", "swoosh"):
        d = 0.55 if kind == "whoosh" else 0.32
        n = int(d * SR)
        x = np.linspace(0, 1, n)
        hump = np.sin(np.pi * x) ** 2
        cutoff = 0.02 + 0.25 * np.sin(np.pi * x) * (1.0 if kind == "whoosh" else 1.6)
        s = lowpass(noise(n), cutoff) * hump * (2.2 if kind == "whoosh" else 2.6)
        return s, 0.35
    if kind == "click":
        n = int(0.035 * SR); t = np.arange(n) / SR
        s = np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 180) + 0.4 * noise(n) * np.exp(-t * 600)
        return s * 0.8, 0.0
    if kind == "tick":
        n = int(0.015 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * 4200 * t) * np.exp(-t * 400) * 0.5, 0.0
    if kind == "type":
        n = int(0.02 * SR); t = np.arange(n) / SR
        s = noise(n) * np.exp(-t * 500)
        s = s - lowpass(s, 0.3)
        return s * (0.5 + 0.3 * RNG.random()), 0.0
    if kind == "pop":
        n = int(0.12 * SR); t = np.arange(n) / SR
        f = 300 + 700 * np.exp(-t * 45)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32)
        return s * 0.8, 0.0
    if kind == "riser":
        n = int(1.4 * SR); t = np.arange(n) / SR
        f = 200 * (6 ** (t / t[-1]))
        s = 0.35 * np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * lowpass(noise(n), 0.05 + 0.4 * t / t[-1])
        return s * (t / t[-1]) ** 2 * 0.8, 0.0
    if kind == "impact":
        n = int(1.2 * SR); t = np.arange(n) / SR
        f = 35 + 55 * np.exp(-t * 9)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) + 0.6 * lowpass(noise(n), 0.08) * np.exp(-t * 14)
        return np.tanh(s * 1.6) * 0.9, 0.0
    if kind == "ding":
        n = int(1.6 * SR); t = np.arange(n) / SR
        s = sum(a * np.sin(2 * np.pi * 1318.5 * r * t) * np.exp(-t * dcy) for r, a, dcy in ((1, 1, 3), (2.0, .4, 5), (3.01, .25, 7), (4.2, .12, 9)))
        return s * 0.45, 0.0
    if kind == "glitch":
        n = int(0.25 * SR)
        s = noise(n)
        s = np.round(s * 3) / 3
        gate = (np.floor(np.arange(n) / (SR * 0.018)) % 2).astype(float)
        return s * gate * 0.35, 0.0
    if kind == "shimmer":
        n = int(1.4 * SR); t = np.arange(n) / SR
        s = np.zeros(n)
        for i, f in enumerate((2093, 2637, 3136, 3951, 4186)):
            st = int(i * 0.06 * SR)
            tt = t[: n - st]
            s[st:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4) * 0.22
        return s, 0.0
    return np.zeros(1), 0.0


# ---------------- music ----------------
def music_bed(duration, mood="tech", bpm=120):
    if mood not in MOODS:
        return np.zeros((int(duration * SR), 2))
    M = MOODS[mood]
    n = int(duration * SR)
    L, R = np.zeros(n), np.zeros(n)
    beat = 60.0 / bpm
    bar = beat * 4

    def add(sig, at, pan=0.0, ch=None):
        i = int(at * SR)
        if i >= n: return
        sig = sig[: n - i]
        if ch is None:
            L[i:i + len(sig)] += sig * (1 - max(0, pan))
            R[i:i + len(sig)] += sig * (1 + min(0, pan))
        else:
            (L if ch == 0 else R)[i:i + len(sig)] += sig

    nbars = int(np.ceil(duration / bar)) + 1
    for b in range(nbars):
        chord = M["chords"][b % len(M["chords"])]
        t0 = b * bar
        intro = min(1.0, 0.35 + b * 0.35)
        for k, semi in enumerate(chord):
            f = M["root"] * 2 * (2 ** (semi / 12))
            e = env_ar(int(bar * 1.15 * SR), 0.35, 0.5)
            add(tone(f, bar * 1.15, (1, .3, .12), detune=-0.003) * e * M["pad"] * 0.25 * intro, t0, ch=0)
            add(tone(f, bar * 1.15, (1, .3, .12), detune=0.003) * e * M["pad"] * 0.25 * intro, t0, ch=1)
        root = M["root"] * (2 ** (chord[0] / 12))
        if M["bass"] == "eighths":
            hits = [(i * beat / 2, beat / 2 * .9) for i in range(8)]
        elif M["bass"] == "quarters":
            hits = [(i * beat, beat * .9) for i in range(4)]
        elif M["bass"] == "bounce":
            hits = [(0, beat * .5), (beat * 1.5, beat * .4), (beat * 2, beat * .5), (beat * 3.5, beat * .4)]
        else:
            hits = [(0, bar)]
        for at, d in hits:
            nn = int(d * SR); tt = np.arange(nn) / SR
            s = np.tanh(1.5 * np.sin(2 * np.pi * root * tt)) * np.exp(-tt * (2 if M["bass"] == "whole" else 6)) * env_ar(nn, 0.005, 0.03)
            add(s * 0.22 * intro, t0 + at)
        kicks = {"four": range(4), "half": (0, 2), "none": ()}[M["kick"]]
        for k in kicks:
            if b == 0 and k < 2 and mood != "cinematic": continue
            nn = int(0.35 * SR); tt = np.arange(nn) / SR
            f = 45 + 110 * np.exp(-tt * 30)
            add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.55, t0 + k * beat)
        if M["hats"] and b > 0:
            for k in range(4):
                nn = int(0.06 * SR); tt = np.arange(nn) / SR
                h = noise(nn); h = h - lowpass(h, 0.45)
                add(h * np.exp(-tt * 70) * 0.09, t0 + k * beat + beat / 2, pan=0.3 if k % 2 else -0.3)
        if M["arp"]:
            for i in range(8):
                semi = chord[i % len(chord)] + 12
                f = M["root"] * 2 * (2 ** (semi / 12))
                nn = int(beat / 2 * SR); tt = np.arange(nn) / SR
                add(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) * 0.07 * intro, t0 + i * beat / 2, pan=(-0.4 if i % 2 else 0.4))
    out = np.stack([L, R], 1)
    fade = int(min(1.8, duration / 4) * SR)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


def synth(cues, duration, music=None, out_wav="audio.wav"):
    music = music or {}
    n = int(duration * SR) + SR
    mix = np.zeros((n, 2))
    bed = music_bed(duration, music.get("mood", "tech"), music.get("bpm", 120))
    mix[: len(bed)] += bed * music.get("gain", 0.5)
    duck = np.ones(n)
    for c in cues:
        s, pre = sfx(c["type"])
        i = int(max(0, c["t"] - pre) * SR)
        if i >= n: continue
        s = s[: n - i] * c.get("gain", 1.0)
        pan = 0.15 * np.sin(c["t"] * 3.1)
        mix[i:i + len(s), 0] += s * (1 - pan)
        mix[i:i + len(s), 1] += s * (1 + pan)
        if c["type"] in ("impact", "whoosh"):
            dl = min(int(0.5 * SR), n - i)
            duck[i:i + dl] = np.minimum(duck[i:i + dl], 0.55 + 0.45 * np.linspace(0, 1, dl))
    # duck the music bed (not the SFX) under impacts and whooshes
    if len(bed):
        mix[: len(bed)] -= bed * music.get("gain", 0.5) * (1 - duck[: len(bed), None])
    mix = mix[: int(duration * SR)]
    mix = np.tanh(mix * 1.2) / 1.2
    peak = np.max(np.abs(mix)) or 1
    mix = mix / peak * 0.89
    pcm = (mix * 32767).astype(np.int16)
    with wave.open(out_wav, "wb") as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())
    return out_wav


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cues"); ap.add_argument("out"); ap.add_argument("--duration", type=float, required=True)
    a = ap.parse_args()
    data = json.load(open(a.cues))
    synth(data.get("cues", []), a.duration, data.get("music", {}), a.out)
    print("wrote", a.out)
