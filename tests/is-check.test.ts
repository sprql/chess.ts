import { expect, test } from "bun:test"

import { Chess } from "../src/chess"

test("isCheck - no, starting position", () => {
  const game = Chess.create(Chess.DEFAULT_POSITION)
  expect(Chess.isCheck(game)).toBe(false)
})

test("isCheck - yes, black giving check", () => {
  const game = Chess.create("rnb1kbnr/pppp1ppp/8/8/4Pp1q/2N5/PPPP2PP/R1BQKBNR w KQkq - 2 4")
  expect(Chess.isCheck(game)).toBe(true)
})

test("isCheck - yes, checkmate is also check", () => {
  const game = Chess.create("R3k3/8/4K3/8/8/8/8/8 b - - 0 1")
  expect(Chess.isCheck(game)).toBe(true)
})

test("isCheck - no, stalemate is not check", () => {
  const game = Chess.create("4k3/4P3/4K3/8/8/8/8/8 b - - 0 1")
  expect(Chess.isCheck(game)).toBe(false)
})
