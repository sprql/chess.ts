import { expect, describe, it } from "bun:test"

import { Chess, Ox88 } from "../src/chess"

describe("Regression Tests", () => {
  it("Github Issue #30 - move generateion - single square bug", () => {
    const game = Chess.create("rnbqk2r/ppp1pp1p/5n1b/3p2pQ/1P2P3/B1N5/P1PP1PPP/R3KBNR b KQkq - 3 5")
    expect(Chess.getMoves(game, { square: "f1" })).toEqual([])
  })

  it("Github Issue #32 - castling flag reappearing", () => {
    let game = Chess.create("b3k2r/5p2/4p3/1p5p/6p1/2PR2P1/BP3qNP/6QK b k - 2 28")
    game = Chess.makeMove(game, { from: Ox88.a8, to: Ox88.g2 })
    expect(Chess.fen(game)).toEqual("4k2r/5p2/4p3/1p5p/6p1/2PR2P1/BP3qbP/6QK w k - 0 29")
  })

  it("Github Issue #284 - permissive settings allows illegal moves", () => {
    const game = Chess.create("4k3/8/8/8/8/4p3/8/4K3 w - - 0 1")
    expect(() => Chess.makeMove(game, { from: Ox88.e1, to: Ox88.f2 })).toThrowError()
  })

  it("Github Issue #282 - playing a move on an empty board throws an error", () => {
    const game: Chess.State = {
      board: [],
      turn: "w",
      castling: { w: 0, b: 0 },
      epSquare: 0,
      halfMoves: 0,
      moveNumber: 1,
      captured: [],
      positions: {},
    }
    expect(() => Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e4 })).toThrowError()
  })
})
