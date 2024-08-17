import { expect, describe, it } from "bun:test"

import { Chess } from "../src/chess"

describe("ASCII Board", () => {
  it("Draws an ASCII board with pretty printed symbols", () => {
    const output = [
      "   ┌────────────────────────┐",
      " 8 │ ♜  ·  ·  ·  ·  ♜  ♚  · │",
      " 7 │ ·  ·  ·  ·  ♞  ♛  ♟  ♟ │",
      " 6 │ ·  ♟  ·  ♟  ·  ·  ·  · │",
      " 5 │ ·  ·  ♟  ♙  ♟  ♟  ·  · │",
      " 4 │ ♝  ♙  ♙  ·  ♙  ·  ·  · │",
      " 3 │ ♖  ·  ♗  ·  ♘  ♕  ·  · │",
      " 2 │ ♙  ·  ·  ·  ·  ♙  ♙  ♙ │",
      " 1 │ ·  ♖  ·  ·  ·  ·  ♔  · │",
      "   └────────────────────────┘",
      "     a  b  c  d  e  f  g  h",
    ]

    const board = Chess.Board.create("r4rk1/4nqpp/1p1p4/2pPpp2/bPP1P3/R1B1NQ2/P4PPP/1R4K1 w - - 0 28")

    expect(Chess.Board.ascii(board)).toBe(output.join("\n"))
  })

  it("Draws an ASCII board without pretty printed symbols", () => {
    const output = [
      "   ┌────────────────────────┐",
      " 8 │ r  ·  ·  ·  ·  r  k  · │",
      " 7 │ ·  ·  ·  ·  n  q  p  p │",
      " 6 │ ·  p  ·  p  ·  ·  ·  · │",
      " 5 │ ·  ·  p  P  p  p  ·  · │",
      " 4 │ b  P  P  ·  P  ·  ·  · │",
      " 3 │ R  ·  B  ·  N  Q  ·  · │",
      " 2 │ P  ·  ·  ·  ·  P  P  P │",
      " 1 │ ·  R  ·  ·  ·  ·  K  · │",
      "   └────────────────────────┘",
      "     a  b  c  d  e  f  g  h",
    ]

    const board = Chess.Board.create("r4rk1/4nqpp/1p1p4/2pPpp2/bPP1P3/R1B1NQ2/P4PPP/1R4K1 w - - 0 28")

    expect(Chess.Board.ascii(board, false)).toBe(output.join("\n"))
  })
})
