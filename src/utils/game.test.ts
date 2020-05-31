import {
  createBoard,
  findLengthsByDirection,
  checkWinner,
  isBoardFull,
} from "./game";
import { CellValue } from "../models/Cell";
import { Direction } from "../models/Direction";

const createMockBoard = () => {
  const board = createBoard(6, 7);

  board[5][0] = CellValue.red;
  board[5][1] = CellValue.red;
  board[5][2] = CellValue.red;
  board[5][3] = CellValue.red;
  board[4][1] = CellValue.red;

  return board;
};

test("creates a board", () => {
  const board = createBoard(6, 7);

  expect(board.length).toBe(6);
  expect(board[0].length).toBe(7);
  expect(board[0][0]).toBe(CellValue.empty);
});

test("finds all lengths by direction", () => {
  const board = createMockBoard();

  const lengths = findLengthsByDirection(board, { row: 5, col: 1 });

  expect(lengths).toMatchObject({
    [Direction.NORTH]: 1,
    [Direction.NORTHEAST]: 0,
    [Direction.EAST]: 2,
    [Direction.SOUTHEAST]: 0,
    [Direction.SOUTH]: 0,
    [Direction.SOUTHWEST]: 0,
    [Direction.WEST]: 1,
    [Direction.NORTHWEST]: 0,
  });
});

test("determine diag asc winner", () => {
  const board = [
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.red,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.blue,
      CellValue.red,
      CellValue.red,
      CellValue.red,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.blue,
      CellValue.red,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
      CellValue.red,
      CellValue.blue,
    ],
    [
      CellValue.red,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
    ],
  ];

  const { won, winLine } = checkWinner(board, { row: 2, col: 3 });

  expect(won).toBe(true);
  expect(winLine).toMatchObject([
    { row: 3, col: 2 },
    { row: 4, col: 1 },
    { row: 5, col: 0 },
    { row: 2, col: 3 },
  ]);
});

test("determine diag desc winnder", () => {
  const board = [
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
      CellValue.red,
      CellValue.empty,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.blue,
      CellValue.red,
      CellValue.red,
      CellValue.red,
      CellValue.empty,
      CellValue.empty,
    ],
    [
      CellValue.empty,
      CellValue.red,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
      CellValue.red,
      CellValue.blue,
    ],
    [
      CellValue.empty,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
      CellValue.blue,
      CellValue.blue,
      CellValue.red,
    ],
  ];

  const { won, winLine } = checkWinner(board, { row: 2, col: 3 });

  expect(won).toBe(true);
  expect(winLine).toMatchObject([
    { row: 2, col: 3 },
    { row: 3, col: 4 },
    { row: 4, col: 5 },
    { row: 5, col: 6 },
  ]);
});

test("determine if board is full", () => {
  const board = createMockBoard();

  expect(isBoardFull(board)).toBe(false);

  board[0] = board[0].map((c) => CellValue.red);

  expect(isBoardFull(board)).toBe(true);
});
