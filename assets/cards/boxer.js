// Boxer
const canvas = document.getElementById('boxer');
const context = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 500;

const width = canvas.width;
const height = canvas.height;

boxer();

function boxer() {

  // Colors
  const yellow = '#FEAC00';
  const colors = [
    '#FEAC00',
    '#FF5630',
    '#396C7D',
    '#83757D',
    '#2C3F54',
    '#F0F0EC',
    '#2A2A41',
    '#766B4F',
    '#F4AAAB',
    '#CF3B45',
  ];

  const widths = [];
  for (let w = 0; w < width;) {
    widths.push(rangeFloor(10, 50));
    w = w + widths.at(-1);
  }

  const heights = [];
  for (const _ of widths) {
    const arr = [];
    for (let h = 0; h < height;) {
      arr.push(rangeFloor(10, 50));
      h = h + arr.at(-1);
    }
    heights.push(arr);
  }
  const hasGradient = heights.map((arr) => arr.map(() => Math.random() > 0.7));
  const colorArrs = hasGradient.map((arr) => arr.map(has => has ? [pick(colors), pick(colors)] : pick(colors)));

  // Backgrounds
  context.fillStyle = yellow;
  context.fillRect(0, 0, width, height);
  // Double loop to draw boxes

  window.count = 0;
  function draw() {
    count++;
    let w = 0;
    for (let i = 0; i < widths.length; i++) {
      const boxWidth = widths[i + 1];
      let h = 0;
      for (let j = 0; j < heights[i].length; j++) {
        let boxHeight = heights[i][j];

        // Randomly add gradients
        if (hasGradient[i][j]) {
          const [c1, c2] = colorArrs[i][j];
          let grd = context.createLinearGradient(w, h, w, h + boxHeight);
          grd.addColorStop(0, c1);
          grd.addColorStop(1, c2);
          context.fillStyle = grd;
        } else {
          context.fillStyle = colorArrs[i][j];
        }

        // Draw the boxes
        context.fillRect(w, h, boxWidth, boxHeight);

        h = h + boxHeight;
      }
      w += boxWidth;
    }
  }
  function update() {
    for (let i = 0; i < widths.length; i++) {
      widths[i] *= (1 + Math.random() * .1 - .05);
      for (let j = 0; j < heights[i].length; j++) {
        heights[i][j] *= (1 + Math.random() * .1 - .05);
      }
    }
  }
  function frame() {
    update();
    draw();
    requestAnimationFrame(frame);
  }
  frame();
  function rangeFloor(min, max) {
    // Return a random whole number between min and max
    return Math.floor(Math.random() * (max - min) + min);
  }

  function pick(array) {
    // Pick a random item out of an array
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }
}
