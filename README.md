# chess.ts

chess.ts is a TypeScript chess library used for chess move
generation, piece movement, and check/checkmate/stalemate
detection.

It is a fork of [chess.js](https://github.com/jhlywa/chess.js).
It has been almost entirely rewritten using modern TypeScript
approaches and functional programming techniques.

## Installation

Run the following command to install the most recent version of chess.js from
NPM:

```sh
npm install @sprql/chess.ts
```

## Importing

### Import (as ESM)

```js
import { Chess } from 'chess.ts'
```

ECMAScript modules (ESM) can be directly imported in a browser:

```html
<script type="module">
  import { Chess } from 'chess.ts'
</script>
```

## Example Code

The code below plays a random game of chess:

```js
import { Chess } from 'chess.ts'

let game = Chess.create()

while (!Chess.isGameOver(game)) {
  const moves = Chess.getMoves(game)
  const move = moves[Math.floor(Math.random() * moves.length)]
  game = Chess.makeMove(game, move)
}
```

## User Interface

By design, chess.ts is a headless library and does not include user interface
elements.
