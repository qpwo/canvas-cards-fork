// Boxer
const canvas = document.getElementById('boxer');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

boxer();

function boxer() {
  const MIN = 100;
  const MAX = 500;

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

  let widths = [];
  for (let w = 0; w < width;) {
    widths.push(rangeFloor(MIN, MAX));
    w = w + widths.at(-1);
  }

  let heights = [];
  for (const _ of widths) {
    const arr = [];
    for (let h = 0; h < height;) {
      arr.push(rangeFloor(MIN, MAX));
      h = h + arr.at(-1);
    }
    heights.push(arr);
  }
  const hasGradient = heights.map((arr) => arr.map(() => 1 + Math.random() > 0.7));
  const colorArrs = hasGradient.map((arr) => arr.map(has => has ? [pick(colors), pick(colors)] : pick(colors)));
  const scaleW = widths.map(() => 1 + Math.random() * .01 - .005);
  const scaleH = heights.map((arr) => arr.map(() => 1 + Math.random() * .01 - .005));

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
  function normalize() {
    const totalW = widths.reduce((a, b) => a + b);
    widths = widths.map(w => w * 1.1 * width / totalW);
    for (let i = 0; i < heights.length; i++) {
      const totalH = heights[i].reduce((a, b) => a + b);
      heights[i] = heights[i].map(h => h * height / totalH);
    }
  }
  function update() {
    for (let i = 0; i < widths.length; i++) {
      widths[i] *= scaleW[i];
      if (widths[i] < MIN || widths[i] > MAX) {
        scaleW[i] = 2 - scaleW[i];
      }
      for (let j = 0; j < heights[i].length; j++) {
        heights[i][j] *= scaleH[i][j];
        if (heights[i][j] < MIN || heights[i][j] > MAX) {
          scaleH[i][j] = 2 - scaleH[i][j];
        }
      }
    }
    normalize();
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
