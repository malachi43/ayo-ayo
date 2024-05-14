import { EventEmitter } from "node:events";
import minimax from "./minimax.mjs"
export default class AyoAyo extends EventEmitter {
    static events = {
        GAME_OVER: "game_over",
        DROP_SEED: "drop_seed",
        SWITCH_TURN: "switch_turn",
        MOVE_TO: "move_to",
        PICKUP_SEEDS: "pickup_seeds",
        CAPTURE: "capture"
    }

    static TOTAL_NUM_SEEDS = 48;
    static NUM_CELLS_PER_ROW = 6;
    constructor() {
        super();
        this.board = [
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]
        ];
        this.captured = [0, 0];
        this.nextPlayer = 0;
        this.isGameOver = false;
        this.winner = null;
        this.permissibleMoves = [0, 1, 2, 3, 4, 5];
    }

    play(cell) {
        //check the permitted cell the user should pick from.
        if (!this.permissibleMoves.includes(cell)) throw new Error(`You're not permitted to pick from this cell.`);

        //Simulate-sowing of seeds. Update board and increment captures.
        let captured;
        [this.board, captured] = AyoAyo.relaySow(this.board, this.nextPlayer, cell, (eventType, ...args) => this.emit(eventType, ...args));
        this.captured[0] += captured[0];
        this.captured[1] += captured[1];

        //toggle to next player
        this.nextPlayer = AyoAyo.togglePlayer(this.nextPlayer);
        this.emit(AyoAyo.events.SWITCH_TURN, this.nextPlayer);

        this.permissibleMoves = AyoAyo.getPermissibleMoves(this.board, this.nextPlayer);

        //no point continuing if the next player has no more moves to make, or if someone has more than half of the seeds
        const shouldEndGame = this.permissibleMoves.length == 0 || this.captured.some(count => count > AyoAyo.TOTAL_NUM_SEEDS / 2);

        //capture remaining seeds if the opponent has no moves to make.
        const shouldCaptureRemainingSeeds = this.permissibleMoves.length == 0;

        if (shouldCaptureRemainingSeeds) {
            let numRemainingSeeds = 0;
            this.board[this.nextPlayer] = this.board[this.nextPlayer].map((cell, index) => {
                numRemainingSeeds += cell
                this.emit(AyoAyo.events.CAPTURE, this.nextPlayer, index, this.nextPlayer);
                return 0;
            })

            this.captured[this.nextPlayer] += numRemainingSeeds;
        }

        if (shouldEndGame) {
            this.permissibleMoves = [];
            this.isGameOver = true;
            this.winner = AyoAyo.winner(this.captured);
            this.emit(AyoAyo.events.GAME_OVER, this.winner);
        }
    }

    //returns a copy of the game state. This is to avoid mutation.
    clone() {
        const clone = new AyoAyo();
        clone.winner = this.winner;
        clone.captured = this.captured.slice();
        clone.board = this.board.map(row => row.slice());
        clone.permissibleMoves = this.permissibleMoves.slice();
        clone.nextPlayer = this.nextPlayer;

        return clone;
    }

    //simulate sowing of seeds starting from cell and returns the updated board and number of captured seeds. Report events by calling emit. (made possible through EventEmitter).
    static relaySow(board, player, cell, emit = function (eventType, ...args) { }) {
        const captured = [0, 0];

        //pickup seeds
        let numSeedsInHand = board[player][cell];
        board[player][cell] = 0;
        emit(AyoAyo.events.PICKUP_SEEDS, player, cell);

        //move to next cell position.
        const nextPosition = AyoAyo.next(player, cell);
        emit(AyoAyo.events.MOVE_TO, [player, cell], nextPosition);
        let [nextPositionRow, nextPositionCell] = nextPosition;

        //terminate when all seeds have been dropped and no continuing pickup was done.
        while (numSeedsInHand > 0) {
            //drop one seed in next cell.
            board[nextPositionRow][nextPositionCell]++;
            numSeedsInHand--;
            emit(AyoAyo.events.DROP_SEED, nextPositionRow, nextPositionCell);

            //if the cell has four seeds, capture that specific cell. 
            //if this is the last seed in hand, give it to the current player. 
            //if not, give to the owner of the row.
            if (board[nextPositionRow][nextPositionCell] == 4) {
                const capturer = numSeedsInHand == 0 ? player : nextPositionRow;
                captured[capturer] += 4;
                //set cell to zero since all seeds has been picked up.
                board[nextPositionRow][nextPositionCell] = 0;
                emit(AyoAyo.events.CAPTURE, nextPositionRow, nextPositionCell, capturer);
            }

            //simulate. if this is the last seed in hand and the cell was not originally empty, pickup the seeds in the cell.
            if (numSeedsInHand == 0 && board[nextPositionRow][nextPositionCell] > 1) {
                //the current seed in hand now.
                numSeedsInHand = board[nextPositionRow][nextPositionCell];
                //set cell to zero since all seeds has been picked up.
                board[nextPositionRow][nextPositionCell] = 0;
                emit(AyoAyo.events.PICKUP_SEEDS, nextPositionRow, nextPositionCell);
            }

            //move to next position
            const nextPosition = AyoAyo.next(nextPositionRow, nextPositionCell);
            emit(AyoAyo.events.MOVE_TO, [nextPositionRow, nextPositionCell], nextPosition);
            [nextPositionRow, nextPositionCell] = nextPosition;
        }

        return [board, captured];
    }

    static togglePlayer(player) {
        //returns either 1 or 0.
        return (player + 1) % 2;
    }

    //returns a list of all possible cells the next player can play. 
    //a player may play only cells with at least one seed. 
    //if the other player has no seeds, the current player must "feed" them, if possible.
    static getPermissibleMoves(board, player) {
        const otherPlayer = AyoAyo.togglePlayer(player);
        const nonEmptyCellIndexes = board[player].map((_, index) => index).filter(cellIndex => board[player][cellIndex] > 0);

        //if the other player has seeds, permit all non-empty cells
        const otherPlayerHasSeeds = board[otherPlayer].some(cell => cell > 0);
        if (otherPlayerHasSeeds) {
            return nonEmptyCellIndexes;
        }

        //other player has no seeds, permit only non-empty cells that feed
        return nonEmptyCellIndexes.filter(cellIndexes => {
            const boardCopy = board.map(row => row.slice());
            const [boardIfCellPlayed] = AyoAyo.relaySow(boardCopy, player, cellIndexes);
            return boardIfCellPlayed[otherPlayer].some(cell => cell > 0);
        })
    }


    static getWinner(captured) {
        //return -1 if there is a tie (both player have equal number of seeds).
        if (captured[0] == captured[1]) return -1
        if (captured[0] > captured[1]) return 0;
        return 1
    }

    static next(row, cell) {
        // if in the first row, check if the current hand location is at the far left of the board.
        //if YES, go to the next(second) row, if NO, move the hand to the next cell towards the left.
        if (row == 0) return cell == 0 ? [1, 0] : [0, cell - 1]

        // if in the second row, check if the current hand location is at the far right of the board.
        //if YES, go to the first  row, if NO move the hand to the next cell towards the right.
        return cell == AyoAyo.NUM_CELLS_PER_ROW - 1 ? [0, AyoAyo.NUM_CELLS_PER_ROW - 1] : [1, cell + 1];
    }

    static vsMinimax(depth = 5) {
        const game = new AyoAyo();
        const oldPlayFunc = game.play.bind(game);
        game.play = function (...args) {
            oldPlayFunc(...args);
            if (game.winner == null) {
                const [_, moves] = minimax(game, depth, "", game.nextPlayer == 0);
                const move = Number(moves[0]);
                oldPlayFunc(move);
            }
        }
        return game;
    }
}
