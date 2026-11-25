# Week 11 Reflection – Squirrel Watch

For this project, I decided to create a black-and-white map that shows recent squirrel observations in New York City. I have always thought squirrels are cute and interesting. I have also made a documentary about urban wildlife before, mainly focusing on squirrels. So this project is not only a data visualization exercise for me. I also want to make something useful for my own research and future filming. My idea is to create a dark map with a semi-transparent grid and white outlines of New York City. Each squirrel observation will appear as a small glowing white dot.

## Understanding the Data

At first, I found it difficult to understand what a dataset actually contained. I thought a database might be something more complicated than a table. I also wondered how a table on a website could become an API.

Through this process, I started to understand the differences between a database, a dataset, an API, and JSON. A dataset is a collection of related information. An API is a way for my code to request that information from another website or server. JSON is one format used to organize and return the data.

I explored two sources: The Squirrel Census and iNaturalist. The Squirrel Census has interesting information about squirrels, including their locations, fur colors, and behaviors. However, its Central Park survey mainly contains historical observations from 2018. It is useful for studying a specific survey, but it is not suitable for finding recent observations every day. So I became more interested in iNaturalist because people continue to upload new observations. It provides information such as species names, observation dates, geographic coordinates, photos, and sometimes descriptions. One important thing I learned is that I should not try to understand every field in a dataset at once. Instead, I should first ask a few basic questions:

- What does one row represent?
- Which fields tell me where something happened?
- Which fields tell me when it happened?
- Which fields tell me what species was observed?
- Which fields describe its behavior or other details?

Once I started asking these questions, the data became much easier to understand.

## Learning How to Read and Use an API

At first, I did not understand what happened when I called `loadJSON()`. I was confused about why there were two `function()` parameters inside it. I eventually learned about callbacks [Thank for our weekly LLM]. The first function is called when the data loads successfully, and the second one handles errors. The data downloaded from the server is passed into the first function as a parameter. Compared with `async/await`, they are two different ways to handle asynchronous operations. They both help us deal with something that takes time, such as downloading information from the internet / uploading a song.

## Understanding GeoJSON

One of my biggest difficulties was importing the boundaries of New York City. I discovered that geographic information can have different geometry types, such as `Polygon` and `MultiPolygon`. These are not special JavaScript functions. They are string values provided by the GeoJSON data itself. I used `if` and `else if` to check the geometry type. A Polygon can be drawn directly, while a MultiPolygon contains multiple separate polygons, so I needed a `for` loop to draw them one by one.

Another important part was converting geographic coordinates into p5.js canvas coordinates. I learned that longitude controls the horizontal position (X), while latitude controls the vertical position (Y). Since geographic maps and the p5.js canvas have opposite vertical directions, I had to reverse the range in the `map()` function when converting latitude.


## Small Functions and Things I Learned

During this process, I learned several functions that I had not fully understood before.

- **`toFixed(2)`**: Keeps two decimal places when displaying a number. I used it to make longitude and latitude labels shorter and easier to read. I also learned that it returns a string, not a number.

- **`padStart(2, "0")`**: Adds a zero at the beginning when a string has fewer than two characters. I used it to format dates, such as changing `4` into `04`, so the date could follow the `YYYY-MM-DD` format.

- **`Number()`**: Converts a value into a number, which is important when using coordinates in mathematical calculations.

- **`Number.isFinite()`**: Checks whether a value is a valid, finite number.

- **`continue`**: Skips the current item in a loop and moves to the next one.

I also learned to use `console.log()` much more often. Instead of guessing why something was not working, I started checking the actual data in the browser console. This helped me discover the API response structure, check the number of observations, and find the correct coordinate fields.

## What Am I Trying to Illustrate, Reveal, or Argue For?

I mainly want to illustrate where squirrels have recently been observed in New York City. I am not trying to show the actual population of squirrels or track the exact movement of one individual squirrel. Each dot represents one observation record, not necessarily one unique animal. What I want to reveal is the presence and distribution of urban wildlife around us. Squirrels are part of the city, but we often see them as ordinary background animals without paying much attention to where they live, when they appear, or what they are doing.

By turning observation records into a map, I hope to make these small pieces of information easier to see and explore. So if I am doing further documenting of them I know where exactly I should go. Cuz' it simplifies the original data visually.

## Am I Working With Existing Data or Refashioning It?

I am using data that already exists on iNaturalist. I am not collecting all the observations myself or building a new database. However, I am refashioning the existing data into a different form. I want the map to request the latest observations every time the page is opened, rather than showing a fixed collection of old records.

## Final Thoughts

This process was much more difficult than I expected. But each problem helped me understand another part of the process. I learned that reading and understanding the data is just as important as writing the drawing code. But when I finally see the real squirrel observations appear on my map. It made the connection between data and the physical world feel much more real to me.