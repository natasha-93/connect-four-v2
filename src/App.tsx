import React, { useState } from "react";
import Cell from "./Cell";
import Button from "./Button";
import GameContainer from "./GameContainer";
import GameStructure from "./GameStructure";
import ArrowRow from "./ArrowRow";
import Modal from "./Modal";
import { CellValue, CellCoordinates, Color } from "./models/Cell";
import { Board } from "./models/Board";
import { Winner } from "./models/Winner";
import {
  createBoard,
  getOpenRowInColumn,
  checkWinner,
  isBoardFull,
} from "./utils/game";
import styles from "./AppModal.module.css";
import { Line } from "./models/Line";

function App() {
  const [board, setBoard] = useState<Board>(createBoard());
  const [turn, setTurn] = useState<Color>(CellValue.red);
  const [hoveredColumn, setHoveredColumn] = useState(-1);
  const [winner, setWinner] = useState<Winner>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [winLine, setWinLine] = useState<Line | null>(null);

  function handleSelect({ row, col }: CellCoordinates) {
    const openRow = getOpenRowInColumn(board, col);

    if (winner != null) return;

    if (openRow === null) {
      alert("Invalid move");
    } else {
      const newBoard = board.map((r, i) => {
        return r.map((cell, j) => {
          if (i !== openRow || j !== col) return cell;

          return turn;
        });
      });

      setTurn(turn === CellValue.red ? CellValue.blue : CellValue.red);
      setBoard(newBoard);

      const { won, winLine } = checkWinner(newBoard, { row: openRow, col });

      if (won) {
        setShowModal(true);
        setWinner(turn);
        setWinLine(winLine);
      } else if (isBoardFull(newBoard)) {
        setShowModal(true);
        setWinner("tie");
      }
    }
  }

  function handleHover({ col }: CellCoordinates) {
    setHoveredColumn(col);
  }

  return (
    <>
      <>
        {showModal ? (
          <Modal>
            <h1>Game Over!</h1>
            {winner !== "tie" && winner != null && (
              <p>
                <span
                  style={
                    winner === "red" ? { color: "red" } : { color: "blue" }
                  }
                >
                  {winner.toUpperCase()}
                </span>{" "}
                wins!
              </p>
            )}
            {winner === "tie" && <p>It's a TIE!</p>}

            <button
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
            >
              X
            </button>
          </Modal>
        ) : null}
      </>

      <GameContainer>
        <ArrowRow index={hoveredColumn} turn={turn}>
          ⬇
        </ArrowRow>
        <GameStructure>
          {board.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((cellValue, colIndex) => (
                <Cell
                  key={colIndex}
                  value={cellValue}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onSelect={handleSelect}
                  onHover={handleHover}
                  winLine={winLine}
                  winner={winner}
                />
              ))}
            </div>
          ))}
        </GameStructure>
        <Button
          onClick={(e: React.MouseEvent) => {
            setBoard(createBoard());
            setWinner(null);
            setWinLine(null);
          }}
        >
          Restart
        </Button>
      </GameContainer>
    </>
  );
}

export default App;
