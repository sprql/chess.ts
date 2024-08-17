import { expect, test } from "bun:test"

import { Chess } from "../src/chess"

test("stalemate 1", () => {
  const game = Chess.create("1R6/8/8/8/8/8/7R/k6K b - - 0 1")
  expect(Chess.isStalemate(game)).toBe(true)
})

test("stalemate 2", () => {
  const game = Chess.create("8/8/5k2/p4p1p/P4K1P/1r6/8/8 w - - 0 2")
  expect(Chess.isStalemate(game)).toBe(true)
})

test("stalemate - starting position is not stalemate", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  expect(Chess.isStalemate(game)).toBe(false)
})

test("stalemate - checkmate is not stalemate", () => {
  const game = Chess.create("R3k3/8/4K3/8/8/8/8/8 b - - 0 1")
  expect(Chess.isStalemate(game)).toBe(false)
})
