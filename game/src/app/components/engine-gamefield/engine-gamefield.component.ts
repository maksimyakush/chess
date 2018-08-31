import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import 'rxjs/add/observable/interval';

declare let require: any;
declare let $: any;
declare let ChessBoard: any;
declare let Chess: any;

@Component({
  selector: 'app-engine-gamefield',
  templateUrl: './engine-gamefield.component.html',
  styleUrls: ['./engine-gamefield.component.css']
})

export class EngineGamefieldComponent implements OnInit {
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  stockfish = new Worker("../../../assets/gamefield/stockfish.js");
  board;
  cfg;
  turn;
  prevPosition;
  winner: string;
  particlesStyle: object = {};
  particlesParams: object = {};
  width = 100;
  height = 100;
  constructor(private router: Router) { }

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
    this.cfg = {
      onDragStart: this.setGame(game).onDragStart,
      onDrop: this.setGame(game).onDrop,
      draggable: true,
      orientation: "white",
      onSnapEnd: this.setGame(game).onSnapEnd,
      position: "start"
    };
    this.setGame(game);
    this.board = ChessBoard('board', this.cfg);
    Observable
      .interval(1000)
      .subscribe(res => {
        if (game.turn() === "b") {
          this.evaluateStockfish(game);
          this.board.position(game.fen());
        }
      });
    Observable
      .interval(1000)
      .subscribe(res => {
        this.board.position(game.fen());
        if (game.game_over()) {
          if (game.turn() === "b") {
            this.winner = "White won!";
          }
          if (game.turn() === "w") {
            this.winner = "Black won!";
          }
        }
      })
  }

  exit() {
    this.router.navigate(['']);
  }

  evaluateStockfish(game) {
    this.stockfish.postMessage("go depth 15");
    this.stockfish.postMessage("position fen " + game.fen());
    this.stockfish.onmessage = function (event) {
      const bestMove = event.data.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
      const match = event.data.match(/score\scp\s(-?\d+)/);
      if (match) {
        const score: number = match[1] / 100;
      }
      if (bestMove) {
        game.move(bestMove[1], { sloppy: true });
      }
    };
  }

  setGame(game) {
    return {
      onDragStart(source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
          piece.search(/^b/) !== -1) {
          return false;
        }
      },
      onDrop(source, target) {
        const audio = document.createElement('audio');
        audio.src = '"../../../assets/media/move-sound.wav';
        audio.play();
        const move = game.move({
          from: source,
          to: target,
          promotion: 'q'
        });
        if (move === null) {
          return 'snapback';
        }
      },
      onSnapEnd() {
        this.fen = game.fen();
        this.turn = game.turn();
      }
    };
  }
}
