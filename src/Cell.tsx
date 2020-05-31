import React from "react";
import styled from "styled-components";
import { CellValue, CellCoordinates } from "./models/Cell";
import { Line } from "./models/Line";
import { Winner } from "./models/Winner";

type CellProps = {
  value: CellValue;
  rowIndex: number;
  colIndex: number;
  onSelect: (coordinates: CellCoordinates) => void;
  onHover: (coordinates: CellCoordinates) => void;
  winLine: Line | null;
  winner: Winner;
};

const StyledCell = styled(Cell)<CellProps>`
  width: 2rem;
  height: 2rem;
  border: 1px solid black;
  display: inline-block;
  position: relative;
  margin: 0 0.1rem;
  background-color: white;
  @media (min-width: 600px) {
    width: 3rem;
    height: 3rem;
  }
`;

type CellInnerProps = {
  value: CellValue;
  isDimmed: boolean;
};

const StyledCellInner = styled.div<CellInnerProps>`
  height: 100%;
  border-radius: 100%;
  background-color: ${(props) => props.value};
  opacity: ${({ isDimmed }) => (isDimmed ? 0.3 : 1)};
`;

function Cell({
  value = CellValue.empty,
  onSelect,
  onHover,
  rowIndex,
  colIndex,
  winLine,
  winner,
  ...props
}: CellProps) {
  const coords = { row: rowIndex, col: colIndex };
  const isWinningCell = Boolean(
    winLine?.find((c) => c.row === rowIndex && c.col === colIndex)
  );

  return (
    <div
      onMouseEnter={(e) => {
        onHover(coords);
      }}
      onClick={(e) => {
        onSelect(coords);
      }}
      {...props}
    >
      <StyledCellInner
        value={value}
        isDimmed={winner !== null && !isWinningCell}
      />
    </div>
  );
}

export default StyledCell;
