# Explainer + motion graphic playbook

## Pick the film type
| type | length | structure | styles that fit |
|---|---|---|---|
| **Launch teaser / motion graphic** | 6–20 s | hook → reveal → lockup | S01, S08, S16, S29, S10 |
| **Product explainer** | 30–90 s | problem → solution → features → proof → CTA | S02, S06, S07, S11, S14, S20, S21 |
| **Story explainer** | 45–120 s | character's world → struggle → discovery → transformation → brand | S04, S09, S12, S17, S22, S24, S25, S26, S28 |
| **Brand film / title sequence** | 20–60 s | mood → journey → title | S05, S12, S19, S25 |
| **Social explainer (vertical)** | 15–45 s | claim → 3 fast points → CTA, captions always on | S15, S11, S23, S01 |
| **Loop** | 5–10 s | build → hold → return to frame 0 | S10, S29, S16 |

## Beat templates (times for a 30 s film; scale proportionally)
**Product explainer (30 s)**
| beat | time | viewer knows | typical move |
|---|---|---|---|
| Hook | 0–2.5 | "this is about my pain / this is bold" | kinetic claim or problem image moving at frame 0 |
| Problem | 2.5–8 | the cost of the status quo | chaos of cards/toasts/papers, character stressed |
| Turn | 8–10 | there is a better way | everything pulled into one object (the product) |
| Solution | 10–20 | how it works in 2–3 steps | real UI, cursor-led, morphs between states |
| Proof | 20–25 | it works | counter, chart, testimonial chips, logos |
| CTA | 25–30 | what to do now | logo lockup, URL pill, CTA button click |

**Story explainer (60 s):** world 0–8 · struggle 8–20 · discovery 20–28 · how it works 28–45 ·
transformation 45–54 · brand + CTA 54–60.

**Launch teaser (12 s):** hook 0–2 · three feature flashes 2–8 (2 s each) · lockup 8–12.

## State list (for UI films)
Write each UI state before animating, then design continuity between them:
```
S0 empty prompt field, caret blinking
S1 text typed: "<idea>"           (typeOn, key cues)
S2 cursor on Generate, press      (click cue)
S3 button → progress bar morph    (track width/radius)
S4 progress → video frame         (zoom-through, whoosh)
```
One element should survive across states and remain recognisably the same object.

## Script
- Write VO first if there is one; then lock picture to it. 2.3–2.6 words/s.
- Every line passes "so what?" for the viewer. Cut adjectives, keep verbs and numbers.
- On-screen text never duplicates the VO word for word; it **anchors** the key noun/number.
- Without VO, the on-screen text is the script: ≤ 7 words per card, 1 idea per card.
- CTA is a verb + destination: "Start free at creavia.ai".

## Voiceover options
- `mcp__flow__flow_narrate` (engine `gemini` with a key in `~/.flow-mcp/gemini-key`, or `mac`
  which uses the computer's built-in voices on macOS/Windows). Free. Split into one file per line
  when lines must land on specific beats, or one file + `--voice-at`.
- Then `python scripts/render.py film/composition.html --voice vo.m4a --voice-at 0.4`.
- Gemini free tier allows **3 TTS requests per minute**: record 3 lines, wait ~60 s (background
  `sleep`), record the next 3. Takes run ~10-30% longer than the word budget; measure real speech
  with `ffmpeg -af silencedetect=n=-38dB:d=0.25` before placing them.
- One take per beat, then build one timed track with ffmpeg (`atrim` to cut pauses out of a take,
  `atempo` ≤ 1.1 to fit a slot, `adelay` to place it, `amix=normalize=0`, `apad=whole_dur=D`) and
  pass it as `--voice vo_full.wav --voice-at 0`. Retime on-screen words to the speech, not the reverse.
- Under VO, drop the music bed (`S.music.gain` ≈ 0.3) so speech sits ~10 dB above it after ducking.
- Captions on a VO film: code captions timed from `mcp__flow__flow_transcribe` word times, or
  burn in afterwards with `mcp__flow__flow_captions` (show the transcript to the user first).

## Variants
Same timeline, same assets, separate layout per format via `pick()`. Render each:
`--size 1920x1080`, `--size 1080x1920`, `--size 1080x1080`, `--size 1080x1350`.
Make a contact sheet per variant; the vertical often needs bigger type and fewer simultaneous items.
