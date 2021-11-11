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

//カード
class Card {
  constructor(game) {
    this.game = game; //ゲーム
    this.cardWrapper = document.getElementById('card-wrapper'); //カード全体
    this.cards = []; //カードの配列
  }
  //カード作成
  createCard(num) {
    //表面
    const cardFront = document.createElement('img'); //imgタグ作成
    cardFront.classList.add('card-front'); //クラス追加
    cardFront.setAttribute('data-id', num); //データ属性追加
    cardFront.src = `img/img_${num}.png`; //画像
    //裏面
    const cardBack = document.createElement('div'); //divタグ作成
    cardBack.classList.add('card-back'); //クラス追加
    cardBack.textContent = '?'; //?表示
    //カード
    const card = document.createElement('div'); //divタグ作成
    card.classList.add('card'); //クラス追加
    card.appendChild(cardFront); //表面を子要素へ
    card.appendChild(cardBack); //裏面を子要素へ
    //カードクリックイベント
    card.addEventListener('click', () => {
      this.game.cardClick(card);
    });

    return card;
  }

  //カード初期化
  initCard() {
    //再初期化した際に前のカードが残らないようにする
    while (this.cardWrapper.firstChild) {
      this.cardWrapper.removeChild(this.cardWrapper.firstChild);
    }
    const nums = [2, 2, 3, 3, 3, 4, 4, 4, 4]; //数字一式

    //カード一式作成
    nums.forEach(num => {
      this.cards.push(this.createCard(num));
    });

    //カードをランダムに配置
    //cardsはspliceで削除されていくのでi<cards.lengthはダメ
    for (let i = 0; i < nums.length; i++) {
      let card = this.cards.splice(
        Math.floor(Math.random() * this.cards.length),
        1
      )[0];
      console.log(card.children[0]); //番号表示
      this.cardWrapper.appendChild(card); //子要素として表示
    }
  }
}

//ゲーム
class Game {
  constructor() {
    const rule = new Rule(); //ルール
    this.card = new Card(this); //カード
    this.title = document.getElementById('title'); // タイトル
    this.remainCountEl = document.getElementById('remain-count'); //残りカウント
    this.retry = document.getElementById('retry'); //もう一度
    this.correctSound = document.getElementById('correct'); //正解音
    this.allCorrectSound = document.getElementById('allcorrect'); //全問正解音
    this.unCorrectSound = document.getElementById('uncorrect'); //不正解音
    this.maxNum = 3; //カードの種類 = 正解数

    this.flipCount = 'undefind'; //めくった枚数
    this.firstCard = 'undefind'; //1枚目
    this.secondCard = 'undefind'; //2枚目
    this.thirdCard = 'undefind'; //3枚目
    this.fourthCard = 'undefind'; //4枚目
    this.correctCount = 'undefind'; //正解数
    this.moves = 'undefind'; //めくった合計回数
    this.remainCount = 'undefind'; //残り回数
    this.lockCard = false; //trueの時はカードがめくれない
    //もう一度ボタン thisをparentへ
    this.retry.addEventListener('click', () => {
      this.retryGame();
    });
    this.initGame(); //ゲーム初期化
  }
  //カードクリック
  cardClick(clickCard) {
    if (clickCard.classList.contains('open')) return; //既にめくられている
    if (clickCard.classList.contains('inactive')) return; //ゲームオーバー
    if (this.lockCard) return;
    this.lockCard = true; //他のカードがめくれないようにする
    this.moves++; //めくった合計回数
    clickCard.classList.add('open'); //openクラス
    this.flipCount++; //めくった枚数

    //setTimeoutにしないと間違っていた場合,めくる前にopenクラスが解除されてしまう
    setTimeout(() => {
      this.cardCheck(clickCard); //カードチェック
    }, 400); //cardのtransition: 0.8s;
  }

  //カードチェック
  cardCheck(clickCard) {
    //1枚目
    if (this.flipCount === 1) {
      this.firstCard = clickCard; //カード代入
      //2枚目
    } else if (this.flipCount === 2) {
      this.secondCard = clickCard; //カード代入
      this.firstCheck(); //1.2枚目のチェック
      //3枚目
    } else if (this.flipCount === 3) {
      this.thirdCard = clickCard; //カード代入
      this.secondCheck(); //2.3枚目のチェック
      //4枚目
    } else {
      this.fourthCard = clickCard; //カード代入
      this.thirdCheck(); //3.4枚目のチェック
    }
    this.lockCard = false; //他のカードをまためくれるようにする
  }

  //1.2枚目のチェック
  firstCheck() {
    if (
      this.firstCard.children[0].getAttribute('data-id') !== //1枚目と2枚目が不一致
      this.secondCard.children[0].getAttribute('data-id')
    ) {
      this.remainCountCheck(); //残り回数チェック
      this.reverseCard(); //めくったカードを戻す
      //数字が一致していてその数字が2ならこの時点で正解と判明
    } else if (
      Number(this.secondCard.children[0].getAttribute('data-id')) === 2
    ) {
      this.correctCount++; //正解数
      //全問正解
      if (this.correctCount === this.maxNum) {
        this.allCorrect(); //全問正解時の処理
        //全問正解以外
      } else {
        this.correctSound.play(); //正解音
        this.filpReset(); //めくったカードリセット
      }
    }
  }

  //2.3枚目のチェック
  secondCheck() {
    if (
      this.secondCard.children[0].getAttribute('data-id') !== //2枚目と3枚目が不一致
      this.thirdCard.children[0].getAttribute('data-id')
    ) {
      this.remainCountCheck(); //残り回数チェック
      this.reverseCard(); //めくったカードを戻す
      //1.2枚目が一致している可能性は3.4の両方なので
      //3枚目が3という条件だけだと443でも正解になってしまう
    } else if (
      Number(this.secondCard.children[0].getAttribute('data-id')) === 3 &&
      Number(this.thirdCard.children[0].getAttribute('data-id')) === 3
    ) {
      this.correctCount++; //正解数加算
      //全問正解
      if (this.correctCount === this.maxNum) {
        this.allCorrect(); //全問正解時の処理
        //全問正解以外
      } else {
        this.correctSound.play(); //正解音
        this.filpReset(); //めくったカードリセット
      }
    }
  }

  //3.4枚目のチェック
  thirdCheck() {
    if (
      this.thirdCard.children[0].getAttribute('data-id') !== //３枚目と４枚目が不一致
      this.fourthCard.children[0].getAttribute('data-id')
    ) {
      this.remainCountCheck(); //残り回数チェック
      this.reverseCard(); //めくったカードを戻す
    } else if (
      Number(this.fourthCard.children[0].getAttribute('data-id')) === 4
    ) {
      this.correctCount++; //正解数加算
      //全問正解
      if (this.correctCount === this.maxNum) {
        this.allCorrect(); //全問正解時の処理
        //全問正解以外
      } else {
        this.correctSound.play(); //正解音
        this.filpReset(); //めくったカードリセット
      }
    }
  }

  //めくったカードを戻す
  reverseCard() {
    this.firstCard.classList.remove('open'); //1枚目からopenクラスを外す
    this.secondCard.classList.remove('open'); //2枚目からopenクラスを外す
    if (this.thirdCard) this.thirdCard.classList.remove('open'); //3枚目からopenクラスを外す
    if (this.fourthCard) this.fourthCard.classList.remove('open'); //4枚目からopenクラスを外す

    this.filpReset(); //めくったカードリセット
    this.unCorrectSound.play(); //不正解音
  }

  //めくったカードをリセット
  filpReset() {
    this.firstCard = null; //1枚目
    this.secondCard = null; //2枚目
    if (this.thirdCard) this.thirdCard = null; //3枚目
    if (this.fourthCard) this.fourthCard = null; //4枚目
    this.flipCount = 0; //めくった枚数
  }

  //残り回数チェック
  remainCountCheck() {
    this.remainCount--; //残り回数を減らす
    if (this.remainCount === 0) {
      this.remainCountEl.textContent = 'G A M E O V E R !!'; //ゲームオーバー表示
      const cards = Array.from(this.card.cardWrapper.children); //カードを配列へ
      //inactiveクラス追加
      cards.forEach(card => {
        card.classList.add('inactive');
      });
      this.retry.classList.remove('inactive'); //retryボタンを使用可へ
    } else {
      this.remainCountEl.textContent = `残り ${this.remainCount}回`; //残り回数表示
    }
  }

  //全問正解時の処理
  allCorrect() {
    this.allCorrectSound.play(); //全問正解音
    this.title.textContent = `Clear! めくった回数:${this.moves}`; //めくった合計回数表示
    this.retry.classList.remove('inactive'); //retryボタンを使用可へ
  }

  //ゲームリトライ
  retryGame() {
    if (this.retry.classList.contains('inactive')) return;
    this.initGame(); //ゲーム初期化
  }

  //ゲーム初期化
  initGame() {
    this.correctCount = 0; //正解数
    this.moves = 0; //めくった合計回数
    this.remainCount = 5; //残り回数初期化
    this.title.textContent = '2・3・4枚めくり'; //タイトルを元に戻す
    this.remainCountEl.textContent = `残り ${this.remainCount}回`; //残り回数を元に戻す
    this.retry.classList.add('inactive'); //retryボタンのクラス
    this.filpReset(); //めくったカードリセット
    this.card.initCard(); //カード初期化
  }
}

new Game();
