const rows = 4;
const cols = 4;
var board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
// var board = [
//   [8, 128, 2, 16],
//   [32, 1024, 1024, 4],
//   [2, 8, 64, 8],
//   [2, 2, 128, 4],
// ];

const btn = document.querySelector("button");
const intro = document.querySelector("span");
const hide = document.querySelector(".intro");
const bd = document.querySelector(".board");
const space = document.querySelector(".space");

btn.addEventListener("click", () => {
  window.location.reload();
});

intro.addEventListener("click", () => {
  hide.classList.remove("hide");
  space.classList.add("hide");
  setTimeout(() => {
    hide.classList.add("hide");
    space.classList.remove("hide");
  }, 3000);
});

const updateTile = (tile, num) => {
  tile.innerText = num > 0 ? num : "";
  tile.classList = "tile";
  if (num > 0) {
    tile.classList.add("x" + num.toString());
  }
  if (num === 2048) {
    setTimeout(() => {
      alert("You Win!");
      window.location.reload();
    }, 100);
  }
};

handleRow = (row, reverse) => {
  row = reverse ? row.reverse() : row;
  row = row.filter((num) => num !== 0);
  let i = 0;
  while (i < row.length - 1) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
    i++;
  }
  row = row.filter((num) => num !== 0);
  while (row.length < cols) {
    row.push(0);
  }
  row = reverse ? row.reverse() : row;
  return row;
};

handleLeft = (reverse = false) => {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = handleRow(row, reverse);
    board[r] = row;
    for (let c = 0; c < cols; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];
      updateTile(tile, num);
    }
  }
};

handleRight = () => {
  handleLeft(true);
};

handleUp = (reverse = false) => {
  for (let c = 0; c < cols; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = handleRow(row, reverse);
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];
      updateTile(tile, num);
    }
  }
};

handleDown = () => {
  handleUp(true);
};

handleKeyup = (e) => {
  switch (e.key) {
    case "ArrowLeft":
      handleLeft();
      addTile();
      break;
    case "ArrowRight":
      handleRight();
      addTile();
      break;
    case "ArrowUp":
      handleUp();
      addTile();
      break;
    case "ArrowDown":
      handleDown();
      addTile();
      break;
    default:
      break;
  }
};

const addTile = () => {
  if (board.flat().filter((value) => value === 0).length === 0) {
    alert("Game Over!");
    window.location.reload();
    return;
  }
  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (board[r][c] === 0) {
      board[r][c] = 2;
      const tile = document.getElementById(`${r}-${c}`);
      updateTile(tile, 2);
      found = true;
    }
  }
};

const initGame = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      const num = board[r][c];
      updateTile(tile, num);
      document.querySelector(".board").append(tile);
    }
  }
  addTile();
  addTile();
};

initGame();

document.addEventListener("keyup", handleKeyup);

// 适应手机端滑动
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const detectSwipeDirection = () => {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平方向滑动
    if (deltaX > 0) {
      // 向右滑动
      handleRight();
    } else {
      // 向左滑动
      handleLeft();
    }
  } else {
    // 垂直方向滑动
    if (deltaY > 0) {
      // 向下滑动
      handleDown();
    } else {
      // 向上滑动
      handleUp();
    }
  }

  // 添加一个新的 tile
  addTile();
};

bd.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault(); // 阻止默认行为
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: false } // 重要：显式设置为非被动
);

bd.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // 阻止默认行为
  },
  { passive: false } // 重要：显式设置为非被动
);

bd.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault(); // 阻止默认行为
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    detectSwipeDirection();
  },
  { passive: false } // 重要：显式设置为非被动
);
