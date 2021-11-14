'use strict';

// ルール
class Rule {
  constructor() {
    this.ruleContent = document.getElementById('rule'); //ルール内容
    const ruleBtn = document.getElementById('show-rule'); //ルールボタン
    this.overlayBlur = document.getElementById('overlay-blur'); //ぼかし
    const closeRuleBtn = document.getElementById('close-rule'); //ルールを閉じるボタン
    // アローでthisをparentへ
    ruleBtn.addEventListener('click', () => this.openRule()); //ルールを開く
    closeRuleBtn.addEventListener('click', () => this.closeRule()); //ルールを閉じる
    this.overlayBlur.addEventListener('click', () => this.closeoverlayBlur()); //ぼかしを消す
  }

  //ルールを開く
  openRule() {
    this.ruleContent.classList.add('show');
    this.overlayBlur.classList.remove('hidden');
  }

  //ルールを閉じる
  closeRule() {
    this.ruleContent.classList.remove('show');
    this.overlayBlur.classList.add('hidden');
  }

  //ぼかしを消す
  closeoverlayBlur() {
    this.ruleContent.classList.remove('show');
    this.overlayBlur.classList.add('hidden');
  }
}

// パネル
class Panel {
  constructor(i, game) {
    this.game = game; //ゲーム
    this.panelEl = document.createElement('div'); //div要素作成
    this.panelEl.classList.add('panel', 'inactive'); //class追加
    this.panelEl.textContent = i; //数字
    //クリックイベント
    this.panelEl.addEventListener('click', e => {
      this.pushPanel(e);
    });
  }

  // パネルを押す
  pushPanel(e) {
    if (this.game.boardLock) return; // ボードロック中は押せない
    if (e.target.classList.contains('inactive')) return; //パネル使用不可時
    this.panelEl.classList.add('inactive'); //クラス追加
    this.game.numCheck(e); //　数字チェック
  }
}

// ボード
class Board {
  constructor(game) {
    this.game = game; //ゲーム
    this.panelNums = 100; //パネルの数
  }

  // ボード作成
  createBoard() {
    for (let i = 1; i <= this.panelNums; i++) {
      let panel = new Panel(i, this.game); //パネル作成
      this.game.boardEl.appendChild(panel.panelEl); //パネルをボードの子要素にする
    }
  }

  //panelのinactiveクラスを全部加算
  addInactiveClass() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      panel.classList.add('inactive');
    });
  }
  //panelのinactiveクラスを全部削除
  removeInactiveClass() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      panel.classList.remove('inactive');
    });
  }
}

// ゲーム
class Game {
  constructor() {
    this.rule = new Rule(); // ルール
    this.board = new Board(this); // ボード
    this.boardEl = document.getElementById('board'); //ボード表示

    this.counterEl = document.getElementById('counter'); //　カウント表示
    this.messageEl = document.getElementById('message'); //　メッセージ表示
    this.highScoreEl = document.getElementById('highscore'); //ハイスコア表示

    this.maxCount = 10; //最大回数
    this.remainCount = 'undefind'; //残り回数
    this.progressBarFull = document.getElementById('progress-bar-full'); //プログレスバ
    this.highScore = 0; //ハイスコア
    this.boardLock = 'undefind'; //trueの時は押せない
    this.correct = 'undefind'; //正解

    this.startBtn = document.getElementById('start'); //スタートボタン
    this.resetBtn = document.getElementById('reset'); //リセットボタン

    //スタートボタン アロー関数でthisをparentへ
    this.startBtn.addEventListener('click', () => {
      if (this.startBtn.classList.contains('inactive')) return;
      this.gameStart();
    });

    //リセットボタン
    this.resetBtn.addEventListener('click', () => {
      if (this.resetBtn.classList.contains('inactive')) return;
      this.initGame(); //ゲーム初期化
    });

    this.initGame(); //ゲーム初期化
  }

  //初期化
  initGame() {
    this.correct = Math.floor(Math.random() * this.board.panelNums) + 1; //正解作成
    // console.log(this.correct); // 正解
    this.remainCount = 10; // 残り回数
    this.initDisplay(); //表示初期化
    this.boardLock = false; //ボードロック

    //再初期化した際に前のパネルが残らないようにする
    while (this.boardEl.firstChild) {
      this.boardEl.firstChild.remove();
    }
    this.board.createBoard(); // ボード作成
  }

  //表示初期化
  initDisplay() {
    this.messageEl.textContent = '数字当てゲーム'; //メッセージ
    this.messageEl.classList.remove('slide-in'); //メッセージクラス解除
    this.counterEl.textContent = `残り　${this.remainCount}/${this.maxCount}回`; //残り回数表示
    //プログレスバー
    this.progressBarFull.style.width = `${
      (this.remainCount / this.maxCount) * 100
    }%`;
    this.startBtn.classList.remove('inactive'); //スタートボタン使用不可
    this.resetBtn.classList.add('inactive'); //リセットボタン使用不可
  }

  // ゲーム開始
  gameStart() {
    if (this.startBtn.classList.contains('inactive')) return; //スタートボタン使用不可時
    this.boardLock = false; //ボードロック解除
    this.board.removeInactiveClass(); //パネルのinactiveクラス削除
    this.startBtn.classList.add('inactive'); //スタートボタン使用不可
    this.resetBtn.classList.remove('inactive'); //リセットボタン使用可
  }

  // 数字チェック
  numCheck(e) {
    this.boardLock = true; //ボードロック
    const pushNum = Number(e.target.textContent); // 押した数字
    this.remainCount--; //残り回数を減少
    this.counterEl.textContent = `残り　${this.remainCount}/${this.maxCount}回`; //カウント表示
    //プログレスバー
    this.progressBarFull.style.width = `${
      (this.remainCount / this.maxCount) * 100
    }%`;
    // 正解
    if (this.correct === pushNum) {
      e.target.textContent = '正解';
      this.messageEl.textContent = '正 解 !!'; // メッセージ
      this.messageEl.classList.add('slide-in'); //クラス追加
      e.target.classList.add('correct'); //クラス追加
      this.board.addInactiveClass(); //panelのinactiveクラスを全部加算
      this.highScoreCheck(); //　ハイスコアチェック

      //不正解
    } else {
      e.target.classList.add('incorrect', 'inactive'); //クラス追加
      if (pushNum < this.correct) {
        e.target.textContent = `小`;
        this.messageEl.textContent = '小さすぎ!'; // メッセージ
      } else if (pushNum > this.correct) {
        e.target.textContent = '大';
        this.messageEl.textContent = '大きすぎ!'; // メッセージ
      }

      this.gameOverCheck(); //ゲームオーバーチェック
    }
  }

  // ハイスコアチェック
  highScoreCheck() {
    if (this.remainCount > this.highScore) {
      this.highScore = this.remainCount;
      this.highScoreEl.textContent = `Highscore: ${this.highScore}`;
    }
  }

  // ゲームオーバーチェック
  gameOverCheck() {
    //ゲームオーバー
    if (this.remainCount < 1) {
      this.messageEl.textContent = 'Game Over!'; // メッセージ
      this.board.addInactiveClass(); //panelのinactiveクラスを全部加算
      //続行
    } else {
      this.boardLock = false; //ボードロック解除
    }
  }
}

new Game();
