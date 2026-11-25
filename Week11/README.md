# Week 10 Spider Universe VJ

## What I did?

I worked on a music visualization VJ page, that continued from my previous work. I wanted to make different visual elements react to different parts of the music. Instead of making everything move in the same way, I divided the sound into three frequency ranges: bass, mid, and treble.

For the **bass**, I created a heavy Royal Blue stroked rectangle around the canvas. Its size changes according to the bass energy. The stronger the bass, the bigger the rectangle becomes. I also connected the bass energy to my hand-tracking halftone effect from last week. The halftone dots inside the areas drawn by my hands can react to strong bass sounds. When the bass gets stronger, the dots become bigger. So the hand effect is not just showing the camera image anymore. It also reacts to the music.

For the **mid frequencies**, I wanted to create something like a clap reaction. When the mid energy suddenly increases, white circles appear at random positions on the canvas. Each circle has a random size between 20 and 100 pixels. I also added transparency to the background, so the circles leave a fading trail after they appear.

For the **treble**, I created 15 circles from the center to the outside. They use `noise()` to create a wavy and organic shape. The treble energy controls how much the circles change their shapes. I also added a yellow mode. In this mode, the camera background is covered by bright yellow, and only the areas drawn by my hands show the halftone video.

## What challenges did I overcome?

One of the biggest challenges this week was understanding the sound analysis code itself. I spent a lot of time reading code examples and tutorials from websites, but I found it quite difficult to understand the logic behind them.

For example, in my `getBandEnergy()` function, I saw variables like `lo` and `hi`, and I didn't understand what they meant at first. Later, I learned that they represent the starting and ending positions of a frequency range inside the FFT spectrum array. The code needs to convert frequency values in Hz into positions in that array.

Another confusing part was `nyquist`. I learned that the Nyquist frequency is half of the audio sample rate. That's why the code uses `getAudioContext().sampleRate / 2`. The FFT spectrum represents frequencies from 0 Hz up to this Nyquist frequency, so I need to use it to calculate which part of the spectrum belongs to the frequency range I want. I could find these formulas online, but understanding *why* they work was much harder than just copying the code. I wanted to understand what each number actually represents, instead of only making the code work.

Also, for detecting sudden changes in the mid frequencies. I didn't want the white circles to appear all the time. So I tried to compare the current mid energy with the previous frame. When there is a big increase, the code creates a circle at a random position. It is not a perfect clap detector, but it gives me a way to react to sudden sounds.

So many problems happen this week actually, another one is about the code structure. For example, I learned that `fft.analyze()` should be called once in each frame, and the same spectrum data can be passed to different functions. I also had an error because I used `spectrum` inside a function without passing it in as a parameter.

## Reflection

This week's practice make me realized that making a VJ is not just about making things move with music. I need to think about what kind of movement matches each sound. For example, bass feels stronger and heavier, so I used a growing rectangle and made the halftone dots react to strong bass. Mid-frequency changes can create sudden reactions, so I used random circles like snares. Treble feels more delicate, so I used wavy rings. I still need to spend time figuring out what the variables and formulas actually mean. Especially with sound analysis, there are many numbers and calculations that I cannot fully understand just by looking at the code. Now is like ablt to use but only understanding half of it. However, I enjoy this and it was interesting to turn something I hear into something I can see.