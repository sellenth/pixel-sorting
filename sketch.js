const canvasSketch = require("canvas-sketch");
const load = require("load-asset");

const settings = {
  //animate: "true",
  //duration: 5,
};

//https://en.wikipedia.org/wiki/Color_difference
const colorDiff = (p1, p2) => {
  const R1 = p1[0];
  const G1 = p1[1];
  const B1 = p1[2];
  0;
  const R2 = p2[0];
  const G2 = p2[1];
  const B2 = p2[2];

  const dR = R1 - R2;
  const dG = G1 - G2;
  const dB = B1 - B2;

  const rBar = R1 + R2 / 2;

  return Math.sqrt(
    2 + rBar / 256 + dR ** 2 + 4 * dG ** 2 + (2 + (255 - rBar) / 256) * dB ** 2
  );
};

const sortRow = (arr, width, row) => {
  const diffs = [];
  for (var i = 0; i < width * 4; i += 4) {
    const pixlStart = width * 4 * row + i;
    const pixel = arr.slice(pixlStart, pixlStart + 4);
    diffs.push([colorDiff([0, 0, 0], pixel), pixel]);
  }
  diffs.sort((p1, p2) => {
    if (p1[0] > p2[0]) {
      return 1;
    } else if (p1[0] == p2[0]) {
      return 0;
    }
    return -1;
  });
  return diffs;
};

const sortImg = (arr, width, height) => {
  const diffs = [];
  const pixels = [];
  for (var i = 0; i < height; i++) {
    diffs.push(sortRow(arr, width, i));
  }
  diffs.forEach((row) => {
    row.forEach((pxl) => {
      pixels.push(...pxl[1]);
    });
  });
  return pixels;
};

// We create an 'async' sketch
canvasSketch(async ({ update }) => {
  // Await the image loader, it returns the loaded <img>
  const image = await load("assets/reagan.jpg");

  // Once the image is loaded, we can update the output
  // settings to match it
  const margin = 40;
  update({
    dimensions: [image.width + margin, image.height + margin],
  });

  // Now render our sketch
  return ({ context, width, height, playhead }) => {
    const t = Math.sin(playhead * Math.PI);
    // Draw the loaded image to the canvas
    context.drawImage(image, 0, 0, width - margin, height - margin);

    // Extract bitmap pixel data
    const pixels = context.getImageData(0, 0, width - margin, height - margin);

    // Manipulate pixel data
    // ... sort & glitch pixels ...
    pixels.data.forEach((pixVal, idx) => {
      if (idx % 4) {
        pixels.data[idx] = pixVal - Math.floor(t * 255);
      }
    });

    const newPixels = sortImg(pixels.data, width - margin, height - margin);
    pixels.data.forEach((_, idx) => {
      pixels.data[idx] = newPixels[idx];
    });

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Put new pixels back into canvas
    context.putImageData(pixels, margin / 2, margin / 2);
  };
}, settings);
