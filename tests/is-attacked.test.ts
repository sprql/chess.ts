import { expect, test } from "bun:test";

import {
  type Square,
  Color,
  Ox88,
  Chess,
} from "../src/chess"

function areAttacked(game: Chess.State, squares: Square[], color: Color) {
  return squares.reduce(
    (acc, square) => acc && Chess.isSquareUnderAttack(game.board, Ox88[square], color),
    true,
  )
}

function areNotAttacked(game: Chess.State, squares: Square[], color: Color) {
  // returns true is all squares are NOT attacked
  return !squares.reduce(
    (acc, square) => acc || Chess.isSquareUnderAttack(game.board, Ox88[square], color),
    false,
  )
}

test("isAttacked (white pawn attacks)", () => {
  // diagonal attacks
  const game = Chess.create("4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1")
  expect(areAttacked(game, ["d3", "f3"], Color.WHITE)).toBe(true)
  expect(areNotAttacked(game, ["d3", "f3"], Color.BLACK)).toBe(true)

  // small/big pawn moves aren't attacks
  expect(areNotAttacked(game, ["e4", "e4"], Color.WHITE)).toBe(true)
})

test("isAttacked (black pawn attacks)", () => {
  // diagonal attacks
  const game = Chess.create("4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1")
  expect(areAttacked(game, ["f6", "d6"], Color.BLACK)).toBe(true)
  expect(areNotAttacked(game, ["f6", "d6"], Color.WHITE)).toBe(true)

  // small/big pawn moves aren't attacks
  expect(areNotAttacked(game, ["e6", "e5"], Color.BLACK)).toBe(true)
})

test("isAttacked (knight)", () => {
  const game = Chess.create("4k3/4p3/8/8/4N3/8/8/4K3 w - - 0 1")

  const squares: Square[] = ["d2", "f2", "c3", "g3", "d6", "f6", "c5", "g5"]

  expect(areAttacked(game, squares, Color.WHITE)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e4, Color.WHITE)).toBe(false) // same square
})

test("isAttacked (bishop)", () => {
  const game = Chess.create("4k3/4p3/8/8/4b3/8/8/4K3 w - - 0 1")

  const squares: Square[] = ["b1", "c2", "d3", "f5", "g6", "h7", "a8", "b7", "c6", "d5", "f3", "g2", "h1"]
  expect(areAttacked(game, squares, Color.BLACK)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e4, Color.BLACK)).toBe(false) // same square
})

test("isAttacked (rook)", () => {
  const game = Chess.create("4k3/4n3/8/8/8/4R3/8/4K3 w - - 0 1")

  const squares: Square[] = [
    "e1", // yes, we can attack our own color
    "e2",
    "e4",
    "e5",
    "e6",
    "e7",
    "a3",
    "b3",
    "c3",
    "d3",
    "f3",
    "g3",
    "h3",
  ]
  expect(areAttacked(game, squares, Color.WHITE)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e3, Color.WHITE)).toBe(false) // same square
})

test("isAttacked (queen)", () => {
  const game = Chess.create("4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1")

  const squares: Square[] = [
    "e2",
    "e4",
    "e5",
    "e6",
    "e7", // yes, we can attack our own color
    "a3",
    "b3",
    "c3",
    "d3",
    "f3",
    "g3",
    "h3",
    "c1",
    "d2",
    "f4",
    "g5",
    "h6",
    "g1",
    "f2",
    "d4",
    "c5",
    "b6",
    "a7",
  ]
  expect(areAttacked(game, squares, Color.BLACK)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e3, Color.BLACK)).toBe(false) // same square
})

test("isAttacked (king)", () => {
  const game = Chess.create("4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1")

  const squares: Square[] = [
    "e2", // yes, we can attack our own color
    "d1",
    "d2",
    "f1",
    "f2",
  ]
  expect(areAttacked(game, squares, Color.WHITE)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e1, Color.WHITE)).toBe(false) // same square
})

test("isAttacked (pinned pieces still attacks)", () => {
  // pinned pawn, but still is an attacked square
  const game = Chess.create("4k3/4r3/8/8/8/8/4P3/4K3 w - - 0 1")
  expect(areAttacked(game, ["d3", "f3"], Color.WHITE)).toBe(true)
})

test("isAttacked (no x-ray)", () => {
  const game = Chess.create("4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1")
  expect(areNotAttacked(game, ["e1"], Color.BLACK)).toBe(true)
})

test("isAttacked (doc tests)", () => {
  let game = Chess.create(Chess.DEFAULT_POSITION)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.f3, Color.WHITE)).toBe(true)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.f6, Color.BLACK)).toBe(true)
  game = Chess.create(Chess.DEFAULT_POSITION)
  expect(Chess.isSquareUnderAttack(game.board, Ox88.e2, Color.WHITE)).toBe(true)
  game = Chess.create("4k3/4n3/8/8/8/8/4R3/4K3 w - - 0 1")
  expect(Chess.isSquareUnderAttack(game.board, Ox88.c6, Color.BLACK)).toBe(true)
})
