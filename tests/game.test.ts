import { it, expect } from "bun:test"

import { Chess } from "../src/chess"

it("should play a game until get a winner", () => {
  let game = Chess.create()

  while (!Chess.isGameOver(game)) {
    const moves = Chess.getMoves(game)
    const move = moves[Math.floor(Math.random() * moves.length)]
    game = Chess.makeMove(game, move)
  }

  expect(Chess.isGameOver(game)).toBe(true)
})
