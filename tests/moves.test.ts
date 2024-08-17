import { expect, test } from "bun:test"

import {
  Chess,
  MoveFlags,
  type Square,
  Ox88,
} from "../src/chess"

test("moves", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  // a3 a4 b3 b4 c3 c4 d3 d4 e3 e4 f3 f4 g3 g4 h3 h4 Na3 Nc3 Nf3 Nh3
  const moves = [
    { from: Ox88.a2, to: Ox88.a3, flags: 0 }, // a3
    { from: Ox88.a2, to: Ox88.a4, flags: MoveFlags.BIG_PAWN }, // a4
    { from: Ox88.b2, to: Ox88.b3, flags: 0 }, // b3
    { from: Ox88.b2, to: Ox88.b4, flags: MoveFlags.BIG_PAWN }, // b4
    { from: Ox88.c2, to: Ox88.c3, flags: 0 }, // c3
    { from: Ox88.c2, to: Ox88.c4, flags: MoveFlags.BIG_PAWN }, // c4
    { from: Ox88.d2, to: Ox88.d3, flags: 0 }, // d3
    { from: Ox88.d2, to: Ox88.d4, flags: MoveFlags.BIG_PAWN }, // d4
    { from: Ox88.e2, to: Ox88.e3, flags: 0 }, // e3
    { from: Ox88.e2, to: Ox88.e4, flags: MoveFlags.BIG_PAWN }, // e4
    { from: Ox88.f2, to: Ox88.f3, flags: 0 }, // f3
    { from: Ox88.f2, to: Ox88.f4, flags: MoveFlags.BIG_PAWN }, // f4
    { from: Ox88.g2, to: Ox88.g3, flags: 0 }, // g3
    { from: Ox88.g2, to: Ox88.g4, flags: MoveFlags.BIG_PAWN }, // g4
    { from: Ox88.h2, to: Ox88.h3, flags: 0 }, // h3
    { from: Ox88.h2, to: Ox88.h4, flags: MoveFlags.BIG_PAWN }, // h4
    { from: Ox88.b1, to: Ox88.a3, flags: 0 }, // Na3
    { from: Ox88.b1, to: Ox88.c3, flags: 0 }, // Nc3
    { from: Ox88.g1, to: Ox88.f3, flags: 0 }, // Nf3
    { from: Ox88.g1, to: Ox88.h3, flags: 0 }, // Nh3
  ]

  expect(Chess.getMoves(game)).toContainValues(moves)
})

test("moves - single square", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  const moves = [
    { from: Ox88.e2, to: Ox88.e3, flags: 0 },
    { from: Ox88.e2, to: Ox88.e4, flags: MoveFlags.BIG_PAWN },
  ]
  expect(Chess.getMoves(game, { square: "e2" })).toContainValues(moves)
})

test("moves - single square - invalid square", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  expect(Chess.getMoves(game, { square: "e9" as Square })).toEqual([])
})

test("moves - single square - pinned piece", () => {
  const game = Chess.create("rnbqk1nr/pppp1ppp/4p3/8/1b1P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 2 3")
  expect(Chess.getMoves(game, { square: "c3" })).toEqual([])
})

test("moves - single square - promotion", () => {
  const game = Chess.create("8/k7/8/8/8/8/7p/K7 b - - 0 1")
  const moves = [
    { from: Ox88.h2, to: Ox88.h1, promotion: "n", flags: MoveFlags.PROMOTION }, // h1=N
    { from: Ox88.h2, to: Ox88.h1, promotion: "b", flags: MoveFlags.PROMOTION }, // h1=B
    { from: Ox88.h2, to: Ox88.h1, promotion: "r", flags: MoveFlags.PROMOTION }, // h1=R+
    { from: Ox88.h2, to: Ox88.h1, promotion: "q", flags: MoveFlags.PROMOTION }, // h1=Q+
  ]
  expect(Chess.getMoves(game, { square: "h2" })).toContainValues(moves)
})

test("moves - single square - castling", () => {
  const game = Chess.create("r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2NP1N2/PPPBQPPP/R3K2R w KQ - 0 8")
  // "Kf1 Kd1 O-O O-O-O"
  const moves = [
    { from: Ox88.e1, to: Ox88.f1, flags: 0 },
    { from: Ox88.e1, to: Ox88.d1, flags: 0 },
    { from: Ox88.e1, to: Ox88.g1, flags: MoveFlags.KSIDE_CASTLE },
    { from: Ox88.e1, to: Ox88.c1, flags: MoveFlags.QSIDE_CASTLE },
  ]
  expect(Chess.getMoves(game, { square: "e1" })).toContainValues(moves)
})

test("moves - single square - no castling", () => {
  const game = Chess.create("r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2NP1N2/PPPBQPPP/R3K2R w - - 0 8")
  // "Kf1 Kd1"
  const moves = [
    { from: Ox88.e1, to: Ox88.f1, flags: 0 },
    { from: Ox88.e1, to: Ox88.d1, flags: 0 },
  ]
  expect(Chess.getMoves(game, { square: "e1" })).toContainValues(moves)
})

test("moves - single square - trapped king", () => {
  const game = Chess.create("8/7K/8/8/1R6/k7/1R1p4/8 b - - 0 1")
  expect(Chess.getMoves(game, { square: "a3" })).toEqual([])
})

test("moves - piece", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  // "Na3 Nc3 Nf3 Nh3"
  const moves = [
    { from: Ox88.b1, to: Ox88.a3, flags: 0 },
    { from: Ox88.b1, to: Ox88.c3, flags: 0 },
    { from: Ox88.g1, to: Ox88.f3, flags: 0 },
    { from: Ox88.g1, to: Ox88.h3, flags: 0 },
  ]
  expect(Chess.getMoves(game, { piece: "n" })).toContainValues(moves)
})

test("moves - piece - en passante", () => {
  const game = Chess.create("rnbq1rk1/4bpp1/p2p1n1p/Ppp1p3/2B1P3/2NP1N1P/1PP2PP1/R1BQ1RK1 w - b6 0 10")
  // "axb6 b3 b4 d4 g3 g4 h4"
  const moves = [
    { from: Ox88.a5, to: Ox88.b6, flags: MoveFlags.EP_CAPTURE },
    { from: Ox88.b2, to: Ox88.b3, flags: 0 },
    { from: Ox88.b2, to: Ox88.b4, flags: MoveFlags.BIG_PAWN },
    { from: Ox88.d3, to: Ox88.d4, flags: 0 },
    { from: Ox88.g2, to: Ox88.g3, flags: 0 },
    { from: Ox88.g2, to: Ox88.g4, flags: MoveFlags.BIG_PAWN },
    { from: Ox88.h3, to: Ox88.h4, flags: 0 },
  ]
  expect(Chess.getMoves(game, { piece: "p" })).toContainValues(moves)
})

test("moves - piece - no such piece", () => {
  const game = Chess.create("r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/4P3/2NP1N2/PPP1QPPP/R3K2R w KQ - 0 8")
  expect(Chess.getMoves(game, { piece: "b" })).toEqual([])
})

test("moves - square and piece", () => {
  const game = Chess.create("5rk1/1p3rp1/p1n1p3/2p1p2p/2PpP1qP/P2P2P1/1P2QP1K/3R1R2 w - - 0 23")
  const moves = [
    { from: Ox88.e2, to: Ox88.d2, flags: 0 }, // Qd2
    { from: Ox88.e2, to: Ox88.c2, flags: 0 }, // Qc2
    { from: Ox88.e2, to: Ox88.e1, flags: 0 }, // Qe1
    { from: Ox88.e2, to: Ox88.e3, flags: 0 }, // Qe3
    { from: Ox88.e2, to: Ox88.f3, flags: 0 }, // Qf3
    { from: Ox88.e2, to: Ox88.g4, flags: 2 }, // Qxg4"
  ]
  expect(Chess.getMoves(game, { square: "e2", piece: "q" })).toContainValues(moves)
})

test("moves - no kings (starting position minus kings)", () => {
  const noKings = Chess.create(Chess.DEFAULT_POSITION)
  noKings.board[Ox88.e1] = null
  noKings.board[Ox88.e8] = null

  const kings = Chess.create(Chess.DEFAULT_POSITION)

  const movesWithoutQe1 = Chess.getMoves(noKings).filter((m) => m.from !== Ox88.d1 && m.to !== Ox88.e1)
  expect(movesWithoutQe1).toEqual(Chess.getMoves(kings))
})

test("inCheck - no kings (starting position minus kings)", () => {
  const noKings = Chess.create(Chess.DEFAULT_POSITION)
  noKings.board[Ox88.e1] = null
  noKings.board[Ox88.e8] = null

  expect(Chess.isCheck(noKings)).toEqual(false)
})

test("isCheckmate - no kings (starting position minus kings)", () => {
  const noKings = Chess.create(Chess.DEFAULT_POSITION)
  noKings.board[Ox88.e1] = null
  noKings.board[Ox88.e8] = null

  expect(Chess.isCheckmate(noKings)).toEqual(false)
})

test("isStalemate - no kings (starting position minus kings)", () => {
  const noKings = Chess.create(Chess.DEFAULT_POSITION)
  noKings.board[Ox88.e1] = null
  noKings.board[Ox88.e8] = null

  expect(Chess.isStalemate(noKings)).toEqual(false)
})
