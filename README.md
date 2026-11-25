# Final Proposal: Curtain VJ

**Revisiting:** Week 7 & 10, "VJ" + "Projection Mapping"
**Previous work:** [Week 7 site](https://xiamengni318.github.io/CC-mx2528/Week7/index.html) ·

---

## 1. The assignment I am revisiting

Week 7& 10 had two parts, and I built them as two separate sketches.

**VJ sketch (p5.js + p5.sound + ml5 HandPose).**
- Music plays through `p5.FFT`. I split the spectrum into bass (0–300 Hz), mid (300–6000 Hz) and treble (4000–12000 Hz).
- Bass drives a pulsing outlined rectangle and the size of the halftone dots. A sudden bass rise ("hit") makes the dots jump.
- Mid detects claps and spawns short-lived white circles.
- Treble distorts a set of noise-driven rings.
- The webcam tracks two hands. The thumb and index fingertips form a quad that clips the video, and inside it the live image is redrawn as bass-reactive halftone dots.
- A dropdown switches songs, and a "Yellow Mode" button swaps the camera feed for a yellow background.

**Projection mapping sketch (p5.js + p5.mapper).**
- Two Bezier maps, each with 8 draggable control points.
- One shows a rotating red-and-white 2D pattern with a glow. The other shows a 3D DNA helix with spinning rings, rendered into an offscreen WEBGL canvas.

**What I felt was missing.** The VJ was fun, but the mapping did not feel satisfying. The mapped shapes are generic (a pattern and a spinning 3D object), they are not related to any real surface, and they do not react to sound. The two sketches never met. Therefore, it reminds me of some of the musical events that combine the mapping and the VJ together. Likely, i have 2 perfect flat curtain next to my bed thats very suitable for experimenting this idea at home.

---

## 2. How I plan to change and respond to it

**Idea: project the VJ onto the curtains in my bedroom.**

I want to merge the two halves into one piece. The VJ visuals become the content, and the mapping fits them onto a real, spatial surface.

**Planned changes**
1. Render the VJ into an offscreen `createGraphics()` buffer and send that buffer into p5.mapper's `displaySketch()`, the same pattern I already use for the 3D DNA.
2. Map each curtain panel as its own shape (quad). 
3. Drive the visuals from audio (reuse my bass / mid / treble functions).
4. Redesign the visuals for fabric: bolder shapes and higher contrast, vertical flow that suits, fewer fine details.
5. Save and load the mapping (`map.json`) so I can recalibrate quickly each time I set up.

**Room Sketch** See [`room`](room.png) &  [`sketch`](sketch.png) (wireframe of the window, curtains and projector). 

---

## 3. What I need to do, and where I expect challenges

**Tasks**
- [ ] Merge the two sketches into one (VJ buffer inside the mapper).
- [ ] Re-test audio inside a WEBGL canvas. The VJ was written for a 2D canvas, so drawing, clipping and `video` handling need rework.
- [ ] Photograph the curtains and measure the panels, then decide how many mapped shapes I need.
- [ ] Redesign the visuals for situation of my room.
- [ ] Borrow Projector.
- [ ] Test projecting at night, adjust brightness and colors.
- [ ] Record documentation (photos and a short video) and write up the process.

**Expected challenges**
- **Contrast and room light.** Projection mapping relies on contrast, so I need a dark room and bright, high-contrast visuals.
- **Light passes through thin curtains.** I need to check how the picture looks from inside the room versus from outside, and whether to use a layer behind or in front.
- **Performance.** Running FFT and WEBGL rendering at once may be slow. I may need to lower the camera resolution or the number of drawn dots.
- **Audio input.** Decide between a music file (as in Week 7) and the microphone, so the piece can react to live sound [imagine if its a home-bar where live music plays].

**What I need to learn**
- How p5.mapper handles `displaySketch` buffers or else, and different map types in detail.
- Designing visuals specifically, maybe bringing up some plot or narrative design.
- Projector setup basics: throw distance, keystone, focus.

---

## References

**Tools and code**
- [p5.mapper](https://github.com/jdeboi/p5.mapper): the projection mapping library I am already using (quad, triangle, line and Bezier maps).
- [Creative Audio Visualizers (Codrops)](https://tympanus.net/codrops/2018/03/06/creative-audio-visualizers): p5.sound FFT visualizer techniques.

**Related work and inspiration**
- [Interactive Projection Mapping (Video Mapping Store)](https://videomapping.store/interactive-projection-mapping/): audio reactivity and hand/body tracking in projection mapping.