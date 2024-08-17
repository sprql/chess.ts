/**
 * @license
 * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
 * Copyright (c) 2024, Alexander Obukhov (dev@sprql.space)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

enum PieceType {
  PAWN = "p",
  KNIGHT = "n",
  BISHOP = "b",
  ROOK = "r",
  QUEEN = "q",
  KING = "k",
}

export enum Color {
  WHITE = "w",
  BLACK = "b",
}

type ID = number

type FEN = string

type Piece = {
  id: ID
  color: Color
  type: PieceType
}

type Board = Array<Piece | null>

enum CastlingKind {
  NONE = 0,
  KINGSIDE = 32,
  QUEENSIDE = 64,
}
type CastlingState = Record<Color, CastlingKind>

type Move = {
  from: number
  to: number
  flags: number
  promotion?: PieceType
}

// biome-ignore format:
export type Square =
  "a8" | "b8" | "c8" | "d8" | "e8" | "f8" | "g8" | "h8" |
  "a7" | "b7" | "c7" | "d7" | "e7" | "f7" | "g7" | "h7" |
  "a6" | "b6" | "c6" | "d6" | "e6" | "f6" | "g6" | "h6" |
  "a5" | "b5" | "c5" | "d5" | "e5" | "f5" | "g5" | "h5" |
  "a4" | "b4" | "c4" | "d4" | "e4" | "f4" | "g4" | "h4" |
  "a3" | "b3" | "c3" | "d3" | "e3" | "f3" | "g3" | "h3" |
  "a2" | "b2" | "c2" | "d2" | "e2" | "f2" | "g2" | "h2" |
  "a1" | "b1" | "c1" | "d1" | "e1" | "f1" | "g1" | "h1"

export enum MoveFlags {
  NORMAL = 1,
  CAPTURE = 2,
  BIG_PAWN = 4,
  EP_CAPTURE = 8,
  PROMOTION = 16,
  KSIDE_CASTLE = 32,
  QSIDE_CASTLE = 64,
}

const EMPTY = -1

const INITIAL_PIECES: PieceType[] = [
  PieceType.ROOK,
  PieceType.KNIGHT,
  PieceType.BISHOP,
  PieceType.QUEEN,
  PieceType.KING,
  PieceType.BISHOP,
  PieceType.KNIGHT,
  PieceType.ROOK,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
  PieceType.PAWN,
]

/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */

// biome-ignore format:
export const Ox88 = {
  a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
  a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
  a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
  a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
  a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
  a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
  a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
} as const

// biome-ignore format:
export type SquareIndex =
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
  32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
  48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 |
  64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 |
  80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 |
  96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 |
  112 | 113 | 114 | 115 | 116 | 117 | 118 | 119

// biome-ignore format:
const BOARD_INDEXES: SquareIndex[] = [
  0, 1, 2, 3, 4, 5, 6, 7,
  16, 17, 18, 19, 20, 21, 22, 23,
  32, 33, 34, 35, 36, 37, 38, 39,
  48, 49, 50, 51, 52, 53, 54, 55,
  64, 65, 66, 67, 68, 69, 70, 71,
  80, 81, 82, 83, 84, 85, 86, 87,
  96, 97, 98, 99, 100, 101, 102, 103,
  112, 113, 114, 115, 116, 117, 118, 119,
]

// biome-ignore format:
export const IndexToSquare: Record<SquareIndex, Square> = {
  0: "a8", 1: "b8", 2: "c8", 3: "d8", 4: "e8", 5: "f8", 6: "g8", 7: "h8",
  16: "a7", 17: "b7", 18: "c7", 19: "d7", 20: "e7", 21: "f7", 22: "g7", 23: "h7",
  32: "a6", 33: "b6", 34: "c6", 35: "d6", 36: "e6", 37: "f6", 38: "g6", 39: "h6",
  48: "a5", 49: "b5", 50: "c5", 51: "d5", 52: "e5", 53: "f5", 54: "g5", 55: "h5",
  64: "a4", 65: "b4", 66: "c4", 67: "d4", 68: "e4", 69: "f4", 70: "g4", 71: "h4",
  80: "a3", 81: "b3", 82: "c3", 83: "d3", 84: "e3", 85: "f3", 86: "g3", 87: "h3",
  96: "a2", 97: "b2", 98: "c2", 99: "d2", 100: "e2", 101: "f2", 102: "g2", 103: "h2",
  112: "a1", 113: "b1", 114: "c1", 115: "d1", 116: "e1", 117: "f1", 118: "g1", 119: "h1"
} as const

const PAWN_OFFSETS: Record<Color, number[]> = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15],
}

const PIECE_OFFSETS: Record<PieceType, number[]> = {
  p: [],
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1],
}

// biome-ignore format:
const ATTACKS = [
  20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
  0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
  0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
  0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
  0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
  24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
  0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
  0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
  0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
  0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
  20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];

// biome-ignore format:
const RAYS = [
  17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
  0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
  0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
  0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
  0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
  0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
  0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
  0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
  0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
  -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];

const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 }

const PROMOTIONS: PieceType[] = [PieceType.KNIGHT, PieceType.BISHOP, PieceType.ROOK, PieceType.QUEEN]

const RANK_1 = 7
const RANK_2 = 6
const RANK_7 = 1
const RANK_8 = 0

interface RookCastling {
  square: SquareIndex
  flag: MoveFlags
}
const ROOKS: Record<Color, RookCastling[]> = {
  w: [
    { square: Ox88.a1, flag: MoveFlags.QSIDE_CASTLE },
    { square: Ox88.h1, flag: MoveFlags.KSIDE_CASTLE },
  ],
  b: [
    { square: Ox88.a8, flag: MoveFlags.QSIDE_CASTLE },
    { square: Ox88.h8, flag: MoveFlags.KSIDE_CASTLE },
  ],
}

const SECOND_RANK = { b: RANK_7, w: RANK_2 }

// Extracts the zero-based rank of an 0x88 square.
function rank(square: number): number {
  return square >> 4
}

// Extracts the zero-based file of an 0x88 square.
function file(square: number): number {
  return square & 0x7
}

export function fileName(squareIndex: number): string {
  return "abcdefgh".charAt(file(squareIndex))
}

export function rankName(squareIndex: number): string {
  return (8 - rank(squareIndex)).toString()
}

// Converts a 0x88 square to algebraic notation.
function algebraic(squareIndex: number): Square {
  const f = fileName(squareIndex)
  const r = rankName(squareIndex)
  return `${f}${r}` as Square
}

function swapColor(color: Color): Color {
  return color === Color.WHITE ? Color.BLACK : Color.WHITE
}

function isDigit(char: string): boolean {
  const charCode = char.charCodeAt(0)
  return charCode >= 48 && charCode <= 57
}

function findPieceSquare(board: Board, piece: PieceType, color: Color) {
  for (const i of BOARD_INDEXES) {
    const currentPiece = board[i]
    if (currentPiece && currentPiece.type === piece && currentPiece.color === color) {
      return i
    }
  }
  return EMPTY
}

function isKingAttacked(board: Board, color: Color) {
  const square = findPieceSquare(board, PieceType.KING, color)
  return square === EMPTY ? false : Chess.isSquareUnderAttack(board, square, swapColor(color))
}

function generatePawnMoves(game: Chess.State, from: SquareIndex): Move[] {
  const candidateMoves: Move[] = []
  const color = game.turn
  const [singleSquareOffset, doubleSquareOffset, ...captureOffsets] = PAWN_OFFSETS[color]

  // Single square move, non-capturing
  let to = from + singleSquareOffset
  if (!game.board[to]) {
    candidateMoves.push({ from, to, flags: 0 })

    // Double square move, only from the second rank
    to = from + doubleSquareOffset
    const isOnSecondRank = SECOND_RANK[color] === rank(from)
    if (isOnSecondRank && !game.board[to]) {
      candidateMoves.push({ from, to, flags: MoveFlags.BIG_PAWN })
    }
  }

  // pawn captures
  for (const captureOffest of captureOffsets) {
    to = from + captureOffest
    if (to & 0x88) continue

    const capturedPiece = game.board[to]
    const opponentColor = swapColor(game.turn)

    if (capturedPiece?.color === opponentColor) {
      candidateMoves.push({ from, to, flags: MoveFlags.CAPTURE })
    } else if (to === game.epSquare) {
      candidateMoves.push({ from, to, flags: MoveFlags.EP_CAPTURE })
    }
  }

  return candidateMoves.flatMap((candidateMove) => {
    const { from, to, flags } = candidateMove
    const rankOfTo = rank(to)

    if (rankOfTo === RANK_1 || rankOfTo === RANK_8) {
      return PROMOTIONS.map((promotion) => {
        return { from, to, promotion, flags: flags | MoveFlags.PROMOTION }
      })
    }

    return [candidateMove]
  })
}

function generatePieceMoves(board: Board, currentPiece: Piece, from: number) {
  const moves: Move[] = []
  const pieceOffsets = PIECE_OFFSETS[currentPiece.type]

  for (const offset of pieceOffsets) {
    let to = from

    while (true) {
      to += offset
      if (to & 0x88) break

      const targetPiece = board[to]

      if (!targetPiece) {
        moves.push({ from, to, flags: 0 })
      } else {
        // own color, stop loop
        if (currentPiece.color === targetPiece.color) {
          break
        }
        moves.push({ from, to, flags: MoveFlags.CAPTURE })
        break
      }

      if (currentPiece.type === PieceType.KNIGHT || currentPiece.type === PieceType.KING) {
        break
      }
    }
  }
  return moves
}

function generateKingCastlingMoves(game: Chess.State, currentKingSquare: number) {
  const moves: Move[] = []
  const them = swapColor(game.turn)
  const board = game.board
  const castlingState = game.castling[game.turn]

  // king-side castling
  if (castlingState & MoveFlags.KSIDE_CASTLE) {
    const castlingFrom = currentKingSquare
    const castlingTo = castlingFrom + 2

    if (
      !board[castlingFrom + 1] &&
      !board[castlingTo] &&
      !Chess.isSquareUnderAttack(board, currentKingSquare, them) &&
      !Chess.isSquareUnderAttack(board, castlingFrom + 1, them) &&
      !Chess.isSquareUnderAttack(board, castlingTo, them)
    ) {
      moves.push({
        from: currentKingSquare,
        to: castlingTo,
        flags: MoveFlags.KSIDE_CASTLE,
      })
    }
  }

  // queen-side castling
  if (castlingState & MoveFlags.QSIDE_CASTLE) {
    const castlingFrom = currentKingSquare
    const castlingTo = castlingFrom - 2

    if (
      !board[castlingFrom - 1] &&
      !board[castlingFrom - 2] &&
      !board[castlingFrom - 3] &&
      !Chess.isSquareUnderAttack(board, currentKingSquare, them) &&
      !Chess.isSquareUnderAttack(board, castlingFrom - 1, them) &&
      !Chess.isSquareUnderAttack(board, castlingTo, them)
    ) {
      moves.push({
        from: currentKingSquare,
        to: castlingTo,
        flags: MoveFlags.QSIDE_CASTLE,
      })
    }
  }

  return moves
}

function legalMoves(game: Chess.State, moves: Move[]) {
  return moves.filter((move) => {
    const newGame = makeCandidateMove(game, move)
    return !isKingAttacked(newGame.board, game.turn)
  })
}

function evaluateCastlingRights(castlingRights: CastlingKind, move: Move, rooks: RookCastling[]): CastlingKind {
  for (const rook of rooks) {
    if (move.from === rook.square && castlingRights & rook.flag) {
      return castlingRights ^ rook.flag
    }
  }
  return castlingRights
}

function makeCandidateMove(game: Chess.State, move: Move) {
  game = structuredClone(game)

  const us = game.turn
  const them = swapColor(us)

  const currentPiece = game.board[move.from]
  if (!currentPiece) {
    return game
  }

  const capturedPiece = game.board[move.to]
  if (capturedPiece !== null) {
    game.captured.push(structuredClone(capturedPiece))
  }

  const currentPieceType = currentPiece.type
  game.board[move.to] = currentPiece
  game.board[move.from] = null

  // if ep capture, remove the captured pawn
  if (move.flags & MoveFlags.EP_CAPTURE) {
    const epCapturedSquare = game.turn === Color.BLACK ? move.to - 16 : move.to + 16
    const capturedPiece = game.board[epCapturedSquare]
    if (capturedPiece !== null) {
      game.captured.push(structuredClone(capturedPiece))
    }
    game.board[epCapturedSquare] = null
  }

  // if pawn promotion, replace with new piece
  if (move.promotion) {
    currentPiece.type = move.promotion
  }

  // if we moved the king
  if (currentPiece.type === PieceType.KING) {
    // if we castled, move the rook next to the king
    if (move.flags & MoveFlags.KSIDE_CASTLE) {
      const castlingTo = move.to - 1
      const castlingFrom = move.to + 1
      game.board[castlingTo] = game.board[castlingFrom]
      delete game.board[castlingFrom]
    } else if (move.flags & MoveFlags.QSIDE_CASTLE) {
      const castlingTo = move.to + 1
      const castlingFrom = move.to - 2
      game.board[castlingTo] = game.board[castlingFrom]
      delete game.board[castlingFrom]
    }

    // turn off castling
    game.castling[us] = 0
  }

  // turn off castling if we move a rook
  if (game.castling[us]) {
    game.castling[us] = evaluateCastlingRights(game.castling[us], move, ROOKS[us])
  }

  // turn off castling if we capture a rook
  if (game.castling[them]) {
    game.castling[them] = evaluateCastlingRights(game.castling[them], move, ROOKS[them])
  }

  // if big pawn move, update the en passant square
  if (move.flags & MoveFlags.BIG_PAWN) {
    if (us === Color.BLACK) {
      game.epSquare = move.to - 16
    } else {
      game.epSquare = move.to + 16
    }
  } else {
    game.epSquare = EMPTY
  }

  // reset the 50 move counter if a pawn is moved or a piece is captured
  if (currentPieceType === PieceType.PAWN) {
    game.halfMoves = 0
  } else if (move.flags & (MoveFlags.CAPTURE | MoveFlags.EP_CAPTURE)) {
    game.halfMoves = 0
  } else {
    game.halfMoves++
  }

  if (us === Color.BLACK) {
    game.moveNumber++
  }

  game.turn = them
  game.positions = incrementPositions(game.positions, Chess.fen(game))

  return game
}

function trimFen(fen: string): string {
  /*
   * remove last two fields in FEN string as they're not needed when checking
   * for repetition
   */
  return fen.split(" ").slice(0, 4).join(" ")
}

function incrementPositions(positions: Record<string, number>, fen: string) {
  const trimmedFen = trimFen(fen)
  positions = structuredClone(positions)
  if (positions[trimmedFen] === undefined) {
    positions[trimmedFen] = 0
  }
  positions[trimmedFen] += 1
  return positions
}

/*
 * Public Chess.ts API
 */

export namespace Chess {
  export const DEFAULT_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

  export type State = {
    board: Board
    turn: Color
    castling: CastlingState
    epSquare: number
    halfMoves: number
    moveNumber: number
    captured: Piece[]
    positions: Record<string, number>
  }

  export function create(fen: FEN = DEFAULT_POSITION): Chess.State {
    let tokens = fen.split(/\s+/)

    // append commonly omitted fen tokens
    if (tokens.length >= 2 && tokens.length < 6) {
      const adjustments = ["-", "-", "0", "1"]
      fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(" ")
    }

    tokens = fen.split(/\s+/)

    const position = tokens[0]
    const board = Board.create(position)

    const turn = tokens[1] as Color

    const castling: Record<Color, CastlingKind> = {
      w: CastlingKind.NONE,
      b: CastlingKind.NONE,
    }

    if (tokens[2].indexOf("K") > -1) {
      castling.w |= MoveFlags.KSIDE_CASTLE
    }
    if (tokens[2].indexOf("Q") > -1) {
      castling.w |= MoveFlags.QSIDE_CASTLE
    }
    if (tokens[2].indexOf("k") > -1) {
      castling.b |= MoveFlags.KSIDE_CASTLE
    }
    if (tokens[2].indexOf("q") > -1) {
      castling.b |= MoveFlags.QSIDE_CASTLE
    }

    const epSquare = tokens[3] === "-" ? EMPTY : Ox88[tokens[3] as Square]
    const halfMoves = Number.parseInt(tokens[4], 10)
    const moveNumber = Number.parseInt(tokens[5], 10)
    const captured: Piece[] = []
    const positions = incrementPositions({}, fen)

    const state: Chess.State = {
      board,
      turn,
      castling,
      epSquare,
      halfMoves,
      moveNumber,
      captured,
      positions,
    }

    return state
  }

  export function isSquareUnderAttack(board: Board, square: number, color: Color) {
    for (const i of Object.values(Ox88)) {
      const piece = board[i]
      if (!piece) {
        continue
      }

      // if wrong color
      if (piece.color !== color) {
        continue
      }

      const difference = i - square

      // skip - to/from square are the same
      if (difference === 0) {
        continue
      }

      const index = difference + 119

      if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
        if (piece.type === PieceType.PAWN) {
          if ((difference > 0 && piece.color === Color.WHITE) || (difference < 0 && piece.color === Color.BLACK)) {
            return true
          }
          continue
        }

        if (piece.type === PieceType.KNIGHT || piece.type === PieceType.KING) {
          return true
        }

        const offset = RAYS[index]
        let j = i + offset

        let blocked = false
        while (j !== square) {
          const blockedPiece = board[j]

          if (blockedPiece) {
            blocked = true
            break
          }
          j += offset
        }

        if (!blocked) return true
      }
    }

    return false
  }

  export function isCheck(game: Chess.State) {
    return isKingAttacked(game.board, game.turn)
  }

  export function isCheckmate(game: Chess.State): boolean {
    return isCheck(game) && getMoves(game).length === 0
  }

  export function isStalemate(game: Chess.State): boolean {
    return !isCheck(game) && getMoves(game).length === 0
  }

  export function isThreefoldRepetition(game: Chess.State): boolean {
    const trimmedFen = trimFen(Chess.fen(game))
    const repetitions = game.positions[trimmedFen] || 0
    return repetitions >= 3
  }

  export function isInsufficientMaterial(board: Board): boolean {
    /*
     * k.b. vs k.b. (of opposite colors) with mate in 1:
     * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
     *
     * k.b. vs k.n. with mate in 1:
     * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
     */
    const pieces: Record<PieceType, number> = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0,
    }
    const bishops = []
    let numPieces = 0
    let squareColor = 0

    for (const i of BOARD_INDEXES) {
      squareColor = ((i & 0x7) + (i >> 4)) % 2

      const piece = board[i]
      if (piece) {
        pieces[piece.type] += 1
        if (piece.type === PieceType.BISHOP) {
          bishops.push(squareColor)
        }
        numPieces++
      }
    }

    // k vs. k
    if (numPieces === 2) {
      return true
    }

    // k vs. kn .... or .... k vs. kb
    if (numPieces === 3 && (pieces[PieceType.BISHOP] === 1 || pieces[PieceType.KNIGHT] === 1)) {
      return true
    }

    // kb vs. kb where any number of bishops are all on the same color
    if (numPieces === pieces[PieceType.BISHOP] + 2) {
      const firstBishopColor = bishops[0]
      if (bishops.every((color) => color === firstBishopColor)) {
        return true
      }
    }

    return false
  }

  export function isDraw(game: Chess.State) {
    return (
      game.halfMoves >= 100 || // 50 moves per side = 100 half moves
      isStalemate(game) ||
      isInsufficientMaterial(game.board) ||
      isThreefoldRepetition(game)
    )
  }

  export function isGameOver(game: Chess.State) {
    return isCheckmate(game) || isDraw(game)
  }

  export function fen(state: Chess.State): FEN {
    const castling =
      [
        state.castling[Color.WHITE] & MoveFlags.KSIDE_CASTLE ? "K" : "",
        state.castling[Color.WHITE] & MoveFlags.QSIDE_CASTLE ? "Q" : "",
        state.castling[Color.BLACK] & MoveFlags.KSIDE_CASTLE ? "k" : "",
        state.castling[Color.BLACK] & MoveFlags.QSIDE_CASTLE ? "q" : "",
      ].join("") || "-"

    let epSquare = "-"
    /*
     * only print the ep square if en passant is a valid move (pawn is present
     * and ep capture is not pinned)
     */
    if (state.epSquare !== EMPTY) {
      const bigPawnSquare = state.epSquare + (state.turn === Color.WHITE ? 16 : -16)
      const squares = [bigPawnSquare + 1, bigPawnSquare - 1]

      for (const square of squares) {
        // is the square off the board?
        if (square & 0x88) {
          continue
        }

        const color = state.turn

        // is there a pawn that can capture the epSquare?
        const piece = state.board[square]
        if (piece && piece.color === color && piece.type === PieceType.PAWN) {
          // if the pawn makes an ep capture, does it leave it's king in check?
          const newState = makeCandidateMove(state, {
            from: square,
            to: state.epSquare,
            flags: MoveFlags.EP_CAPTURE,
          })
          const isLegal = !isKingAttacked(newState.board, color)

          // if ep is legal, break and set the ep square in the FEN output
          if (isLegal) {
            epSquare = algebraic(state.epSquare)
            break
          }
        }
      }
    }

    return [Board.fen(state.board), state.turn, castling, epSquare, state.halfMoves, state.moveNumber].join(" ")
  }

  export function getMoves(
    game: Chess.State,
    {
      piece = undefined,
      square = undefined,
    }: {
      piece?: PieceType
      square?: Square
    } = {},
  ): Move[] {
    const forSquare = square ? (square.toLowerCase() as Square) : undefined
    const forPiece = piece?.toLowerCase()

    const moves: Move[] = []

    let firstSquare: SquareIndex = Ox88.a8
    let lastSquare: SquareIndex = Ox88.h1
    let singleSquare = false

    // are we generating moves for a single square?
    if (forSquare) {
      // illegal square, return empty moves
      if (!(forSquare in Ox88)) {
        return []
      }
      firstSquare = lastSquare = Ox88[forSquare]
      singleSquare = true
    }

    for (let from = firstSquare; from <= lastSquare; from++) {
      // did we run off the end of the board
      if (from & 0x88) {
        from += 7
        continue
      }

      const currentPiece = game.board[from]
      if (!currentPiece) {
        continue
      }
      if (currentPiece.color !== game.turn) {
        continue
      }
      if (forPiece && forPiece !== currentPiece.type) {
        continue
      }

      switch (currentPiece.type) {
        case PieceType.PAWN:
          moves.push(...generatePawnMoves(game, from))
          break

        case PieceType.KING:
          moves.push(...generatePieceMoves(game.board, currentPiece, from))
          /*
           * check for castling if we're:
           *   a) generating all moves, or
           *   b) doing single square move generation on the king's square
           */
          if (!singleSquare || from === lastSquare) {
            moves.push(...generateKingCastlingMoves(game, from))
          }
          break

        default:
          moves.push(...generatePieceMoves(game.board, currentPiece, from))
      }
    }
    // filter out illegal moves
    return legalMoves(game, moves)
  }

  export function makeMove(game: Chess.State, move: { from: number; to: number; promotion?: PieceType }): Chess.State {
    const moves = getMoves(game)
    let matchingMove = null

    for (const candidateMove of moves) {
      const isMatchingMove =
        move.from === candidateMove.from &&
        move.to === candidateMove.to &&
        (!("promotion" in candidateMove) || move.promotion === candidateMove.promotion)

      if (isMatchingMove) {
        matchingMove = candidateMove
        break
      }
    }

    // failed to find move
    if (!matchingMove) {
      throw new Error(`Invalid move: ${JSON.stringify(move)}`)
    }

    return makeCandidateMove(game, matchingMove)
  }

  export function getOccupiedSquares(game: Chess.State): Record<SquareIndex, Piece> {
    const position: Partial<Record<SquareIndex, Piece>> = {}
    for (const [index, square] of game.board.entries()) {
      if (square === null) {
        continue
      }
      position[index as SquareIndex] = square
    }
    return position as Record<SquareIndex, Piece>
  }

  export function getOffboardPieces(board: Board): Piece[] {
    const initialPieces: Array<{ type: PieceType; color: Color } | null> = INITIAL_PIECES.flatMap((type) => [
      { type, color: Color.BLACK },
      { type, color: Color.WHITE },
    ])

    const pieces = board.filter((square) => square !== null)

    for (const piece of pieces) {
      const i = initialPieces.findIndex((p) => p && p.type === piece.type && p.color === piece.color)

      if (i !== -1) {
        initialPieces[i] = null
      }
    }

    const offboardId = 128
    const offboard = initialPieces
      .filter((piece) => piece !== null)
      .map((piece, i) => ({ ...piece, id: offboardId + i }))

    return offboard
  }
}

export namespace Chess.Board {
  export function create(fen: FEN): Board {
    const position = fen.split(" ")[0]
    let squareIndex = 0

    const board: Board = new Array(128).fill(null)

    let peiceId = 1

    for (const char of position) {
      if (char === "/") {
        squareIndex += 8 // Move to the start of the next row
      } else if (isDigit(char)) {
        squareIndex += Number.parseInt(char, 10) // Skip empty squares
      } else {
        // Upper case letters precede lower case letters
        const color = char < "a" ? Color.WHITE : Color.BLACK
        const piece: Piece = {
          id: peiceId++,
          type: char.toLowerCase() as PieceType,
          color,
        }
        board[squareIndex] = piece
        squareIndex++
      }
    }

    return board
  }

  export function fen(board: Board): FEN {
    let emptyCount = 0
    let row = ""
    const position = []

    for (const i of BOARD_INDEXES) {
      const currentPiece = board[i]
      if (currentPiece) {
        if (emptyCount > 0) {
          row = `${row}${emptyCount}`
          emptyCount = 0
        }
        const { color, type } = currentPiece

        row += color === Color.WHITE ? type.toUpperCase() : type.toLowerCase()
      } else {
        emptyCount++
      }

      if ((i + 1) & 0x88) {
        if (emptyCount > 0) {
          row = `${row}${emptyCount}`
        }

        emptyCount = 0
        position.push(row)
        row = ""
      }
    }
    return position.join("/")
  }

  export function ascii(board: Board, prettyPrint = true): string {
    const whiteSymbols = { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" }
    const blackSymbols = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
    const ranks = "87654321"

    let s = "   ┌────────────────────────┐\n"
    for (const i of BOARD_INDEXES) {
      // display the rank
      if (file(i) === 0) {
        s += ` ${ranks[rank(i)]} │`
      }

      const item = board[i]
      if (item) {
        const piece = item.type
        const color = item.color
        let symbol: string
        if (prettyPrint) {
          symbol = color === Color.WHITE ? whiteSymbols[piece] : blackSymbols[piece]
        } else {
          symbol = color === Color.WHITE ? piece.toUpperCase() : piece.toLowerCase()
        }
        s += ` ${symbol} `
      } else {
        s += " · "
      }

      if ((i + 1) & 0x88) {
        s += "│\n"
      }
    }
    s += "   └────────────────────────┘\n"
    s += "     a  b  c  d  e  f  g  h"

    return s
  }
}

export namespace Chess.FEN {
  export function validate(fen: string) {
    // 1st criterion: 6 space-seperated fields?
    const tokens = fen.split(/\s+/)
    if (tokens.length !== 6) {
      return {
        ok: false,
        error: "Invalid FEN: must contain six space-delimited fields",
      }
    }

    // 2nd criterion: move number field is a integer value > 0?
    const moveNumber = Number.parseInt(tokens[5], 10)
    if (Number.isNaN(moveNumber) || moveNumber <= 0) {
      return {
        ok: false,
        error: "Invalid FEN: move number must be a positive integer",
      }
    }

    // 3rd criterion: half move counter is an integer >= 0?
    const halfMoves = Number.parseInt(tokens[4], 10)
    if (Number.isNaN(halfMoves) || halfMoves < 0) {
      return {
        ok: false,
        error: "Invalid FEN: half move counter number must be a non-negative integer",
      }
    }

    // 4th criterion: 4th field is a valid e.p.-string?
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { ok: false, error: "Invalid FEN: en-passant square is invalid" }
    }

    // 5th criterion: 3th field is a valid castle-string?
    if (/[^kKqQ-]/.test(tokens[2])) {
      return {
        ok: false,
        error: "Invalid FEN: castling availability is invalid",
      }
    }

    // 6th criterion: 2nd field is "w" (white) or "b" (black)?
    if (!/^(w|b)$/.test(tokens[1])) {
      return { ok: false, error: "Invalid FEN: side-to-move is invalid" }
    }

    // 7th criterion: 1st field contains 8 rows?
    const rows = tokens[0].split("/")
    if (rows.length !== 8) {
      return {
        ok: false,
        error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
      }
    }

    // 8th criterion: every row is valid?
    for (const row of rows) {
      // check for right sum of fields AND not two numbers in succession
      let sumFields = 0
      let previousWasNumber = false

      for (const char of row) {
        if (isDigit(char)) {
          if (previousWasNumber) {
            return {
              ok: false,
              error: "Invalid FEN: piece data is invalid (consecutive number)",
            }
          }
          sumFields += Number.parseInt(char, 10)
          previousWasNumber = true
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(char)) {
            return {
              ok: false,
              error: "Invalid FEN: piece data is invalid (invalid piece)",
            }
          }
          sumFields += 1
          previousWasNumber = false
        }
      }
      if (sumFields !== 8) {
        return {
          ok: false,
          error: "Invalid FEN: piece data is invalid (too many squares in rank)",
        }
      }
    }

    // 9th criterion: is en-passant square legal?
    if ((tokens[3][1] === "3" && tokens[1] === "w") || (tokens[3][1] === "6" && tokens[1] === "b")) {
      return { ok: false, error: "Invalid FEN: illegal en-passant square" }
    }

    // 10th criterion: does chess position contain exact two kings?
    const kings = [
      { color: "white", regex: /K/g },
      { color: "black", regex: /k/g },
    ]

    for (const { color, regex } of kings) {
      if (!regex.test(tokens[0])) {
        return { ok: false, error: `Invalid FEN: missing ${color} king` }
      }

      if ((tokens[0].match(regex) || []).length > 1) {
        return { ok: false, error: `Invalid FEN: too many ${color} kings` }
      }
    }

    // 11th criterion: are any pawns on the first or eighth rows?
    if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === "P")) {
      return {
        ok: false,
        error: "Invalid FEN: some pawns are on the edge rows",
      }
    }

    return { ok: true }
  }
}
