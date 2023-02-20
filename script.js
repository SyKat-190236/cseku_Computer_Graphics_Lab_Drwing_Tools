const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let lines = [];
let currentLine = null;
let isDrawing = false;

function drawLine(line) {
  const x0 = line.x0;
  const y0 = line.y0;
  const x1 = line.x1;
  const y1 = line.y1;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const m = dy / dx;

  let x = x0;
  let y = y0;

  if (dx > dy) {
    for (let i = 0; i <= dx; i++) {
      ctx.fillRect(x, y, 1, 1);
      x++;
      y += m;
    }
  } else {
    for (let i = 0; i <= dy; i++) {
      ctx.fillRect(x, y, 1, 1);
      x += 1/m;
      y++;
    }
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach(function(line) {
    drawLine(line);
  });
}

function removeLine(line) {
  lines = lines.filter(function(l) {
    return l !== line;
  });
  redraw();
}

canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  currentLine = {
    x0: e.offsetX,
    y0: e.offsetY,
    x1: e.offsetX,
    y1: e.offsetY
  };
});

canvas.addEventListener('mousemove', function(e) {
  if (isDrawing) {
    currentLine.x1 = e.offsetX;
    currentLine.y1 = e.offsetY;
    redraw();
    drawLine(currentLine);
  }
});

canvas.addEventListener('mouseup', function(e) {
  isDrawing = false;
  currentLine.x1 = e.offsetX;
  currentLine.y1 = e.offsetY;
  lines.push(currentLine);
  currentLine = null;
});

canvas.addEventListener('dblclick', function(e) {
  lines.forEach(function(line) {
    const x0 = line.x0;
    const y0 = line.y0;
    const x1 = line.x1;
    const y1 = line.y1;
    const distance =
      Math.abs((y1-y0)*e.offsetX - (x1-x0)*e.offsetY + x1*y0 - y1*x0) /
      Math.sqrt(Math.pow(y1-y0, 2) + Math.pow(x1-x0, 2));
    if (distance <= 5) {
      removeLine(line);
    }
  });
});

const removeLineButton = document.getElementById('remove-line-button');
removeLineButton.addEventListener('click', function(e) {
  lines.pop();
  redraw();
});
