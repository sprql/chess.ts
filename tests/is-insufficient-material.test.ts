import { expect, test } from "bun:test"

import { Chess } from "../src/chess"

test("insufficient material - k vs k", () => {
  const board = Chess.Board.create("8/8/8/8/8/8/8/k6K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(true)
})

test("insufficient material - kn vs k", () => {
  const board = Chess.Board.create("8/2N5/8/8/8/8/8/k6K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(true)
})

test("insufficient material - kb vs k", () => {
  const board = Chess.Board.create("8/2b5/8/8/8/8/8/k6K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(true)
})

test("insufficient material - kb vs kb (same color bishops)", () => {
  const board = Chess.Board.create("8/b7/3B4/8/8/8/8/k6K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(true)
})

test("insufficient material - kb vs kb (many same color bishops)", () => {
  const board = Chess.Board.create("8/b1B1b1B1/1b1B1b1B/8/8/8/8/1k5K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(true)
})

test("not insufficient material - starting position", () => {
  const board = Chess.Board.create(Chess.DEFAULT_POSITION)
  expect(Chess.isInsufficientMaterial(board)).toBe(false)
})

test("not insufficient material - kp v k", () => {
  const board = Chess.Board.create("8/2p5/8/8/8/8/8/k6K w - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(false)
})

test("not insufficient material - kb v kb (opposite color bishops)", () => {
  const board = Chess.Board.create("5k1K/7B/8/6b1/8/8/8/8 b - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(false)
})

test("not insufficient material - kn v kb", () => {
  const board = Chess.Board.create("7K/5k1N/8/6b1/8/8/8/8 b - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(false)
})

test("not insufficient material - kn v kn", () => {
  const board = Chess.Board.create("7K/5k1N/8/4n3/8/8/8/8 b - - 0 1")
  expect(Chess.isInsufficientMaterial(board)).toBe(false)
})
