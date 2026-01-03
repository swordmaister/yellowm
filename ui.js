import { CFG } from './config.js';

// ■ 1. 画面表示の更新（HPバーなど）
export function updateHUD(hp) {
  const hpText = document.getElementById('hpText');
  const hpBar = document.getElementById('hpBar');
  
  // HPの数値とバーの長さを更新
  hpText.textContent = Math.floor(hp);
  const percentage = (hp / CFG.player.maxHp) * 100;
  hpBar.style.width = percentage + "%";
  
  // HPが減ると赤くなる
  hpBar.style.backgroundColor = percentage < 30 ? "#f00" : "#0f0";
}

// ■ 2. 入力情報の管理（メインから参照するデータ）
export const input = {
  x: 0, // スティックの横入力 (-1.0 〜 1.0)
  y: 0, // スティックの縦入力 (-1.0 〜 1.0)
  isActionPressed: false // ボタンが押されているか
};

// ■ 3. スマホ操作（アナログスティック）のセットアップ
export function setupUI() {
  setupStick();
  setupButtons();
}

function setupStick() {
  const stickZone = document.getElementById('stickZone');
  let stickId = null;
  let startX = 0, startY = 0;

  // タッチ開始
  stickZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (stickId !== null) return;
    
    const t = e.changedTouches[0];
    stickId = t.identifier;
    const rect = stickZone.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  }, { passive: false });

  // スティックを動かす
  stickZone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === stickId) {
        const t = e.changedTouches[i];
        let dx = t.clientX - startX;
        let dy = t.clientY - startY;
        
        // 最大移動幅を制限
        const maxDist = 40; 
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) {
          dx *= maxDist / dist;
          dy *= maxDist / dist;
        }

        // 入力値 (-1.0 〜 1.0) を更新
        input.x = dx / maxDist;
        input.y = dy / maxDist;

        // 見た目を動かす（CSSのtransform）
        // ※簡易版なので今回は白い枠の中に小さな丸を表示するような装飾は省略していますが、
        //   必要ならここに style.transform を記述します
      }
    }
  }, { passive: false });

  // 指を離したとき
  const endStick = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === stickId) {
        stickId = null;
        input.x = 0;
        input.y = 0;
      }
    }
  };
  stickZone.addEventListener('touchend', endStick);
  stickZone.addEventListener('touchcancel', endStick);
}

function setupButtons() {
  const btn = document.getElementById('btnAction');
  
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    input.isActionPressed = true;
    btn.style.backgroundColor = "rgba(255,0,0,0.8)"; // 押した色
  });

  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    input.isActionPressed = false;
    btn.style.backgroundColor = "rgba(255,0,0,0.5)"; // 元の色
  });
}
