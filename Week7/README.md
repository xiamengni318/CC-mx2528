# Projection Mapping
This week we learned how to do projection mapping from p5js, I used to do the same thing with TouchDesigner, but thats nodes based, so it feels quite different working with only the codes. 

## Mis-understanding
I was trying to put a 3d spinning rings projection on the box during in-class exercise, cuz I see the canvas created is a **WEBGL** renderer, however I misunderstood that part. That doesn't mean it accept 3d elements or functions. I think the **main limitation** here comes from the p5.mapper library, that functions from this library only accept 2D *(probably because its main job is to create the geometric shapes for mapping)*.
*The `(windowWidth, windowHeight, WEBGL)` here is for the spatial warping.*

So in case to project a 3D object on it, we need to use these 2 main lines of codes:
`createGraphics()` and `image()`.
The first helps create an unseen canvas(*buffer*) that is a WEBGL renderer. While the second turns the canvas into an image. In that case, the `displaySketch()` are able to read it and send it to `createQuadMap()`.

## Some Details Behind the Codes
I also took some time to understand why we need a parameter for the functions. By this I mean: why we need '(mySketch)' in `function itsABox(mySketch)`? Instead of calling the function to draw directly, we need that prefix. 

**A**: Thats because calling `background()` or `rect()` direclty in the function`itsABox()`, although its not in the `draw()` or `setUp()`, it will still *change the main canvas*. So we need to let them know which exact canvas I'm controlling.

Then it makes me wonder why variable `three_dee` for example, when we define `let three_dee = createGraphics(xxx)` can be called directly, but not the `leftQuad` from `let leftQuad = pMapper.createQuadMap(xxx)`. They are all canvas aren't they? 

**A**: Dont' know if I'm right, according to Week7-LLM, `leftQuad` is **not a canvas but a controller** of mapping, its more like the frame of shape, for the mapper, and contains all those points and handles, etc.

![Protection Umbrella](Week7.IMG_9939.HEIC)