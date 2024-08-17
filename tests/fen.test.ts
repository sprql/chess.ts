import { expect, describe, it } from "bun:test"

import { Chess } from "../src/chess"

describe(" Chess.create() / Chess.fen() should be symmetric", () => {
  const validPositions = [
    "k7/8/8/8/8/8/8/7K w - - 0 1",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    "1nbqkbn1/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1 b - - 1 2",
    "k7/8/8/8/8/8/8/7K w - - 0 1",
  ]

  for (const fen of validPositions) {
    it(`fen - symmetry - ${fen}`, () => {
      const state = Chess.create(fen)
      expect(Chess.fen(state)).toEqual(fen)
    })
  }
})
