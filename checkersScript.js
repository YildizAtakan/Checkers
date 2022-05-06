/*MIS 233 Project 1 -Bahri Atakan Yıldız- -2017502129- */

/*Declared as constants becasue they will not change*/
const clickableShade = '<svg width="100" height="100"><circle cx="40" cy="40" r="30" stroke="#9bfe08" stroke-width="5" fill="yellow" style="fill-opacity:.0;">Photo Err.</circle></svg>';
const goldenWhite = '<img src="goldenwhite.png" width="80px" height="80px">'; // White king piece
const goldenBlack = '<img src="goldenblack.png" width="80px" height="80px">'; // Black king piece
const blackPiece = '<img src="black.png" width="80px" height="80px">'; // black piece
const whitePiece = '<img src="white.png" width="80px" height="80px">'; // white piece
const emptys = '<img src="transperant.png" width="0px" height="0px">'; //indicator invisible picture for empty squares
const select = document.getElementById("myTable");
const cellsOfTheTable = document.getElementsByTagName("td");
const cellsOfTheTableLength = cellsOfTheTable.length;


/*Variable initalization*/
var playWithComputer = window.confirm("Do you want to play against computer?\nOk (Against Computer)\nCancel (Two Player)");
var currentPiece; //to store selected piece data
var currentCell; //to store selected piece cell data
var moveTimeBlack = false; //to determine which side will move
var forceJump = false; //indicate if we have to jump
var lastCell; // holding previously selected cell

document.getElementById("turn").innerHTML = (playWithComputer ? "Versus Computer" : "Turn: White");

/*MAKE THE BOARD CLICKABLE BY CREATING ONCLICK FUNTION FOR TD'S*/
for (let i = 0; i < cellsOfTheTableLength; i++) {
  cellsOfTheTable[i].innerHTML = emptys;
  cellsOfTheTable[i].onclick = function () {
    getCell(this);
  };
}

//INITIALIZATION OF THE BOARD

select.rows[0].cells[1].innerHTML = blackPiece;
select.rows[0].cells[3].innerHTML = blackPiece;
select.rows[0].cells[5].innerHTML = blackPiece;
select.rows[0].cells[7].innerHTML = blackPiece;

select.rows[1].cells[0].innerHTML = blackPiece;
select.rows[1].cells[2].innerHTML = blackPiece;
select.rows[1].cells[4].innerHTML = blackPiece;
select.rows[1].cells[6].innerHTML = blackPiece;

select.rows[2].cells[1].innerHTML = blackPiece;
select.rows[2].cells[3].innerHTML = blackPiece;
select.rows[2].cells[5].innerHTML = blackPiece;
select.rows[2].cells[7].innerHTML = blackPiece;

select.rows[5].cells[0].innerHTML = whitePiece;
select.rows[5].cells[2].innerHTML = whitePiece;
select.rows[5].cells[4].innerHTML = whitePiece;
select.rows[5].cells[6].innerHTML = whitePiece;

select.rows[6].cells[1].innerHTML = whitePiece;
select.rows[6].cells[3].innerHTML = whitePiece;
select.rows[6].cells[5].innerHTML = whitePiece;
select.rows[6].cells[7].innerHTML = whitePiece;

select.rows[7].cells[0].innerHTML = whitePiece;
select.rows[7].cells[2].innerHTML = whitePiece;
select.rows[7].cells[4].innerHTML = whitePiece;
select.rows[7].cells[6].innerHTML = whitePiece;


function computerMove() { // functionality for against computer mode
  let computerArray = [];
  let computerArray2 = [];
  var piece;

  do {

    for (let i = 0; i < cellsOfTheTableLength; i++) {
      if (cellsOfTheTable[i].innerHTML === blackPiece || cellsOfTheTable[i].innerHTML === goldenBlack) {
        computerArray.push(cellsOfTheTable[i]);
      }
    }
    piece = computerArray[Math.floor(Math.random() * computerArray.length)];
    if (piece.innerHTML === blackPiece) {
      displayClickablePlacesForBlack(parseInt(piece.getAttribute("row")), parseInt(piece.getAttribute("col")))
    } else displayClickablePlacesForGoldenBlack(parseInt(piece.getAttribute("row")), parseInt(piece.getAttribute("col")));

    for (let i = 0; i < cellsOfTheTableLength; i++) {
      if (cellsOfTheTable[i].innerHTML === clickableShade) {
        computerArray2.push(cellsOfTheTable[i]);
      }
    }
  } while (computerArray2.length === 0)
  let whereWeJumped = computerArray2[Math.floor(Math.random() * computerArray2.length)];
  placeCellData(whereWeJumped, piece);
  forceJump ? removeJumpedItem(whereWeJumped, piece) : null;
  computerArray = [];
  computerArray2 = [];
  clearSymbolthatShowClickable();
  moveTimeBlack = false;
}

function clearSymbolthatShowClickable() { // clear green cirlces which was used to show where we can move
  for (var i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === clickableShade) {
      cellsOfTheTable[i].innerHTML = emptys;
    }
  }
}

function gameFinishCheck() { // check if the game finisher conditions apply
  if (checkNoBlackLeft()) {
    alert("WHITE WON!\nNo black pieces left!");
    window.location.reload();

  } else if (checkNoWhiteLeft()) {
    alert("BLACK WON!\nNo white pieces left!");
    window.location.reload();

  } else if (blackNoPlaceToMove()) {
    alert("WHITE WON!\nBlack has no place to move!");
    window.location.reload();

  } else if (whiteNoPlaceToMove()) {
    alert("BLACK WON!\nWhite has no place to move!");
    window.location.reload();
  }
}

function mover(that) { // move cell to the new place
  if (placeCellData(that, currentCell)) {
    makeAllBordersBlack();
    moveTimeBlack = !moveTimeBlack;
    (document.getElementById("turn").innerHTML = (playWithComputer) ? "Versus Computer" : moveTimeBlack ? "Turn: Black" : "Turn: White");
    forceJump ? removeJumpedItem(that, lastCell) : null;
    if (playWithComputer && moveTimeBlack) {
      setTimeout(computerMove, 80)
    }
  }
  gameFinishCheck();
}

function makeAllBordersBlack() { // to make all borders black
  for (var i = 0; i < cellsOfTheTableLength; i++) {
    cellsOfTheTable[i].style.borderColor = "black";
  }
}

function selector(that) { // for selecting piece to move
  lastCell = that;
  makeAllBordersBlack();
  that.style.borderColor = "red";
  if (moveTimeBlack === false &&
    (that.innerHTML === whitePiece || that.innerHTML === goldenWhite)) {
    getCurrentCellData(that);
    displayClickablePlaces(that, parseInt(that.getAttribute("row")), parseInt(that.getAttribute("col")));
  } else if (moveTimeBlack === true && (that.innerHTML === blackPiece || that.innerHTML === goldenBlack)) {
    getCurrentCellData(that);
    displayClickablePlaces(that, parseInt(that.getAttribute("row")), parseInt(that.getAttribute("col")));

  }
}

function getCell(that) { // main function for selecting and placing 
  if ((moveTimeBlack && that.innerHTML === blackPiece) || (!moveTimeBlack && that.innerHTML === whitePiece) || (moveTimeBlack && that.innerHTML === goldenBlack) || (!moveTimeBlack && that.innerHTML === goldenWhite)) {
    clearSymbolthatShowClickable();
    selector(that);
  } else {
    mover(that);
  }
}


function removeJumpedItem(newCell, lastCell) { // remove the place users jumped
  var b = parseInt(newCell.getAttribute("row")) - parseInt(lastCell.getAttribute("row"));
  var c = parseInt(newCell.getAttribute("col")) - parseInt(lastCell.getAttribute("col"));
  var d = parseInt(newCell.getAttribute("row")) + parseInt(lastCell.getAttribute("row"));
  var e = parseInt(newCell.getAttribute("col")) + parseInt(lastCell.getAttribute("col"));
  if (forceJump) {
    if (b === 2 && c === 2) {
      select.rows[d / 2].cells[e / 2].innerHTML = emptys;
    } else if (b === 2 && c === -2) {
      select.rows[d / 2].cells[e / 2].innerHTML = emptys;
    } else if (b === -2 && c === 2) {
      select.rows[d / 2].cells[e / 2].innerHTML = emptys;
    } else if (b === -2 && c === -2) {
      select.rows[d / 2].cells[e / 2].innerHTML = emptys;
    }
  }
}


function getCurrentCellData(that) { // getting current cell data to memory
  currentPiece = that.innerHTML;
  currentCell = that;
}


function placeCellData(newPlace, oldPlace) { // placing cell data from memory to a new td
  if (newPlace.innerHTML === clickableShade) {
    if (
      parseInt(newPlace.getAttribute("row")) === 0 && oldPlace.innerHTML === whitePiece) {
      newPlace.innerHTML = goldenWhite; /*UPFGRADE THE PIECE*/
      oldPlace.innerHTML = emptys; /*CLEAR THE OLD LOCATION*/
      clearSymbolthatShowClickable();

    } else if (
      parseInt(newPlace.getAttribute("row")) === 7 && oldPlace.innerHTML === blackPiece) {
      newPlace.innerHTML = goldenBlack; /*UPGRADE THE PIECE*/
      oldPlace.innerHTML = emptys; /*CLEAR THE OLD LOCATION*/
      clearSymbolthatShowClickable();

    } else {
      newPlace.innerHTML = oldPlace.innerHTML; /*MOVE THE GRABBED PIECE*/
      oldPlace.innerHTML = emptys; /*CLEAR THE OLD LOCATION*/
      clearSymbolthatShowClickable();

    }
    return true;
  } else return false;
}


function checkNoPlaceToMove() { // check if there isn't any place to move
  for (let i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === clickableShade) {
      return false;
    }
  }
  return true;
}

function blackNoPlaceToMove() { // check if black has no place to move
  for (let i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === blackPiece) {
      displayClickablePlacesForBlack(parseInt(cellsOfTheTable[i].getAttribute("row")), parseInt(cellsOfTheTable[i].getAttribute("col")))
    } else if (cellsOfTheTable[i].innerHTML === goldenBlack) {
      displayClickablePlacesForGoldenBlack(parseInt(cellsOfTheTable[i].getAttribute("row")), parseInt(cellsOfTheTable[i].getAttribute("col")));
    }
  }
  let retVal = checkNoPlaceToMove();
  clearSymbolthatShowClickable();
  return retVal;

}

function whiteNoPlaceToMove() { // check if white has no place to move
  for (let i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === whitePiece) {
      displayClickablePlacesForWhite(parseInt(cellsOfTheTable[i].getAttribute("row")), parseInt(cellsOfTheTable[i].getAttribute("col")))
    } else if (cellsOfTheTable[i].innerHTML === goldenWhite) {
      displayClickablePlacesForGoldenWhite(parseInt(cellsOfTheTable[i].getAttribute("row")), parseInt(cellsOfTheTable[i].getAttribute("col")));
    }
  }
  let retVal = checkNoPlaceToMove();
  clearSymbolthatShowClickable();
  return retVal;
}

function checkNoBlackLeft() { // check if no black pieces left on the board
  for (let i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === blackPiece || cellsOfTheTable[i].innerHTML === goldenBlack) {
      return false;
    }
  }
  return true;
}

function checkNoWhiteLeft() { // check if no white pieces left on the board
  for (let i = 0; i < cellsOfTheTableLength; i++) {
    if (cellsOfTheTable[i].innerHTML === whitePiece || cellsOfTheTable[i].innerHTML === goldenWhite) {
      return false;
    }
  }
  return true;
}


function displayClickablePlacesForWhite(row, col) { // display movable places for selected white pieces
  if (whiteJumpCheckUpLeft(row, col) ||
    whiteJumpCheckUpRight(row, col) ||
    whiteJumpCheckLowLeft(row, col) ||
    whiteJumpCheckLowRight(row, col)
  ) {
    forceJump = true;
    try {
      if (whiteJumpCheckUpLeft(row, col)) {
        select.rows[row - 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {
      err.printStackTrace
    }
    try {
      if (whiteJumpCheckUpRight(row, col)) {
        select.rows[row - 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {
      err.printStackTrace;
    }
    try {
      if (whiteJumpCheckLowLeft(row, col)) {
        select.rows[row + 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (whiteJumpCheckLowRight(row, col)) {
        select.rows[row + 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
  } else {
    forceJump = false;
    try {
      if (
        select.rows[row - 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row - 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}
  }
}

function displayClickablePlacesForBlack(row, col) { // display movable places for selected black pieces
  if (
    blackJumpCheckLowLeft(row, col) ||
    blackJumpCheckLowRight(row, col) ||
    blackJumpCheckUpLeft(row, col) ||
    blackJumpCheckUpRight(row, col)
  ) {
    forceJump = true;
    try {
      if (blackJumpCheckUpLeft(row, col)) {
        select.rows[row - 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckUpRight(row, col)) {
        select.rows[row - 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckLowLeft(row, col)) {
        select.rows[row + 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckLowRight(row, col)) {
        select.rows[row + 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
  } else {
    forceJump = false;
    try {
      if (
        select.rows[row + 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row + 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}
  }

}

function displayClickablePlacesForGoldenBlack(row, col) { // display movable places for selected black king pieces
  if (
    blackJumpCheckLowLeft(row, col) ||
    blackJumpCheckLowRight(row, col) ||
    blackJumpCheckUpLeft(row, col) ||
    blackJumpCheckUpRight(row, col)
  ) {
    forceJump = true;
    try {
      if (blackJumpCheckUpLeft(row, col)) {
        select.rows[row - 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckUpRight(row, col)) {
        select.rows[row - 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckLowLeft(row, col)) {
        select.rows[row + 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (blackJumpCheckLowRight(row, col)) {
        select.rows[row + 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}

  } else {
    forceJump = false;
    try {
      if (
        select.rows[row + 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row + 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}

    try {
      if (
        select.rows[row - 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row - 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}
  }

}

function displayClickablePlacesForGoldenWhite(row, col) { // display movable places for selected white king pieces
  if (whiteJumpCheckUpLeft(row, col) ||
    whiteJumpCheckUpRight(row, col) ||
    whiteJumpCheckLowLeft(row, col) ||
    whiteJumpCheckLowRight(row, col)
  ) {
    forceJump = true;
    try {
      if (whiteJumpCheckUpLeft(row, col)) {
        select.rows[row - 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (whiteJumpCheckUpRight(row, col)) {
        select.rows[row - 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (whiteJumpCheckLowLeft(row, col)) {
        select.rows[row + 2].cells[col - 2].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (whiteJumpCheckLowRight(row, col)) {
        select.rows[row + 2].cells[col + 2].innerHTML = clickableShade;
      }
    } catch (err) {}
  } else {
    forceJump = false;
    try {
      if (
        select.rows[row + 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row + 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row + 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}

    try {
      if (
        select.rows[row - 1].cells[col - 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col - 1].innerHTML = clickableShade;
      }
    } catch (err) {}
    try {
      if (
        select.rows[row - 1].cells[col + 1].innerHTML === emptys) {
        select.rows[row - 1].cells[col + 1].innerHTML = clickableShade;
      }
    } catch (err) {}
  }
}

function displayClickablePlaces(that, row, col) { // display where the piece can move
  if (that.innerHTML === whitePiece) {
    displayClickablePlacesForWhite(row, col);
  } else if (that.innerHTML === blackPiece) {
    displayClickablePlacesForBlack(row, col);
  } else if (that.innerHTML === goldenBlack) {
    displayClickablePlacesForGoldenBlack(row, col);
  } else if (that.innerHTML === goldenWhite) {
    displayClickablePlacesForGoldenWhite(row, col);
  }
}

function blackJumpCheckUpLeft(row, col) { // check jump for black Up-left
  try {
    let condition =
      (select.rows[row - 1].cells[col - 1].innerHTML === whitePiece || select.rows[row - 1].cells[col - 1].innerHTML === goldenWhite) &&
      select.rows[row - 2].cells[col - 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function blackJumpCheckUpRight(row, col) { // check jump for black Up-right
  try {
    let condition =
      (select.rows[row - 1].cells[col + 1].innerHTML === whitePiece || select.rows[row - 1].cells[col + 1].innerHTML === goldenWhite) &&
      select.rows[row - 2].cells[col + 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function blackJumpCheckLowLeft(row, col) { // check jump for black Low-left
  try {
    let condition =
      (select.rows[row + 1].cells[col - 1].innerHTML === whitePiece || select.rows[row + 1].cells[col - 1].innerHTML === goldenWhite) &&
      select.rows[row + 2].cells[col - 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function blackJumpCheckLowRight(row, col) { // check jump for black low-right
  try {
    let condition =
      (select.rows[row + 1].cells[col + 1].innerHTML === whitePiece || select.rows[row + 1].cells[col + 1].innerHTML === goldenWhite) &&
      select.rows[row + 2].cells[col + 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function whiteJumpCheckUpLeft(row, col) { // check jump for white Up-left
  try {
    let condition =
      (select.rows[row - 1].cells[col - 1].innerHTML === blackPiece || select.rows[row - 1].cells[col - 1].innerHTML === goldenBlack) &&
      select.rows[row - 2].cells[col - 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function whiteJumpCheckUpRight(row, col) { // check jump for white Up-right
  try {
    let condition =
      (select.rows[row - 1].cells[col + 1].innerHTML === blackPiece || select.rows[row - 1].cells[col + 1].innerHTML === goldenBlack) &&
      select.rows[row - 2].cells[col + 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function whiteJumpCheckLowLeft(row, col) { // check jump for white Low-left
  try {
    let condition =
      (select.rows[row + 1].cells[col - 1].innerHTML === blackPiece || select.rows[row + 1].cells[col - 1].innerHTML === goldenBlack) &&
      select.rows[row + 2].cells[col - 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function whiteJumpCheckLowRight(row, col) { // check jump for white Low-right
  try {
    let condition =
      (select.rows[row + 1].cells[col + 1].innerHTML === blackPiece || select.rows[row + 1].cells[col + 1].innerHTML === goldenBlack) &&
      select.rows[row + 2].cells[col + 2].innerHTML === emptys;
    return condition;
  } catch (err) {
    return false;
  }
}

function offerDraw() { // functionality for offer draw button
  if (window.confirm("Accept Draw?")) {
    alert("Game Finished! Draw!");
    window.location.reload();
  }
}

function reload() { //functionality for restart the game button
  window.location.reload();
}