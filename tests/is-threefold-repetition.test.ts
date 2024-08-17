import { expect, test } from "bun:test"

import { Chess, type SquareIndex, Ox88 } from "../src/chess"

test("isThreefoldRepetition", () => {
  /* Fischer - Petrosian, Buenos Aires, 1971 */
  const fen = "8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 2 30"
  // Qe5 Qh5 Qf6 Qe2 Re5 Qd3 Rd5 Qe2
  const moves: { from: SquareIndex; to: SquareIndex }[] = [
    { from: Ox88.f6, to: Ox88.e5 },
    { from: Ox88.e2, to: Ox88.h5 },
    { from: Ox88.e5, to: Ox88.f6 },
    { from: Ox88.h5, to: Ox88.e2 },
    { from: Ox88.d5, to: Ox88.e5 },
    { from: Ox88.e2, to: Ox88.d3 },
    { from: Ox88.e5, to: Ox88.d5 },
    { from: Ox88.d3, to: Ox88.e2 },
  ]

  let game = Chess.create(fen)

  for (const move of moves) {
    expect(Chess.isThreefoldRepetition(game)).toBe(false)
    game = Chess.makeMove(game, move)
  }
  expect(Chess.isThreefoldRepetition(game)).toBe(true)
  game = Chess.makeMove(game, { from: Ox88.a7, to: Ox88.a6 })
  expect(Chess.isThreefoldRepetition(game)).toBe(false)
})

test("isThreefoldRepetition - 2", () => {
  // Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8
  const moves: { from: SquareIndex; to: SquareIndex }[] = [
    { from: Ox88.g1, to: Ox88.f3 },
    { from: Ox88.g8, to: Ox88.f6 },
    { from: Ox88.f3, to: Ox88.g1 },
    { from: Ox88.f6, to: Ox88.g8 },
    { from: Ox88.g1, to: Ox88.f3 },
    { from: Ox88.g8, to: Ox88.f6 },
    { from: Ox88.f3, to: Ox88.g1 },
    { from: Ox88.f6, to: Ox88.g8 },
  ]

  let game = Chess.create(Chess.DEFAULT_POSITION)
  for (const move of moves) {
    expect(Chess.isThreefoldRepetition(game)).toBe(false)
    game = Chess.makeMove(game, move)
  }
  expect(Chess.isThreefoldRepetition(game)).toBe(true)
  game = Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e4 })
  expect(Chess.isThreefoldRepetition(game)).toBe(false)
})
