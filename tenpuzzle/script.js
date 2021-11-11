'use strict';

//undefindとnullの違い
//他クラスのプロパティに直はok?
//10かどうかの確認での成功時の表示をまとめる
//引数の説明方法

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

//数字
class Numbers {
  constructor(game) {
    this.game = game; //ゲーム
    this.numbersEl = document.getElementById('numbers'); //4つの数字欄
    this.firstNum = 'undefind'; //1番目に選んだ数字
    this.secondNum = 'undefind'; //2番目に選んだ数字
    this.leftCount = 'undefind'; //残り枚数
  }

  //4つの数字をセット
  setNumbers() {
    const question = this.game.questions[this.game.currentQsNum]; //現在の問題
    this.firstNum = null; //1番目に選んだ数字を空に
    this.secondNum = null; //2番目に選んだ数字を空に
    this.leftCount = 4; //残り枚数を4に

    //4つの数字欄の子要素が残っていたら削除
    while (this.numbersEl.firstChild) {
      this.numbersEl.firstChild.remove();
    }

    // 4枚の数字を1枚ずつli要素へ
    question.forEach(num => {
      const numEl = document.createElement('li'); //li要素作成
      numEl.textContent = num; //numを表示準備
      numEl.classList.add('number'); //class追加
      //クリックイベント
      numEl.addEventListener('click', () => {
        this.clickNum(numEl);
      });
      this.numbersEl.appendChild(numEl); //4つの数字欄の子要素に追加
    });
  }

  //数字をクリック
  clickNum(clickEl) {
    //使用不可か1番目に選んだ数字ならreturn
    //containで複数を選ぶとどちらも含んだという条件になるのでダメ
    if (
      clickEl.classList.contains('disabled') ||
      clickEl.classList.contains('firstselect')
    ) {
      return;
      //1番目の数字がnullまたは計算記号が未選択の場合は1番目の数字
      //既に1番目の数字が選択されていて計算記号が未選択の場合,1番目の数字を変更
    } else if (
      this.firstNum === null ||
      this.game.calcSymbols.culcSym === null
    ) {
      this.firstNum = clickEl.textContent; //clickElのtextcontentを1番目に選んだ数字として代入
      console.log(`firstNum: ${this.firstNum}`);

      this.removeFirstSelectClass(); //firstselectクラスを一旦全部削除
      clickEl.classList.add('firstselect'); //clickElにfirstselectクラス追加
      //2番目の数字決定
    } else {
      this.secondNum = clickEl.textContent; //clickElのtextcontentを2番目に選んだ数字として代入
      console.log(`secondNum: ${this.secondNum}`);
      this.game.numsCalc(clickEl); //2つの数字を計算
    }
  }

  //firstselectクラスを一旦全部削除
  removeFirstSelectClass() {
    const lists = document.querySelectorAll('.number');
    lists.forEach(list => {
      if (list.classList.contains('firstselect')) {
        list.classList.remove('firstselect');
      }
    });
  }

  //2番目に選んだ数字を1番目に選んだ数字に変更
  secondToFirst(secondEl) {
    let firstEl = document.querySelector('.firstselect'); //1番目に選んだliを取得
    firstEl.textContent = null; //1番目に選んだliから数値を消す
    firstEl.classList.add('disabled'); //1番目に選んだliにdisabledクラスをつける
    firstEl.classList.remove('firstselect'); //1番目に選んだliからfirstselectクラスを削除
    secondEl.classList.add('firstselect'); //2番目に選んだliにfirstselectクラスを追加
    this.firstNum = this.secondNum; //２枚目の数値を1枚目の数値に代入
    this.secondNum = null; //２枚目の数値をnullに
  }

  //計算結果を表示
  numsResultProcess(secondEl, calcResultNum) {
    this.secondNum = calcResultNum; //計算結果を２枚目の数値に代入
    secondEl.textContent = this.secondNum; //計算結果を2番目に選んだliに表示
    this.secondToFirst(secondEl); //2番目に選んだ数字を1番目に選んだ数字に変更
    this.leftCount--; //numberの残りcountを1減らす
    console.log(`leftCount: ${this.leftCount}`);
  }
}

//計算記号
class CalcSymbols {
  constructor(game) {
    this.game = game; //いらない？
    this.calcSymsEl = document.getElementById('symbols'); //4つの記号欄
    this.calcSyms = ['+', '-', '&times;', '&divide;']; //計算記号一覧
    // this.calcSyms = ['+', '-', '*', '/']; //計算記号一覧
    this.culcSym = 'undefind'; //計算記号
  }
  //計算記号をセット
  setCalcSyms() {
    this.culcSym = null; //計算記号を空に
    // 4枚の計算記号を1枚ずつli要素へ
    this.calcSyms.forEach(sym => {
      const calcSymEl = document.createElement('li'); //li要素作成
      calcSymEl.innerHTML = sym; //symを表示準備
      calcSymEl.classList.add('symbol'); //class追加
      //クリックイベント
      calcSymEl.addEventListener('click', () => {
        this.clickCalcSym(calcSymEl);
      });
      this.calcSymsEl.appendChild(calcSymEl); //4つの記号欄の子要素に追加
    });
  }

  //計算記号をクリック
  clickCalcSym(clickEl) {
    //特殊文字で表示されている計算記号を元に戻す
    if (clickEl.textContent === '×') {
      this.culcSym = '*';
      //特殊文字で表示されている計算記号を元に戻す
    } else if (clickEl.textContent === '÷') {
      this.culcSym = '/';
    } else {
      this.culcSym = clickEl.textContent; //計算記号を代入
    }
    this.removeActiveSym(); //計算記号からactiveクラスを一旦全部削除
    clickEl.classList.add('active'); //clickElにactiveクラス追加
    console.log(`culcSym: ${this.culcSym}`);
  }

  //計算記号からactiveクラスを一旦全部削除
  removeActiveSym() {
    const lists = document.querySelectorAll('.symbol');
    lists.forEach(list => {
      if (list.classList.contains('active')) {
        list.classList.remove('active');
      }
    });
  }

  //計算記号をリセット
  resetCalcSyms() {
    this.culcSym = null; //計算記号をnull
    this.removeActiveSym(); //計算記号からactiveクラスをremove
  }
}

// ゲーム
class Game {
  constructor() {
    const rule = new Rule(); //ルール
    this.numbers = new Numbers(this); //数字
    this.calcSymbols = new CalcSymbols(this); //計算記号
    this.stageEl = document.getElementById('stage'); //ステージ
    this.progressBarFull = document.getElementById('progress-bar-full'); //プログレスバー
    this.messageEl = document.getElementById('message'); //メッセージ
    this.nextBtn = document.getElementById('next'); //nextボタン
    this.retryBtn = document.getElementById('retry'); //retryボタン
    this.allResetBtn = document.getElementById('allreset'); //all resetボタン
    this.correctSound = document.getElementById('correct'); //正解音
    this.allcorrectSound = document.getElementById('allcorrect'); //全問正解音
    this.unCorrectSound = document.getElementById('uncorrect'); //不正解音
    this.currentQsNum = 'undefind'; //現在の問題番号
    //確認用問題
    // this.questions = [
    //   [1, 2, 3, 4],
    //   [2, 3, 4, 1],
    //   [3, 4, 1, 2],
    // ];
    // 問題一覧
    // 1158,1199,1337,3478は分数を使う
    this.questions = [
      [1, 2, 3, 4],
      [1, 1, 1, 6],
      [1, 1, 4, 9],
      [1, 5, 5, 5],
      [1, 5, 6, 6],
      [7, 8, 9, 9],
      [2, 4, 7, 7],
      [2, 3, 3, 4],
      [1, 5, 6, 7],
      [2, 2, 8, 9],
      [4, 6, 6, 9],
      [6, 6, 9, 9],
      [9, 9, 9, 9],
      [4, 4, 6, 6],
      [6, 7, 8, 8],
    ];

    //nextボタン
    this.nextBtn.addEventListener('click', () => {
      if (this.nextBtn.classList.contains('disabled')) return; //nextボタン利用不可ならreturn
      this.resetGame(); //ゲームリセット
    });

    //retryボタン
    this.retryBtn.addEventListener('click', () => {
      if (this.retryBtn.classList.contains('disabled')) return; //nextボタン利用不可ならreturn
      this.resetGame(); //ゲームリセット
    });

    //オールリセットボタン
    this.allResetBtn.addEventListener('click', () => {
      this.currentQsNum = 0; //現在の問題番号をリセット 配列を利用するので0にしておく
      this.resetGame(); //ゲームリセット
    });
    this.initGame(); //ゲーム初期化
  }
  //文字列をJavascriptの式に変換
  strToJsFormula() {
    //eval()は使用禁止
    return Function(
      '"use strict";return(' +
        this.numbers.firstNum +
        this.calcSymbols.culcSym +
        this.numbers.secondNum +
        ')'
    )();
  }
  //選択した２つの数字を計算
  numsCalc(secondEl) {
    const culcResultNum = this.strToJsFormula(); //文字列をJavascriptの式に変換
    //計算結果が小数点を含んでいたらreturnの式を入れる
    if (!Number.isInteger(culcResultNum)) {
      this.calcSymbols.resetCalcSyms(); //計算記号をリセット
      return;
    }
    console.log(`culcResultNum ${culcResultNum}`);
    this.numbers.numsResultProcess(secondEl, culcResultNum); //計算結果を表示
    this.calcSymbols.resetCalcSyms(); //計算記号をリセット

    if (this.numbers.leftCount === 1) this.checkTen(); //残り1枚になったら10かどうかを確認
  }

  //10かどうかの確認
  checkTen() {
    //成功
    if (this.numbers.firstNum === 10) {
      this.currentQsNum++; //問題番号を一つ増やす

      //全問正解
      if (this.currentQsNum === this.questions.length) {
        this.messageEl.textContent = 'All Clear!!'; //メッセージ
        this.messageEl.classList.remove('invisible'); //メッセージを出す
        this.retryBtn.classList.add('disabled'); //retryボタン利用不可
        this.allcorrectSound.play(); //全問正解音
        //全問正解以外
      } else {
        this.messageEl.textContent = '成功!'; //メッセージ
        this.messageEl.classList.remove('invisible'); //メッセージを出す
        this.retryBtn.classList.add('disabled'); //retryボタン利用不可
        this.nextBtn.classList.remove('disabled'); //nextボタン利用可
        this.correctSound.play(); //正解音
      }
      //失敗
    } else {
      this.messageEl.textContent = '失敗!'; //メッセージ
      this.messageEl.classList.remove('invisible'); //メッセージを出す
      this.unCorrectSound.play(); //失敗音
    }
  }

  //表示をセット
  setDisplay() {
    //ステージを表示
    this.stageEl.textContent = `Stage ${this.currentQsNum + 1}/${
      this.questions.length
    }`;
    //プログレスバー
    this.progressBarFull.style.width = `${
      ((this.currentQsNum + 1) / this.questions.length) * 100
    }%`;

    this.messageEl.classList.add('invisible'); //メッセージを消す
    this.retryBtn.classList.remove('disabled'); //retryボタン使用可
    this.nextBtn.classList.add('disabled'); //nextボタン使用不可
  }

  //ゲームリセット
  resetGame() {
    this.setDisplay(); //表示をセット
    this.numbers.setNumbers(); //4枚の数字をセット
    this.calcSymbols.resetCalcSyms(); //計算記号をリセット
  }

  //ゲーム初期化
  initGame() {
    this.currentQsNum = 0; //現在の問題番号をリセット 配列を利用するので0にしておく
    this.setDisplay(); //表示をセット
    this.numbers.setNumbers(); //4枚の数字をセット
    this.calcSymbols.setCalcSyms(); //計算記号初期セット
  }
}

new Game();
