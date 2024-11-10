const words = [
    "クラウド", "スコール", "ティーダ", "ジタン", "ライトニング", "ノクティス", "ユウナ", "ティファ", "エアリス", "セフィロス",
    "バレット", "ザックス", "ヴィンセント", "ユフィ", "シド", "レッドXIII", "リノア", "ゼル", "セルフィ", "アーヴァイン",
    "キスティス", "サイファー", "ラグナ", "キロス", "ウォード", "アーロン", "ワッカ", "ルールー", "キマリ", "リュック",
    "パイン", "ジェクト", "シーモア", "スノウ", "ホープ", "サッズ", "ヴァニラ", "ファング", "イグニス", "グラディオラス",
    "プロンプト", "アーデン", "ルナフレーナ", "シドニー", "レギス", "イリス", "コル", "アラネア", "ニックス", "リベルト"
];
const romajiWords = [
    "kuraudo", "sukooru", "tiida", "jitan", "raitoningu", "nokutisu", "yuuna", "tifa", "earisu", "sefuirosu",
    "baretto", "zakkusu", "vinsento", "yufi", "shido", "reddoXIII", "rinoa", "zeru", "serufi", "aavain",
    "kisutisu", "saifaa", "raguna", "kirosu", "woodo", "aaron", "wakka", "ruuru", "kimari", "ryukku",
    "pain", "jekuto", "shiimoa", "sunou", "hoopu", "sazzu", "vanira", "fangu", "ignisu", "guradiolasu",
    "puromputo", "aaden", "runafureena", "shidoni", "regisu", "irisu", "koru", "aranea", "nikkusu", "riberuto"
];
let score = 0;
let timeLeft = 60; // タイマーの初期値を60秒に設定
let timerInterval;
let correctKeys = 0;
let mistypedKeys = 0;
let startTime;

// HTML要素を取得
const wordElement = document.getElementById("character-name");
const romajiElement = document.getElementById("romaji-display");
const inputElement = document.getElementById("input-display");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const retryButton = document.getElementById("retry");
const characterImage = document.querySelector(".character-image");
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");
const playSound = document.getElementById("play-sound");
const focusSound = document.getElementById("focus-sound");

// 初期表示
function showWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    wordElement.textContent = words[randomIndex];
    romajiElement.innerHTML = romajiWords[randomIndex];
    inputElement.textContent = ""; // 入力フィールドをリセット
    characterImage.style.transition = "opacity 0.5s"; // 画像のフェードイン
    characterImage.style.opacity = 0; // 初期状態で透明
    setTimeout(() => {
        characterImage.style.opacity = 1; // フェードイン
    }, 100);

    // お題が浮かび上がるアニメーション
    wordElement.style.opacity = 0; // 初期状態で透明
    setTimeout(() => {
        wordElement.style.opacity = 1; // フェードイン
    }, 100);
}

// タイマーの開始
function startTimer() {
    startTime = Date.now(); // ゲーム開始時間を記録
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    wordElement.textContent = "";
    romajiElement.innerHTML = ""; // ローマ字をクリア
    inputElement.textContent = ""; // 入力フィールドをクリア
    inputElement.style.display = "none"; // 入力を隠す
    retryButton.style.display = "block"; // 再挑戦ボタンを表示
    characterImage.style.display = "none"; // 画像を非表示
    const finishText = document.createElement("div");
    finishText.className = "finish-text";
    finishText.textContent = "FINISH!!";
    document.querySelector(".input-container").appendChild(finishText);
    updateResults();
    document.body.classList.add('no-animation'); // アニメーションを停止
}

function updateResults() {
    const resultPanel = document.querySelector(".left-panel");
    resultPanel.innerHTML = `
        <div class="result-panel">
            <h1>Result</h1>
            <div class="result-item">Correct Keys: ${correctKeys}</div>
            <div class="result-item">Mistyped Keys: ${mistypedKeys}</div>
            <div class="result-item">Score: ${score}</div>
        </div>
    `;
    setTimeout(() => {
        document.querySelector(".result-panel").classList.add("show");
    }, 100);
}

inputElement.addEventListener("keydown", (event) => {
    const validKeys = /^[a-zA-Z]$/; // 半角英字のみ許可
    if (!validKeys.test(event.key) && event.key !== "Backspace") {
        event.preventDefault(); // 半角英字以外の入力を無効にする
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault(); // バックスペースキーを無効にする
        return;
    }

    const userInput = inputElement.textContent + event.key;
    const currentRomaji = romajiElement.textContent;

    // 入力が現在のローマ字の長さを超えないようにする
    if (userInput.length > currentRomaji.length) {
        event.preventDefault();
        return;
    }

    // 部分一致のチェック
    let highlightedText = "";
    let highlightedRomaji = "";
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentRomaji[i]) {
            highlightedText += `<span class="highlight">${wordElement.textContent[i] || ''}</span>`;
            highlightedRomaji += `<span class="highlight-romaji">${currentRomaji[i] || ''}</span>`;
            correctKeys++; // 正しく打ったキーの数をカウント
            score += 10; // 一文字入力するたびに10スコア追加
            correctSound.currentTime = 0; // 再生位置をリセット
            correctSound.play(); // 正解時の音を再生
        } else {
            highlightedText += wordElement.textContent[i] || '';
            highlightedRomaji += currentRomaji[i] || '';
            mistypedKeys++; // ミスタイプ数をカウント
            incorrectSound.currentTime = 0; // 再生位置をリセット
            incorrectSound.play(); // 不正解時の音を再生
        }
    }
    wordElement.innerHTML = highlightedText + wordElement.textContent.slice(userInput.length);
    romajiElement.innerHTML = highlightedRomaji + currentRomaji.slice(userInput.length);
    scoreElement.textContent = `Score: ${score}`; // 右下のスコアを更新

    if (userInput === currentRomaji) {
        setTimeout(showWord, 200); // 0.5秒後に次のお題を表示
    } else if (event.key !== currentRomaji[userInput.length - 1]) {
        event.preventDefault(); // 正しくないキー入力を無効にする
    }
});

retryButton.addEventListener("click", () => {
    score = 0;
    timeLeft = 60; // タイマーの初期値を60秒に設定
    correctKeys = 0;
    mistypedKeys = 0;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time: ${timeLeft}`;
    inputElement.style.display = "block"; // 入力を再表示
    retryButton.style.display = "none"; // 再挑戦ボタンを隠す
    document.querySelector(".finish-text").remove(); // FINISH!テキストを削除
    document.querySelector(".left-panel").innerHTML = ""; // Resultをクリア
    showWord();
    startTimer();
    inputElement.focus(); // 入力フィールドにフォーカスを設定
    playSound.currentTime = 0; // 再生位置をリセット
    playSound.play(); // リトライボタンを押したときの音を再生
    document.body.classList.add('no-animation'); // アニメーションを停止
});

document.getElementById('play-button').addEventListener('click', function() {
    const gameContainer = document.querySelector('.game-container');
    const playButton = document.getElementById('play-button');
    gameContainer.style.display = 'flex'; // 表示を変更
    gameContainer.style.animation = 'fadeIn 1s forwards'; // フェードインアニメーションを適用
    playButton.style.display = 'none'; // Playボタンを隠す
    document.querySelector(".left-panel").innerHTML = ""; // Resultをクリア
    inputElement.focus(); // 入力フィールドにフォーカスを設定
    playSound.currentTime = 0; // 再生位置をリセット
    playSound.play(); // プレイボタンを押したときの音を再生
    document.body.classList.add('no-animation'); // アニメーションを停止
});

document.getElementById('play-button').addEventListener('mouseover', function() {
    focusSound.currentTime = 0; // 再生位置をリセット
    focusSound.play(); // プレイボタンにカーソルが当たったときの音を再生
});

retryButton.addEventListener('mouseover', function() {
    focusSound.currentTime = 0; // 再生位置をリセット
    focusSound.play(); // リトライボタンにカーソルが当たったときの音を再生
});

document.addEventListener('click', function(event) {
    const gameContainer = document.querySelector('.game-container');
    const playButton = document.getElementById('play-button');
    if (!gameContainer.contains(event.target) && event.target.id !== 'play-button') {
        gameContainer.style.display = 'none'; // ゲーム画面を非表示にする
        playButton.style.display = 'block'; // Playボタンを再表示する
        document.body.classList.remove('no-animation'); // アニメーションを再開
    }
});

// ゲーム開始
showWord();
startTimer();
inputElement.focus(); // 入力フィールドにフォーカスを設定

// ウィンドウがアクティブになったときに入力フィールドにフォーカスを設定
window.addEventListener("focus", () => inputElement.focus());

// ウィンドウがクリックされたときに入力フィールドにフォーカスを設定
window.addEventListener("click", () => inputElement.focus());