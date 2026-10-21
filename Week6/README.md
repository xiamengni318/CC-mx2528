# Clock Reflection

## What did I do?
For this project, I made an abstract clock. I used eyes, rotating circles, colors, and a heartbeat line to show time. A new heartbeat appears every second, and the line holds 60 beats in one minute. The circles represent minutes, and the eyes blink when the minute changes. The blue background area changes with the hour to represent day and night. And I design the color to be the same so one of the eye will disappear when fully day/fully night. Fun fun~

## What did I overcome?
This was my first time using WEBGL. I learned how to rotate the circles with rotateY() and how depth affects which shapes appear in front. At first, the background covered part of the rotating circles, and the circles also blocked the eyes. I learned to clear the depth buffer between these layers.

The blinking animation took the most time. I had used lerp() in my second assignment, but I had forgotten how it worked. I needed to separate the current eye height from the target height, then change the target after the eyes closed. The hardest part was keeping the eye outlines, pupils, and eyelashes moving together. Using objects and updating their values helped me connect these parts. I also forgot that setup only run for once, so it stucked me from the blinking animation for so long, until I realized I need to define them in draw function....

Finally, I added simple CSS to my homepage. I learned how to use flex to arrange my assignment links horizontally. I also adjusted the spacing, colors, and font to make the page feel more personal. First time importing a font, quite easy and satisfying.
---