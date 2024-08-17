import { expect, test } from "bun:test"

import { Chess, Ox88 } from "../src/chess"

test("parse full fen", () => {
  const state = Chess.create("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 55 101")

  expect(state.turn).toEqual("b")
  expect(state.castling).toEqual({ w: 96, b: 96 })
  expect(state.epSquare).toEqual(Ox88.e3)
  expect(state.halfMoves).toEqual(55)
  expect(state.moveNumber).toEqual(101)
  expect(state.board[Ox88.a1]).toEqual({ id: 8 + 8 + 8 + 1, type: "r", color: "w" })
  expect(state.board[Ox88.h1]).toEqual({ id: 8 + 8 + 8 + 8, type: "r", color: "w" })
})
