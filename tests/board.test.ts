import { expect, describe, it } from "bun:test"

import { Chess } from "../src/chess"

describe("Board Tests", () => {
  const tests = [
    {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      board: [
        { id: 1, type: "r", color: "b" }, //  square: "a8"
        { id: 2, type: "n", color: "b" }, //  square: "b8"
        { id: 3, type: "b", color: "b" }, //  square: "c8"
        { id: 4, type: "q", color: "b" }, //  square: "d8"
        { id: 5, type: "k", color: "b" }, //  square: "e8"
        { id: 6, type: "b", color: "b" }, //  square: "f8"
        { id: 7, type: "n", color: "b" }, //  square: "g8"
        { id: 8, type: "r", color: "b" }, //  square: "h8"
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { id: 9, type: "p", color: "b" }, //  square: "a7"
        { id: 10, type: "p", color: "b" }, //  square: "b7"
        { id: 11, type: "p", color: "b" }, //  square: "c7"
        { id: 12, type: "p", color: "b" }, //  square: "d7"
        { id: 13, type: "p", color: "b" }, //  square: "e7"
        { id: 14, type: "p", color: "b" }, //  square: "f7"
        { id: 15, type: "p", color: "b" }, //  square: "g7"
        { id: 16, type: "p", color: "b" }, //  square: "h7"
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { id: 17, type: "p", color: "w" }, //  square: "a2"
        { id: 18, type: "p", color: "w" }, //  square: "b2"
        { id: 19, type: "p", color: "w" }, //  square: "c2"
        { id: 20, type: "p", color: "w" }, //  square: "d2"
        { id: 21, type: "p", color: "w" }, //  square: "e2"
        { id: 22, type: "p", color: "w" }, //  square: "f2"
        { id: 23, type: "p", color: "w" }, //  square: "g2"
        { id: 24, type: "p", color: "w" }, //  square: "h2"
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { id: 25, type: "r", color: "w" }, //  square: "a1"
        { id: 26, type: "n", color: "w" }, //  square: "b1"
        { id: 27, type: "b", color: "w" }, //  square: "c1"
        { id: 28, type: "q", color: "w" }, //  square: "d1"
        { id: 29, type: "k", color: "w" }, //  square: "e1"
        { id: 30, type: "b", color: "w" }, //  square: "f1"
        { id: 31, type: "n", color: "w" }, //  square: "g1"
        { id: 32, type: "r", color: "w" }, //  square: "h1"
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
    {
      fen: "r3k2r/ppp2p1p/2n1p1p1/8/2B2P1q/2NPb1n1/PP4PP/R2Q3K w kq - 0 8",
      board: [
        { id: 1, type: "r", color: "b" }, null, null, null, { id: 2, type: "k", color: "b" }, null, null, { id: 3, type: "r", color: "b" },
        null, null, null, null, null, null, null, null,
        { id: 4, type: "p", color: "b" }, { id: 5, type: "p", color: "b" }, { id: 6, type: "p", color: "b" }, null, null, { id: 7, type: "p", color: "b" }, null, { id: 8, type: "p", color: "b" },
        null, null, null, null, null, null, null, null,
        null, null, { id: 9, type: "n", color: "b" }, null, { id: 10, type: "p", color: "b" }, null, { id: 11, type: "p", color: "b" }, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, { id: 12, type: "b", color: "w" }, null, null, { id: 13, type: "p", color: "w" }, null, { id: 14, type: "q", color: "b" },
        null, null, null, null, null, null, null, null,
        null, null, { id: 15, type: "n", color: "w" }, { id: 16, type: "p", color: "w" }, { id: 17, type: "b", color: "b" }, null, { id: 18, type: "n", color: "b" }, null,
        null, null, null, null, null, null, null, null,
        { id: 19, type: "p", color: "w" }, { id: 20, type: "p", color: "w" }, null, null, null, null, { id: 21, type: "p", color: "w" }, { id: 22, type: "p", color: "w" },
        null, null, null, null, null, null, null, null,
        { id: 23, type: "r", color: "w" }, null, null, { id: 24, type: "q", color: "w" }, null, null, null, { id: 25, type: "k", color: "w" },
        null, null, null, null, null, null, null, null,
      ]
    }
  ]

  for (const { fen, board: expectedBoard } of tests) {
    it(`Board - ${fen}`, () => {
      expect(Chess.Board.create(fen)).toEqual(expectedBoard)
    })
  }
})
