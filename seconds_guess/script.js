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

// ボタン
class Button {
  constructor(timer) {
    this.timer = timer; //タイマー
    this.startBtn = document.getElementById('start'); //スタートボタン
    this.stopBtn = document.getElementById('stop'); //ストップボタン
    this.retryBtn = document.getElementById('retry'); //もう一度ボタン

    // スタートボタン　アロー関数でthisをparentへ
    this.startBtn.addEventListener('click', () => this.timer.startTimer());

    //　ストップボタン
    this.stopBtn.addEventListener('click', () => this.timer.stopTimer());

    //　もう一度ボタン
    this.retryBtn.addEventListener('click', () => this.timer.resetTimer());
  }
  // 初期状態のボタン
  initialStateBtn() {
    this.startBtn.classList.remove('inactive');
    this.stopBtn.classList.add('inactive');
    this.retryBtn.classList.add('inactive');
  }

  // タイマー稼働中のボタン
  runningStateBtn() {
    this.startBtn.classList.add('inactive');
    this.stopBtn.classList.remove('inactive');
    this.retryBtn.classList.add('inactive');
  }

  // ストップを押した後のボタン
  finishStateBtn() {
    this.startBtn.classList.add('inactive');
    this.stopBtn.classList.add('inactive');
    this.retryBtn.classList.remove('inactive');
  }
}

// タイマー
class Timer {
  constructor() {
    this.rule = new Rule(); //ルール
    this.button = new Button(this); //ボタン
    this.randomTimeEl = document.getElementById('random-time'); //目標タイム表示
    this.resultTimeEl = document.getElementById('result-time'); //実際タイム表示
    this.admitRangeEl = document.getElementById('admit-time'); //許容タイム表示
    this.diffTimeEl = document.getElementById('diff'); //目標と実際の差表示

    this.startTime; //スタート時間
    this.elapsedTime; //経過時間
    this.randomTime; //目標時間
    this.diffTime; //タイム差
    this.admitRange; //許容範囲
    this.initTimer(); // 初期状態へ
  }
  // 初期状態
  initTimer() {
    // 5から10をランダム表示
    this.randomTime = (Math.floor(Math.random() * 6) + 5).toFixed(2);
    this.randomTimeEl.textContent = `目標タイム: ${this.randomTime}秒`; //目標タイム表示
    this.resultTimeEl.textContent = '実際タイム: 　？秒'; //実際タイム表示
    //許容範囲を0.5〜1.0でランダム表示
    this.admitRange = Number((Math.floor(Math.random() * 6) + 5) / 10).toFixed(
      2
    );
    this.admitRangeEl.textContent = `誤差${this.admitRange}秒までOK`;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.diffTimeEl.textContent = '';
    this.diffTimeEl.classList.remove('message');
  }

  //　タイマースタート
  startTimer() {
    if (this.button.startBtn.classList.contains('inactive')) return;
    this.button.runningStateBtn();
    this.startTime = Date.now();
    this.resultTimeEl.classList.remove('result-time');
    // console.log(this.resultTimeEl);
    this.resultTimeEl.textContent = '';
    this.resultTimeEl.classList.add('rotation');
  }

  //　タイマーストップ
  stopTimer() {
    if (this.button.stopBtn.classList.contains('inactive')) return;

    this.button.finishStateBtn();
    this.resultTimeEl.classList.remove('rotation');
    this.resultTimeEl.classList.add('result-time');
    this.elapsedTime = (Date.now() - this.startTime) / 1000;
    this.resultTimeEl.textContent = `実際タイム: ${this.elapsedTime.toFixed(
      2
    )}秒`;
    this.diffTime = this.elapsedTime - this.randomTime;
    if (this.diffTime > -this.admitRange && this.diffTime < this.admitRange) {
      this.diffTimeEl.textContent = `成 功！ ${this.diffTime.toFixed(2)} 秒 差`;
    } else {
      this.diffTimeEl.textContent = ` 失 敗！ ${this.diffTime.toFixed(
        2
      )} 秒 差`;
    }
    this.diffTimeEl.classList.add('message');
  }

  // タイマーリセット
  resetTimer() {
    if (this.button.retryBtn.classList.contains('inactive')) return;
    this.button.initialStateBtn();
    this.initTimer(); // 初期状態へ
  }
}

new Timer();
