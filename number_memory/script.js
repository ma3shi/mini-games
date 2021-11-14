"use strict";

// ルール
class Rule {
  constructor() {
    this.ruleContent = document.getElementById("rule"); //ルール内容
    const ruleBtn = document.getElementById("show-rule"); //ルールボタン
    this.overlayBlur = document.getElementById("overlay-blur"); //ぼかし
    const closeRuleBtn = document.getElementById("close-rule"); //ルールを閉じるボタン
    // アローでthisをparentへ
    ruleBtn.addEventListener("click", () => this.openRule()); //ルールを開く
    closeRuleBtn.addEventListener("click", () => this.closeRule()); //ルールを閉じる
    this.overlayBlur.addEventListener("click", () => this.closeoverlayBlur()); //ぼかしを消す
  }

  //ルールを開く
  openRule() {
    this.ruleContent.classList.add("show");
    this.overlayBlur.classList.remove("hidden");
  }

  //ルールを閉じる
  closeRule() {
    this.ruleContent.classList.remove("show");
    this.overlayBlur.classList.add("hidden");
  }

  //ぼかしを消す
  closeoverlayBlur() {
    this.ruleContent.classList.remove("show");
    this.overlayBlur.classList.add("hidden");
  }
}

//カード
class Card {
  constructor(game) {
    this.game = game; //ゲーム
    this.cardWrapper = document.getElementById("card-wrapper"); //カード全体
    this.nums = []; //数値配列
    this.cards = []; //カード配列
  }

  //数値配列と正解作成
  makeNums() {
    for (let i = 1; i <= this.game.choices; i++) {
      this.nums.push(i);
    }
    this.game.randomNum = Math.floor(Math.random() * this.game.choices) + 1; //正解
    // console.log(this.game.randomNum); //正解
  }

  //カード作成
  makeCards() {
    for (let i = 1; i <= this.game.choices; i++) {
      //表面
      const cardFront = document.createElement("div"); //div要素作成
      cardFront.classList.add("card-front"); //class追加
      cardFront.textContent = this.nums.splice(
        Math.floor(Math.random() * this.nums.length),
        1
      )[0]; //数字をランダムに切り出す
      // console.log(cardFront.textContent); //カードの数字

      //裏面
      const cardBack = document.createElement("div"); //div要素作成
      cardBack.classList.add("card-back"); //class追加
      cardBack.textContent = "?"; //?を表示
      //カード
      const card = document.createElement("div"); //div要素作成
      card.setAttribute("id", i); //id属性追加
      card.classList.add("card"); //class追加
      card.appendChild(cardFront); //表面を子要素に
      card.appendChild(cardBack); //裏面を子要素に
      this.cards.push(card); //配列に追加
      this.cardWrapper.appendChild(card); //画面に表示
    }
  }

  // カード初期化
  initCards() {
    this.makeNums(); //数値配列作成
    this.makeCards(); //カード作成
  }
}

//　ゲーム
class Game {
  constructor() {
    const rule = new Rule(); //ルール
    this.card = new Card(this); //カード
    this.spinBtn = document.getElementById("spin-btn"); //spinボタン
    this.quensionBtn = document.getElementById("question-btn"); //questionボタン
    this.nextBtn = document.getElementById("next-btn"); //nextボタン
    this.retryBtn = document.getElementById("retry-btn"); //retrytボタン
    this.message = document.getElementById("message"); //メッセージ

    this.rollSound = document.getElementById("roll-sound"); //ロール音
    this.questionSound = document.getElementById("question-sound"); //出題音
    this.correctSound = document.getElementById("correct-sound"); //正解音
    this.allCorrectSound = document.getElementById("allcorrect-sound"); //全問正解音
    this.unCorrectSound = document.getElementById("uncorrect-sound"); //不正解音

    this.stageEl = document.getElementById("stage"); //ステージ表示
    this.stage = "undefind"; //ステージ
    this.maxStage = 5; //最大ステージ
    this.progressBarFull = document.getElementById("progress-bar-full"); //プログレスバー
    this.cardCount = "undefind"; //カード枚数　３から
    this.maxCardCount = 8; //最高枚数
    this.choices = "undefind"; //選択数
    this.randomNum = "undefind"; //正解
    this.spinCount = "undefind"; //カード回転数

    //spinボタン
    this.spinBtn.addEventListener("click", () => {
      if (this.spinBtn.classList.contains("disabled")) return; //spinボタンが既に押してある
      this.spinBtn.classList.add("disabled"); //spinボタンを押せなくする
      this.rollSound.play(); //ロール音
      this.spinCard(); //カード回転
    });

    //questionボタン
    this.quensionBtn.addEventListener("click", () => {
      if (this.quensionBtn.classList.contains("disabled")) return; //questionボタンが既に押してある
      this.quensionBtn.classList.add("disabled"); //questionボタンを押せなくする
      this.question(); //出題
    });

    //nextボタン
    this.nextBtn.addEventListener("click", () => {
      this.nextBtn.classList.add("disabled"); //nextボタンを押せなくする
      this.stage++;
      this.resetContent(); //リセット
    });

    //retryボタン
    this.retryBtn.addEventListener("click", () => {
      this.retryBtn.classList.add("disabled"); //retryボタンを押せなくする
      this.initGame(); //ゲーム初期化
    });
    this.initGame(); //ゲーム初期化
  }

  //カード回転
  spinCard() {
    if (this.choices > 0) {
      setTimeout(() => {
        this.card.cards[this.spinCount].classList.add("spin"); //spinクラスを追加
        this.spinCount++; //カード回転数
        this.spinCard(); //カード回転
      }, 500);
      this.choices--; //choicesを減らしているので注意!!
    } else {
      this.quensionBtn.classList.remove("disabled"); //questionボタンを押せるようにする
    }
  }

  //出題
  question() {
    this.rollSound.pause(); //ロール音ストップ
    this.questionSound.play(); //出題音
    this.card.cardWrapper.classList.remove("inactive"); //カードをめくれるようにする
    const cards = Array.from(this.card.cardWrapper.children); //HTMLCollectionを配列に変換
    cards.forEach((card) => card.classList.add("cursor-change")); //カーソルをpointerへ
    this.message.textContent = `${this.randomNum} は？`; //出題表示
    this.selectAnswer(); //解答選択
  }

  ///解答選択
  selectAnswer() {
    this.card.cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (this.card.cardWrapper.classList.contains("inactive")) return; //カードが既にめくれない状態
        this.card.cardWrapper.classList.add("inactive"); //カード全体がめくれない状態にする

        card.classList.add("turnover"); //カードをめくる
        this.checkAnswer(card); //解答チェック
      });
    });
  }

  //解答チェック
  checkAnswer(selectCard) {
    //正解
    if (Number(selectCard.children[0].textContent) === this.randomNum) {
      this.cardCount++; //カード枚数＋
      //全問正解
      if (this.cardCount === this.maxCardCount) {
        this.allCorrectSound.play(); //全問正解音
        this.message.textContent = "Game Clear !"; //メッセージ表示
        this.retryBtn.classList.remove("disabled"); //もう一度ボタン使用可
        //全問正解以外
      } else {
        this.correctSound.play(); //正解音
        this.message.textContent = "正解 !"; //メッセージ表示
        this.nextBtn.classList.remove("disabled"); //次のレベルへボタン使用可
      }
      //不正解
    } else {
      this.unCorrectSound.play(); //正解音
      this.message.textContent = "Game over"; //メッセージ表示
      this.retryBtn.classList.remove("disabled"); //もう一度ボタン使用可
    }
  }

  //リセット
  resetContent() {
    this.spinBtn.classList.remove("disabled"); //spinボタン使用可
    this.stageEl.textContent = `Stage ${this.stage}/${this.maxStage}`; //ステージ表示
    //プログレスバー
    this.progressBarFull.style.width = `${(this.stage / this.maxStage) * 100}%`;
    this.message.textContent = ""; //メッセージ表示
    //カード表示で以前の子要素が存在する場合は削除
    while (this.card.cardWrapper.firstChild) {
      this.card.cardWrapper.removeChild(this.card.cardWrapper.firstChild);
    }
    this.card.cards = []; //card配列を空にする
    // nextBtnとresetBtn両方で使用しているのでこの位置でcardCount++やcardCount = 3としない
    this.choices = this.cardCount; //choicesは0になっているので注意 !!
    this.spinCount = 0; //回転数
    this.card.initCards(); // カード初期化
  }

  //ゲーム初期化
  initGame() {
    this.stage = 1;
    this.cardCount = 3; //初期枚数
    this.resetContent(); //リセット
  }
}

new Game();
