let boxSize = 4;
let boxSizeKey = "boxSize";
let userStateKey = 'userState';

let boardSize = boxSize;
let gameBoardArray;
let checkBoardArray;
let countMovesNumber;
let timerId;

let isSoundOn = true;

let buttonStart = document.getElementById("start");
let buttonStop = document.getElementById("stop");
let buttonSave = document.getElementById("save");
let buttonResults = document.getElementById("results");

let seconds = 0;
let minutes = 0;

let userState = { gameBoardArray: [], minutes: 0, seconds: 0, countMoves: 0 };

let countMoves = document.getElementsByClassName(
  "game-indicators-moves__value"
)[0];
let timer = document.getElementsByClassName("game-indicators-time__value")[0];

let game_board = document.getElementsByClassName("game-board")[0];

newGame();

buttonStart.addEventListener(
  "click",
  function () {
    localStorage.removeItem(userStateKey);
    newGame();
  },
  false
);

buttonStop.addEventListener(
  "click",
  function () {    
    if (isSoundOn) { 
      isSoundOn = false;
    } else {
      isSoundOn = true;
    }
  },
  false
);

buttonSave.addEventListener(
  "click",
  function () {    
    userState.gameBoardArray = gameBoardArray;
    userState.countMoves = countMovesNumber;
    userState.minutes = minutes;
    userState.seconds = seconds;

    userStateString = JSON.stringify(userState);

    localStorage.setItem(userStateKey, userStateString);
    //localStorage.setItem(boxSizeKey, boxSize);
  },
  false
);

setEventClickSizesButtons();

function newGame() {
  let userState = localStorage.getItem(userStateKey);

  if (userState) {
    let userStateLoaded = JSON.parse(userState);
    gameBoardArray = userStateLoaded.gameBoardArray;
    boxSize = Math.sqrt(gameBoardArray.length);
    boardSize = boxSize;

    console.log(boardSize);

    countMovesNumber = userStateLoaded.countMoves;
    minutes = Number(userStateLoaded.minutes);
    seconds = Number(userStateLoaded.seconds);
    startTimer();    
  } else {
    gameBoardArray = getFilledArr(boxSize);
    shuffleArr(gameBoardArray);
    countMovesNumber = 0;
    seconds = 0;
    minutes = 0;
  }
  
  checkBoardArray = getFilledArr(boxSize);

  refreshGameBoard(gameBoardArray);

  setCountMoves(countMovesNumber);

  clearInterval(timerId);
  
  timerId = setInterval(() => {
    startTimer();
  }, 1000);
}

function setCountMoves(countMovesNumber) {
  countMoves.textContent = countMovesNumber;
}

function startTimer() {
  seconds += 1;
  if (seconds > 59) {
    minutes += 1;
    if (minutes > 59) {
      minutes -= 1;
      seconds -= 1;
    } else {
      seconds = 0;
    }
  }

  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;

  let timer = m + ":" + s;
  document.getElementsByClassName(
    "game-indicators-time__value"
  )[0].textContent = timer;
}

function refreshGameBoard(gameBoardArray) {
  
  game_board.innerHTML = "";
  game_board.classList.add('game-board'+boardSize);
  gameBoardArray.forEach((n) => {
    let wrapDiv = document.createElement("div");
    wrapDiv.classList.add("game-board__tile_wrapper");

    let div = document.createElement("div");
    div.classList.add("game-board__tile");
    div.classList.add("game-board__tile" + boardSize);
    
    if (n === 0) {
      div.classList.add("game-board__tile_empty");
    } else {
      div.innerHTML = n;
    }
    wrapDiv.append(div);
    game_board.append(wrapDiv);
  });

  let collTile = document.getElementsByClassName("game-board__tile");
  for (let i = 0; i < collTile.length; i++) {
    if (Number(collTile[i].textContent) > 0) {
      collTile[i].addEventListener(
        "click",
        function () {
          clickTile(this);
        },
        false
      );
    }
  }
}

function getFilledArr(boxSize) {
  let arr = [...new Array(boxSize * boxSize).keys()];
  arr.shift();
  arr.push(0);
  return arr;
}

function shuffleArr(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
}

function clickTile(tile) {
  let indexOTile = gameBoardArray.findIndex((n) => n === 0) + 1;
  let posOTileX = indexOTile % boxSize === 0 ? boxSize : indexOTile % boxSize;
  let posOTileY = Math.ceil(indexOTile / boxSize);

  let tileNumber = Number(tile.firstChild.textContent);
  let indexClickTile = gameBoardArray.findIndex((n) => n === tileNumber) + 1;
  console.log(indexClickTile);
  let posClickTileX =
    indexClickTile % boxSize === 0 ? boxSize : indexClickTile % boxSize;
  let posClickTileY = Math.ceil(indexClickTile / boxSize);

  console.log(
    `${posClickTileY} === ${posOTileY} && ${posClickTileX} === ${posOTileX}`
  );


    if (posClickTileY === posOTileY + 1 && posClickTileX === posOTileX) {
    moveTile(tile, indexClickTile - 1, indexOTile - 1, "shift-top" + boardSize);
  } else if (posClickTileY === posOTileY - 1 && posClickTileX === posOTileX) {
    moveTile(tile, indexClickTile - 1, indexOTile - 1, "shift-bottom" + boardSize);
  } else if (posClickTileY === posOTileY && posClickTileX === posOTileX + 1) {
    moveTile(tile, indexClickTile - 1, indexOTile - 1, "shift-left" + boardSize);
  } else if (posClickTileY === posOTileY && posClickTileX === posOTileX - 1) {
    moveTile(tile, indexClickTile - 1, indexOTile - 1, "shift-right" +boardSize);
  }

  if (compareArrays(gameBoardArray, checkBoardArray)) {
    setTimeout(completed, 200);
  }
}

function moveTile(tile, indexClickTile, indexEmptyTile, className) {
  swapByIndex(gameBoardArray, indexClickTile, indexEmptyTile);
  tile.classList.add(className);
  setTimeout(refreshGameBoard, 200, gameBoardArray);
  countMovesNumber += 1;

  if (isSoundOn) {
    let audio = new Audio();
    audio.src = '../../assets/sounds/chime-alarm-multimedia_mktirt4u.mp3';
    audio.autoplay = true;
  }
  
  setCountMoves(countMovesNumber);
}

function completed() {
  alert(`Hooray! You solved the puzzle in ${minutes}:${seconds} and ${countMovesNumber} moves!`);
}

function swapByIndex(array, firstIndex, secondIndex) {
  tempValue = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = tempValue;
}

function compareArrays(firstArray, secondArray) {
  for (let i = 0; i < firstArray.length; i++) {
    if (firstArray[i] !== secondArray[i]) {
      return false;
    }
  }
  return true;
}

function setEventClickSizesButtons() {
  let collButtonsSizes = document.getElementsByClassName(
    "game-others-sizes__value"
  );
  for (let index = 0; index < collButtonsSizes.length; index++) {
    collButtonsSizes[index].addEventListener(
      "click",
      function () {
        localStorage.removeItem(userStateKey);
        game_board.classList.remove('game-board3', 'game-board4', 'game-board5', 'game-board6', 'game-board7', 'game-board8');
       
        boardSize = Number(this.dataset.value);
        let boardSizeText = this.textContent; 
        document.getElementsByClassName('game-current-size__value')[0].textContent = boardSizeText;
        game_board.classList.add('game-board' + boardSize);
        boxSize = boardSize;

        newGame();
      },
      false
    );
  }
}

/* function refreshSizeBoard (sizeBoard) {
        
  game_board.classList.remove('game-board3', 'game-board4', 'game-board5', 'game-board6', 'game-board7', 'game-board8');
   
  boardSize = sizeBoard;  
  document.getElementsByClassName('game-current-size__value')[0].textContent = boardSizeText;
  game_board.classList.add('game-board' + boardSize);
  boxSize = boardSize;

  newGame();
} */