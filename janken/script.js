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

//じゃんけん
class Janken {
  constructor(game) {
    this.game = game; //ゲーム
    this.comImage = document.querySelector('#com-wrapper img'); //com画像
    this.playerImage = document.querySelector('#player-wrapper img'); //player画像
    this.choices = document.querySelectorAll('.choice'); //グー・パー・チョキボタン
    this.comChoice = 'undefind'; //comの選択
    this.playerChoice = 'undefind'; //playerの選択
    this.winner = ['com', 'player']; //勝者

    //グー・パー・チョキどれかを選択
    this.choices.forEach(choice =>
      choice.addEventListener('click', e => {
        if (choice.classList.contains('inactive')) return; //inactiveクラスならreturn
        this.jankenStart(e, choice); //じゃんけんスタート
      })
    );
  }

  //じゃんけんスタート
  jankenStart(e, choice) {
    this.addInactive(); //じゃんけんbtn全部にinactiveクラスをつける
    this.game.displayMessage.textContent = 'ジャンケン'; //メッセージ
    this.game.toStartImage(); //手振り時の表示へ
    this.comImage.classList.add('moveComHand'); //com手を振る
    this.playerImage.classList.add('movePlayerHand'); //player手を振る
    setTimeout(() => {
      this.comImage.classList.remove('moveComHand'); //com手を振る解除
      this.playerImage.classList.remove('movePlayerHand'); //player手を振る解除
      this.generateComChoice(); //comの選択(数字・画像)
      this.playerChoice = Number(e.target.id); //playerの選択
      this.playerImage.src = this.game.pattern[e.target.id].image; //player画像
      this.judge(); //勝敗
    }, 1000); // 手を振る時間 1s
    this.game.voiceMessage.text = 'ジャンケン'; //音声内容
    this.game.speakText(); //音声発生
  }

  //comの選択
  generateComChoice() {
    this.comChoice = Math.floor(Math.random() * 3);
    if (this.comChoice === 0) {
      this.comImage.src = this.game.pattern[0].image; //グー画像
    } else if (this.comChoice === 1) {
      this.comImage.src = this.game.pattern[1].image; //パー画像
    } else if (this.comChoice === 2) {
      this.comImage.src = this.game.pattern[2].image; //チョキ画像
    }
  }

  //じゃんけんの結果 グー:0、パー:1、チョキ2
  judge() {
    const resultText = ['あなたの勝ち', '対戦相手の勝ち']; //結果表示
    if (this.comChoice === this.playerChoice) {
      const drawMessage = 'あいこ。もう一度';
      this.game.displayMessage.textContent = drawMessage; //結果表示
      this.game.voiceMessage.text = drawMessage; //音声内容
      this.game.speakText(); //音声発生
      this.removeInactive(); //btn全部inactiveクラスを解除
      //com:グー player:パー
    } else if (this.comChoice === 0 && this.playerChoice === 1) {
      this.game.results(1, resultText[0], this.winner[1]);
      //com:グー player:チョキ
    } else if (this.comChoice === 0 && this.playerChoice === 2) {
      this.game.results(0, resultText[1], this.winner[0]);
      //com:パー player:グー
    } else if (this.comChoice === 1 && this.playerChoice === 0) {
      this.game.results(1, resultText[1], this.winner[0]);
      //com:パー player:チョキ
    } else if (this.comChoice === 1 && this.playerChoice === 2) {
      this.game.results(2, resultText[0], this.winner[1]);
      //com:チョキ player:グー
    } else if (this.comChoice === 2 && this.playerChoice === 0) {
      this.game.results(0, resultText[0], this.winner[1]);
      //com:チョキ player:パー
    } else if (this.comChoice === 2 && this.playerChoice === 1) {
      this.game.results(2, resultText[1], this.winner[0]);
    }
  }

  //じゃんけんbtn全部にinactiveクラスをつける
  addInactive() {
    this.choices.forEach(choice => {
      choice.classList.add('inactive');
    });
  }

  //じゃんけんbtn全部inactiveクラスを解除
  removeInactive() {
    this.choices.forEach(choice => {
      choice.classList.remove('inactive');
    });
  }
}

//ゲーム
class Game {
  constructor() {
    this.rule = new Rule(); //ルール
    this.janken = new Janken(this); //じゃんけん
    this.displayComScore = document.getElementById('com-score'); //comの点数
    this.displayPlayerScore = document.getElementById('player-score'); //playerの点数
    this.displayMessage = document.getElementById('message'); //メッセージ表示
    this.displayKeyword = document.getElementById('keyword'); //keyword表示
    this.displayKeywordImage = document.querySelector('#keyword-wrapper img'); //keyword画像
    this.resetBtn = document.getElementById('reset'); //resetボタン

    //配列　グー:0、パー:1、チョキ2
    this.pattern = [
      {
        keyword: 'グリコ',
        image: 'img/janken_gu.png',
        keywordImage: 'img/gulico.png',
      },
      {
        keyword: 'パイナップル',
        image: 'img/janken_pa.png',
        keywordImage: 'img/pineapple.png',
      },
      {
        keyword: 'チョコレート',
        image: 'img/janken_choki.png',
        keywordImage: 'img/chocolate.png',
      },
    ];

    this.comScore = 'undefind'; //com点数
    this.playerScore = 'undefind'; //player点数
    this.keywordCount = 'undefind'; //keyword何番目か
    this.timeoutId = 'undefind';

    this.voiceMessage = new SpeechSynthesisUtterance(); //発話リクエスト
    this.voice = 'undefined'; //音声

    this.resetBtn.addEventListener('click', () => this.initGame()); //リセットボタン

    // getVoices()はvoiceschangedイベントを待った後でないとロードができない
    speechSynthesis.addEventListener('voiceschanged', () => this.getVoice);

    this.initGame(); //初期化
  }

  // 音声取得
  getVoice() {
    this.voice = speechSynthesis.getVoices()[10]; //10：日本語
    this.voiceMessage.voice = this.voice;
  }

  //音声発生
  speakText() {
    speechSynthesis.speak(this.voiceMessage);
  }

  //開始時の表示へ
  toStartImage() {
    this.janken.comImage.src = this.pattern[0].image; //comの画像をグーに戻す
    this.janken.playerImage.src = this.pattern[0].image; //playerの画像をグーに戻す
    this.displayKeyword.textContent = ''; //keyword表示を空に
    this.displayKeywordImage.src = 'img/question.png'; //keyword画像を?に
  }

  //keywordと結果表示(勝側の選択num,勝敗表示,どちらが勝ったか)
  results(num, resultText, winner) {
    this.displayMessage.textContent = resultText; //結果表示
    this.voiceMessage.text = resultText; //音声内容
    this.speakText(); //音声発生
    this.keywordCount = 1; //表示するkeywordの順番を最初に戻す
    this.displayKeywordImage.src = this.pattern[num].keywordImage; //keyword画像
    this.timeoutId = setInterval(() => {
      this.typeKeyword(this.pattern[num].keyword, winner); //keywordを1文字ずつ表示
    }, 500);
  }

  // keywordを1文字ずつ表示;
  typeKeyword(keyword, winner) {
    if (this.keywordCount < keyword.length + 1) {
      this.subtractScore(winner); //スコア減算
      this.displayKeyword.textContent = keyword.substring(0, this.keywordCount); //keywordCount分keywordを表示
      this.displayKeywordImage.classList.add('moveKeyword'); //keyword画像を動かす
      setTimeout(() => {
        this.displayKeywordImage.classList.remove('moveKeyword'); //keyword画像を止める
        this.keywordCount++; //keywordを次の文字へ
      }, 400); //movekeywordクラスが　0.4s
    } else {
      clearTimeout(this.timeoutId);
      if (this.comScore <= 0 || this.playerScore <= 0) return; //ゲーム終了時return
      this.displayMessage.textContent = 'ボタンを押してね'; //メッセージ
      this.toStartImage(); //開始時の表示へ
      this.janken.removeInactive(); //btn全部inactiveクラスを解除
    }
  }

  //スコア減算
  subtractScore(winner) {
    if (winner === 'com') {
      if (this.comScore <= 0) return;
      this.comScore--;
      this.displayComScore.textContent = `あと${this.comScore}段`;
    } else if (winner === 'player') {
      if (this.playerScore <= 0) return;
      this.playerScore--;
      this.displayPlayerScore.textContent = `あと${this.playerScore}段`;
    }
    this.checkScore(); //点数確認
  }

  //点数確認
  checkScore() {
    const gameResult = ['対戦相手が ゴールイン', 'あなたが ゴールイン'];
    if (this.comScore <= 0) {
      this.displayMessage.textContent = gameResult[0]; //画面表示
      this.voiceMessage.text = gameResult[0]; //音声内容
      this.speakText(); //音声発生
    } else if (this.playerScore <= 0) {
      this.displayMessage.textContent = gameResult[1];
      this.voiceMessage.text = gameResult[1]; //音声内容
      this.speakText(); //音声発生
    }
  }

  //初期化
  initGame() {
    this.displayMessage.textContent = 'ボタンを押してね'; //メッセージ
    this.comScore = 25; //com点数
    this.playerScore = 25; //player点数
    this.toStartImage(); //開始時の表示へ
    this.displayComScore.textContent = `あと${this.comScore}段`; //com
    this.displayPlayerScore.textContent = `あと${this.playerScore}段`; //player
    this.janken.removeInactive(); //じゃんけんボタンinactiveクラスを解除
    clearTimeout(this.timeoutId); //typeKeyword関数の実行中にリセットがあった場合
  }
}

new Game();
