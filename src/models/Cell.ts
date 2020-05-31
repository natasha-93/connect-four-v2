export enum CellValue {
  red = "red",
  blue = "blue",
  empty = "",
}

export type Color = CellValue.red | CellValue.blue;

export type CellCoordinates = {
  row: number;
  col: number;
};
