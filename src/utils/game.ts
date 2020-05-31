import { chunk, range } from "lodash";
import { Direction } from "../models/Direction";
import { Board } from "../models/Board";
import { CellCoordinates, CellValue } from "../models/Cell";
import { Line } from "../models/Line";

type DirectionCountMap = Record<Direction, number>;
type DirectionCoordMap = Record<Direction, [number, number]>;

const directionCoordinates: DirectionCoordMap = {
  [Direction.NORTH]: [0, -1],
  [Direction.NORTHEAST]: [1, -1],
  [Direction.EAST]: [1, 0],
  [Direction.SOUTHEAST]: [1, 1],
  [Direction.SOUTH]: [0, 1],
  [Direction.SOUTHWEST]: [-1, 1],
  [Direction.WEST]: [-1, 0],
  [Direction.NORTHWEST]: [-1, -1],
};

export const countPiecesInDirection = (
  board: Board,
  rowIndex: number,
  colIndex: number,
  dir: Direction,
  color: CellValue,
  count = -1
): number => {
  if (color === CellValue.empty) return count;
  if (rowIndex < 0 || rowIndex > board.length - 1) return count;
  if (colIndex < 0 || colIndex > board[0].length - 1) return count;
  if (board[rowIndex][colIndex] !== color) return count;

  const [dx, dy] = directionCoordinates[dir];

  return countPiecesInDirection(
    board,
    rowIndex + dy,
    colIndex + dx,
    dir,
    color,
    count + 1
  );
};

export const findLengthsByDirection = (
  board: Board,
  { row, col }: CellCoordinates
): DirectionCountMap => {
  const color = board[row][col];

  return {
    [Direction.NORTH]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.NORTH,
      color
    ),
    [Direction.NORTHEAST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.NORTHEAST,
      color
    ),
    [Direction.EAST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.EAST,
      color
    ),
    [Direction.SOUTHEAST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.SOUTHEAST,
      color
    ),
    [Direction.SOUTH]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.SOUTH,
      color
    ),
    [Direction.SOUTHWEST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.SOUTHWEST,
      color
    ),
    [Direction.WEST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.WEST,
      color
    ),
    [Direction.NORTHWEST]: countPiecesInDirection(
      board,
      row,
      col,
      Direction.NORTHWEST,
      color
    ),
  };
};

export const createBoard = (rows: number = 6, cols: number = 7): Board => {
  const cells: CellValue[] = new Array(rows * cols).fill("");

  return chunk(cells, cols);
};

type WinCheckResult = {
  won: boolean;
  dirCounts: DirectionCountMap;
  winLine: Line | null;
};

export const checkWinner = (
  board: Board,
  { row, col }: CellCoordinates
): WinCheckResult => {
  const dirCounts = findLengthsByDirection(board, { row, col });
  const winLine = getWinningLine({ row, col }, dirCounts);
  const won = winLine != null;

  return {
    won,
    dirCounts,
    winLine,
  };
};

const getWinningLine = (
  { row, col }: CellCoordinates,
  dirCounts: DirectionCountMap
): Line | null => {
  const wonVertical =
    dirCounts[Direction.NORTH] + dirCounts[Direction.SOUTH] === 3;
  const wonHorizontal =
    dirCounts[Direction.EAST] + dirCounts[Direction.WEST] === 3;
  const wonDiagAsc =
    dirCounts[Direction.SOUTHWEST] + dirCounts[Direction.NORTHEAST] === 3;
  const wonDiagDes =
    dirCounts[Direction.NORTHWEST] + dirCounts[Direction.SOUTHEAST] === 3;

  if (wonVertical) {
    const coordsAbove: CellCoordinates[] = range(
      dirCounts[Direction.NORTH]
    ).map((n) => ({ row: row - n - 1, col }));
    const coordsBelow: CellCoordinates[] = range(
      dirCounts[Direction.SOUTH]
    ).map((n) => ({ row: row + n + 1, col }));

    return [...coordsAbove, { row, col }, ...coordsBelow];
  } else if (wonHorizontal) {
    const coordsLeft: CellCoordinates[] = range(
      dirCounts[Direction.WEST]
    ).map((n) => ({ row, col: col - n - 1 }));
    const coordsRight: CellCoordinates[] = range(
      dirCounts[Direction.EAST]
    ).map((n) => ({ row, col: col + n + 1 }));

    return [...coordsLeft, { row, col }, ...coordsRight];
  } else if (wonDiagAsc) {
    const coordsSw: CellCoordinates[] = range(
      dirCounts[Direction.SOUTHWEST]
    ).map((n) => ({ row: row + n + 1, col: col - n - 1 }));
    const coordsNe: CellCoordinates[] = range(
      dirCounts[Direction.NORTHEAST]
    ).map((n) => ({ row: row - n - 1, col: col + n + 1 }));

    return [...coordsSw, { row, col }, ...coordsNe];
  } else if (wonDiagDes) {
    const coordsSw: CellCoordinates[] = range(
      dirCounts[Direction.NORTHWEST]
    ).map((n) => ({ row: row - n - 1, col: col - n - 1 }));
    const coordsNe: CellCoordinates[] = range(
      dirCounts[Direction.SOUTHEAST]
    ).map((n) => ({ row: row + n + 1, col: col + n + 1 }));

    return [...coordsSw, { row, col }, ...coordsNe];
  }

  return null;
};

export const getOpenRowInColumn = (board: Board, col: number) => {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][col] === CellValue.empty) {
      return row;
    }
  }

  return null;
};

// Assume that gravity is working and just check the top row
export const isBoardFull = (board: Board) =>
  board[0].every((cell) => cell !== CellValue.empty);
