const canvasSketch = require("canvas-sketch");

// Sketch parameters
const settings = {
  dimensions: "a4",
  pixelsPerInch: 300,
  units: "in",
  animate: "true",
  duration: 5,
};

// Artwork function
const sketch = () => {
  return ({ playhead, context, width, height }) => {
    // Margin in inches
    const margin = 1 / 4;

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Gradient foreground
    const t = Math.sin(playhead * Math.PI);
    const fill = context.createLinearGradient(0, 0, width, height);
    const color = 50 * t;
    fill.addColorStop(0, `hsl(0, 100%, ${color}%)`);
    const color2 = 50 * (1 - t);
    fill.addColorStop(1, `hsl(240, 100%, ${color2}%)`);

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);
  };
};

// Start the sketch
canvasSketch(sketch, settings);
