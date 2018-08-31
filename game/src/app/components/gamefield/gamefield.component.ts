import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { User } from '../../models/user.model';
import { Game } from '../../models/game.model';

import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToMinutesPipe } from '../../pipes/to-minutes.pipe';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/interval';
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/take";
import "rxjs/add/observable/of";
import { takeWhile } from 'rxjs/operator/takeWhile';
import { timeInterval } from 'rxjs/operators/timeInterval';

declare let require: any;
declare let $: any;
declare let ChessBoard: any;
declare let Chess: any;

@Component({
  selector: 'app-gamefield',
  templateUrl: './gamefield.component.html',
  styleUrls: ['./gamefield.component.css']
})

export class GamefieldComponent implements OnInit {
  gameDocument: AngularFirestoreDocument<Game>;
  game: Observable<Game>;
  firstPlayerDocument: AngularFirestoreDocument<User>;
  secondPlayerDocument: AngularFirestoreDocument<User>;
  firstPlayer: Observable<User>;
  secondPlayer: Observable<User>;

  firstPlayerTimeStream$;
  secondPlayerTimeStream$;
  rematchButtonStream$;
  checkBaseAfterMove$;
  timeEndedObserve$;
  gameFinishObserve$;

  board;
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  cfg;
  turn;
  firstPlayerTime: number;
  secondPlayerTime: number;
  stockfish = new Worker("../../../assets/gamefield/stockfish.js");
  gameData;
  rootKey: string;
  firstPlayerData;
  secondPlayerData;
  counter = 1;
  gameOver = false;
  resigned = false;
  resignedPlayer;
  winner;
  prevFen;

  particlesStyle: object = {};
  particlesParams: object = {};
  width = 100;
  height = 100;
  constructor(private db: AngularFirestore,
              private router: Router,
              private AuthService: AuthService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.particlesStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };
    this.particlesParams = {
      particles: {
        number: {
          value: 50,
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle',
        },
      }
    };
    const game = new Chess();
    this.gameOver = game.game_over();
    this.activatedRoute.paramMap
      .subscribe(params => {
        this.rootKey = params.get("key");
      });
    this.gameDocument = this.db.doc(`game/${this.rootKey}`);
    this.game = this.gameDocument.valueChanges();
    this.game.subscribe(gameData => {
      this.gameData = gameData;
      this.checkBaseAfterMove$ = Observable
        .fromEvent(document, "click")
        .filter(() => this.prevFen !== game.fen())
        .subscribe(() => {
          this.fen = this.board.fen();
          if (game.turn() === "w") {
            this.firstPlayerTimeStream$.unsubscribe();
          }
          if (game.turn() === "b") {
            this.secondPlayerTimeStream$.unsubscribe();
          }
          this.gameDocument.update({
            FEN: game.fen(),
            turn: game.turn(),
            firstPlayerTime: this.firstPlayerTime,
            secondPlayerTime: this.secondPlayerTime
          });
          this.prevFen = game.fen();
        });
      this.firstPlayerDocument = this.db.doc(`users/${this.gameData.firstPlayerKey}`);
      this.firstPlayer = this.firstPlayerDocument.valueChanges();
      this.firstPlayer.subscribe(res => this.firstPlayerData = res);
      this.secondPlayerDocument = this.db.doc(`users/${this.gameData.secondPlayerKey}`);
      this.secondPlayer = this.secondPlayerDocument.valueChanges();
      this.secondPlayer.subscribe(res => this.secondPlayerData = res);
      this.turn = gameData.turn;
      this.firstPlayerTime = gameData.firstPlayerTime;
      this.secondPlayerTime = gameData.secondPlayerTime;
      if (document.querySelector("#board")) {
        document.querySelector("#board").classList.remove('disabled');
      }
      this.setGame(game);
      gameData.FEN != "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" && !gameData.gameOver ? this.gameDocument.update({ resignDisabled: false }) : "";
      $('.rematch').prop("disabled", this.gameData.rematchDisabled);
      $('.resign').prop("disabled", this.gameData.resignDisabled);
      this.firstPlayerTimeStream$ = Observable.interval(1000)
        .takeWhile(() => game.turn() !== "w" &&
          gameData.FEN !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" &&
          !this.gameData.gameOver
        )
        .subscribe(() => {
          this.firstPlayerTime = this.firstPlayerTime - 1;
          if (this.firstPlayerTime <= 0 || this.secondPlayerTime <= 0) {
            this.gameDocument.update({ gameOver: true })
            this.firstPlayerTimeStream$.unsubscribe();
          }
        })
      if (gameData.turn === "w" || gameData.resignDisabled) {
        this.firstPlayerTimeStream$.unsubscribe();
      }
      this.secondPlayerTimeStream$ = Observable.interval(1000)
        .takeWhile(() => game.turn() !== "b" &&
          gameData.FEN !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" &&
          !this.gameData.gameOver)
        .subscribe(() => {
          this.secondPlayerTime = this.secondPlayerTime - 1;
          if (this.firstPlayerTime <= 0 || this.secondPlayerTime <= 0) {
            this.gameDocument.update({ gameOver: true })
            this.secondPlayerTimeStream$.unsubscribe();
          }
        })
      if (gameData.turn === "b") {
        this.secondPlayerTimeStream$.unsubscribe();
      }

      /////////////////////////// firstPlayer
      if (this.AuthService.currentUserId === gameData.firstPlayerKey) {
        game.load(gameData.FEN);
        this.stockfish.postMessage("position fen " + gameData.FEN);
        this.board.orientation("black");
        if (gameData.turn === "w") {
          if (game.game_over()) {
            this.gameDocument.update({
              lastMove: gameData.firstPlayerKey,
              gameOver: true
            });
          }
          if (document.querySelector("#board")) {
            document.querySelector("#board").classList.add("disabled")
          }
        }
      }

      //////////////////////// secondPlayer
      if (this.AuthService.currentUserId === gameData.secondPlayerKey) {
        game.load(gameData.FEN);
        this.stockfish.postMessage("position fen " + gameData.FEN);
        this.board.orientation("white");
        if (gameData.turn === "b") {
          if (game.game_over()) {
            this.gameDocument.update({
              lastMove: gameData.secondPlayerKey,
              gameOver: true,
            });
          }
          if (document.querySelector("#board")) {
            document.querySelector("#board").classList.add('disabled');
          }
        }
      }
      this.evaluateStockfish(gameData, game)
      this.board.position(gameData.FEN);
      this.gameFinishObserve$ = Observable.of(this.gameData)
        .filter(() => this.gameData.gameOver)
        .subscribe(() => {
          if (gameData.isFirstPlayerReady && gameData.isSecondPlayerReady) {
            this.gameDocument.update({
              rematchDisabled: false,
              resignDisabled: true,
            });
          }
          if (this.counter && !gameData.checked) {
            this.gameFinished(game);
          }
        })
      this.rematchButtonStream$ = Observable
        .fromEvent($('.rematch'), 'click')
        .takeWhile(resi => this.gameData.gameOver)
        .subscribe(resi => this.rematch(game))
    })

    this.cfg = {
      onDragStart: this.setGame(game).onDragStart,
      onDrop: this.setGame(game).onDrop,
      draggable: true,
      position: this.fen,
      orientation: "white",
      onSnapEnd: this.setGame(game).onSnapEnd
    };
    this.board = ChessBoard('board', this.cfg);

 /////////// OnInit end
  }

  gameFinished(game) {
    if (!this.counter) {
      return;
    }
    this.counter = 0;
    this.gameDocument.update({ checked: true, lastMove: "" });
    if (this.firstPlayerTime <= 0) {
      this.db.collection(`users/${this.gameData.firstPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
      this.db.collection(`users/${this.gameData.secondPlayerKey}/gamesHistory`).add({ changeRating: -30, date: Date.now() });
      if (this.gameData.turn === "b") {
        this.gameDocument.update({ winnerPlayer: "White won on time" });
      } else if (this.gameData.turn === "w") {
        this.gameDocument.update({ winnerPlayer: "Black won on time" });
      }
      return;
    } else if (this.gameData.lastMove === this.gameData.firstPlayerKey) {
        this.db.collection(`users/${this.gameData.firstPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
        this.db.collection(`users/${this.gameData.secondPlayerKey}/gamesHistory`).add({ changeRating: -30, date: Date.now() });
        if (this.gameData.turn === "b") {
          this.gameDocument.update({ winnerPlayer: "White won" });
        } else if (this.gameData.turn === "w") {
          this.gameDocument.update({ winnerPlayer: "Black won" });
        }
        return;
    } else if (this.secondPlayerTime <= 0) {
        this.db.collection(`users/${this.gameData.firstPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
        this.db.collection(`users/${this.gameData.secondPlayerKey}/gamesHistory`).add({ changeRating: -30, date: Date.now() });
        if (this.gameData.turn === "b") {
          this.gameDocument.update({ winnerPlayer: "White won on time" });
        } else if (this.gameData.turn === "w") {
          this.gameDocument.update({ winnerPlayer: "Black won on time" });
        }
        return;
    } else if (this.gameData.lastMove === this.gameData.secondPlayerKey) {
        this.db.collection(`users/${this.gameData.firstPlayerKey}/gamesHistory`).add({ changeRating: -30, date: Date.now() });
        this.db.collection(`users/${this.gameData.secondPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
        if (this.gameData.turn === "b") {
          this.gameDocument.update({ winnerPlayer: "White won" });
        } else if (this.gameData.turn === "w") {
          this.gameDocument.update({ winnerPlayer: "Black won" });
        }
        return;
    }
  }

  rematch(game) {
    this.gameDocument.set({
      FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      turn: "w",
      firstPlayerTime: this.gameData.timeControl,
      secondPlayerTime: this.gameData.timeControl,
      firstPlayerKey: this.gameData.secondPlayerKey,
      secondPlayerKey: this.gameData.firstPlayerKey,
      timeControl: this.gameData.timeControl,
      isFirstPlayerReady: true,
      isSecondPlayerReady: true,
      lastMove: "",
      gameOver: false,
      rematchDisabled: true,
      resignedPlayer: "",
      winnerPlayer: "",
      resignDisabled: true,
      checked: false

    }).then(res => {
      this.firstPlayer.subscribe(res => this.firstPlayerData = res);
      this.secondPlayer.subscribe(res => this.secondPlayerData = res);
    });
    this.firstPlayerTime = this.gameData.timeControl;
    this.secondPlayerTime = this.gameData.timeControl;
    this.board = ChessBoard('board', this.cfg);
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    game.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    this.cfg = {
      onDragStart: this.setGame(game).onDragStart,
      onDrop: this.setGame(game).onDrop,
      draggable: true,
      position: this.fen,
      orientation: "white",
      onSnapEnd: this.setGame(game).onSnapEnd
    };
    this.board = ChessBoard('board', this.cfg);
    this.winner = "";
    this.counter = 1;
  }

  resign() {
    this.firstPlayerTimeStream$.unsubscribe();
    this.secondPlayerTimeStream$.unsubscribe();
    if (this.board.orientation() === "white") {
      this.resignedPlayer = "White resigned"
    } else if (this.board.orientation() === "black") {
      this.resignedPlayer = "Black resigned"
    }
    this.gameDocument.update({
      resignedPlayer: this.resignedPlayer,
      gameOver: true,
      resignDisabled: true,
      rematchDisabled: false
    })
    this.db.collection(`users/${this.AuthService.currentUserId}/gamesHistory`).add({ changeRating: -30, date: Date.now() });
    if (this.AuthService.currentUserId === this.gameData.secondPlayerKey) {
      this.db.collection(`users/${this.gameData.firstPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
    } else if (this.AuthService.currentUserId === this.gameData.firstPlayerKey) {
      this.db.collection(`users/${this.gameData.secondPlayerKey}/gamesHistory`).add({ changeRating: 30, date: Date.now() });
    }
  }

  exit() {
    if (this.firstPlayerTimeStream$) {
      this.firstPlayerTimeStream$.unsubscribe();
    }
    if (this.secondPlayerTimeStream$) {
      this.secondPlayerTimeStream$.unsubscribe();
    }
    this.firstPlayerDocument.update({ status: "" });
    this.secondPlayerDocument.update({ status: "" });
    this.gameDocument.update({
      isFirstPlayerReady: false,
      isSecondPlayerReady: false,
      gameOver: true,
      opponentLeft: "Your opponent has left",
      rematchDisabled: true
    })
    .then(() => this.firstPlayerDocument.update({ status: "" }))
    .then(() => this.secondPlayerDocument.update({ status: "" }));
    this.router.navigate(['']);
  }

  evaluateStockfish(data, game) {
    this.stockfish.postMessage("go depth 15");
    this.stockfish.postMessage("position fen " + game.fen());
    this.stockfish.onmessage = function (event) {
      const bestMove = event.data.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
      const match = event.data.match(/score\scp\s(-?\d+)/);
      if (match) {
        let score: number = match[1] / 100;
        if (data.turn === 'b' && score > 0 || data.turn === 'b' && score < 0) {
          score = -score;
        }
        $("#score").html(score);
      }
    };
  }

  finishGame(game) {
    if (game.game_over()) {
      this.gameOver = true;
    }
  }

  setGame(game) {
    return {
      onDragStart(source, piece, position, orientation) {
        if (game.game_over() === true ||
          (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
          return false;
        }
      },
      onDrop(source, target) {
        const move = game.move({
          from: source,
          to: target,
          promotion: 'q'
        });
        const audio = document.createElement('audio');
        audio.src = '"../../../assets/media/move-sound.wav';
        audio.play();
        // illegal move
        if (move === null) {
          return 'snapback';
        }
      },
      onSnapEnd() {
        if (this.board) {
          return this.board.position(game.fen());
        }
      }
    }
  }
}
