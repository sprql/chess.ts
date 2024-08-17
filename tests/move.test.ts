import { expect, test } from "bun:test"

import { Chess, Ox88 } from "../src/chess"

test("move - works", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const next = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
  let game = Chess.create(fen)
  game = Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e4 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works (mates)", () => {
  const fen = "7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1"
  const next = "3R3k/8/3p2Q1/6Q1/2N1N3/8/8/3R3K b - - 1 1"
  let game = Chess.create(fen)
  // Rd8#
  game = Chess.makeMove(game, { from: Ox88.d7, to: Ox88.d8 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works (white en passant)", () => {
  const fen = "rnbqkbnr/pp3ppp/2pp4/4pP2/4P3/8/PPPP2PP/RNBQKBNR w KQkq e6 0 1"
  const next = "rnbqkbnr/pp3ppp/2ppP3/8/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 1"
  let game = Chess.create(fen)
  // fxe6
  game = Chess.makeMove(game, { from: Ox88.f5, to: Ox88.e6 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works (black en passant)", () => {
  const fen = "rnbqkbnr/pppp2pp/8/4p3/4Pp2/2PP4/PP3PPP/RNBQKBNR b KQkq e3 0 1"
  const next = "rnbqkbnr/pppp2pp/8/4p3/8/2PPp3/PP3PPP/RNBQKBNR w KQkq - 0 2"
  let game = Chess.create(fen)
  // fxe3
  game = Chess.makeMove(game, { from: Ox88.f4, to: Ox88.e3 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works (pin disambiguates piece)", () => {
  const fen = "r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7"
  const next = "r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8"
  let game = Chess.create(fen)
  // Ne7
  game = Chess.makeMove(game, { from: Ox88.g8, to: Ox88.e7 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - permissive parser (accepts overly disambiguated piece)", () => {
  const fen = "r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7"
  const next = "r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8"
  let game = Chess.create(fen)
  // Nge7"
  game = Chess.makeMove(game, { to: Ox88.e7, from: Ox88.g8 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - permissive parser (accepts correctly disambiguated piece)", () => {
  const fen = "r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7"
  const next = "r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8"
  let game = Chess.create(fen)
  // game, "Ne7"
  game = Chess.makeMove(game, { to: Ox88.e7, from: Ox88.g8 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - strict - throws Error - overly disambiguated piece", () => {
  const fen = "r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7"
  const game = Chess.create(fen)
  expect(() => Chess.makeMove(game, "Nge7")).toThrowError()
})

test("move - throws Error - illegal move", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const game = Chess.create(fen)
  expect(() => Chess.makeMove(game, "e5")).toThrowError()
})

test("move - works - verbose", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const next = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
  let game = Chess.create(fen)
  game = Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e4 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - verbose - promotion field ignored if not promoting", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const next = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
  let game = Chess.create(fen)
  game = Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e4, promotion: "q" })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - verbose - under promotion", () => {
  const fen = "8/1k5P/8/8/8/8/8/1K6 w - - 0 1"
  const next = "7N/1k6/8/8/8/8/8/1K6 b - - 0 1"
  let game = Chess.create(fen)
  game = Chess.makeMove(game, { from: Ox88.h7, to: Ox88.h8, promotion: "n" })
  expect(Chess.fen(game)).toBe(next)
})

test("move - throws Error - verbose (illegal move)", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const game = Chess.create(fen)
  expect(() => Chess.makeMove(game, { from: Ox88.e2, to: Ox88.e5 })).toThrowError()
})

test("move - works - permissive parser (piece capture without x)", () => {
  const fen = "r1bqk2r/p1p2pp1/2n1pn2/1p5p/2pP4/bPNB1PN1/PB1Q2PP/R3K2R w KQkq - 0 12"
  const next = "r1bqk2r/p1p2pp1/2n1pn2/1p5p/2pP4/BPNB1PN1/P2Q2PP/R3K2R b KQkq - 0 12"
  let game = Chess.create(fen)
  // Ba3
  game = Chess.makeMove(game, { to: Ox88.a3, from: Ox88.b2 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - permissive parser (pawn capture without x)", () => {
  const fen = "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2"
  const next = "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3"
  let game = Chess.create(fen)
  // ef4
  game = Chess.makeMove(game, { to: Ox88.f4, from: Ox88.e5 })
  expect(Chess.fen(game)).toBe(next)
})

test("move - works - permissive parser (en passant capture without x)", () => {
  const fen = "rnbqkbnr/pppp1ppp/8/8/4PpP1/8/PPPP3P/RNBQKBNR b KQkq g3 0 3"
  const next = "rnbqkbnr/pppp1ppp/8/8/4P3/6p1/PPPP3P/RNBQKBNR w KQkq - 0 4"
  let game = Chess.create(fen)
  // fg3
  game = Chess.makeMove(game, { to: Ox88.g3, from: Ox88.f4 })
  expect(Chess.fen(game)).toBe(next)
})
