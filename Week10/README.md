# Week 9 Spider Universe

## What I did?
This week's work reminds me of a trend on social media that use fingers to strecth out different filters. Usually people use mask and video editing to do this. But I 've always thinking about using code to done this. Cuz' it's very convenient and cool due to its potential to develope in. There are 4 quads with half opacity color between different fingers. And the thumb and index fingers are special that I use the code from last week in it to create the halftone effect. So here I learned a new method called clip. 

## Reflection
New method learned this week: Clipping Mask. `drawingContext.clip();`. 
What this does is to take **the path or shape you’ve just defined** and turn it into a **"stencil"** (cutting template) for whatever follows. So, I need to first draw the shape and then call `clip()`. Then the system will then use that shape as a template. From that point on, anything else I draw later will only be visible within the boundary of that shape! *(Anther thing to remember is the use of save and restore, helps avoid from `clip()` influencing the later codes)*.

Also one thing that stucked me for a while is the use of **save and restore**, i didnt know this 2 function before. So my frame kept being stuck, later I realize its because the clipping method happen 60 time per second, therefore my frame will freeze. After adding on the save and restore. It helps clear the canvas everyframe, *avoid from glitching or freezing*.