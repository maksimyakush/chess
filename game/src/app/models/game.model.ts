export class Game {
    FEN?: string;
    turn?: string;
    firstPlayerTime?: number;
    secondPlayerTime?: number;
    firstPlayerKey?: any;
    secondPlayerKey?: any;
    timeControl?: number;
    isFirstPlayerReady?: boolean;
    isSecondPlayerReady?: boolean;
    lastMove?: any;
    gameOver?: boolean;
    rematchDisabled?: boolean;
    resignedPlayer?: string;
    winnerPlayer?: string;
    resignDisabled?: boolean;
    checked?: boolean;
    opponentLeft?:string;
    gameKey?:any;
}