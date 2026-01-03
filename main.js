// ... (他のimport)
// ★追加: 結界モジュールを読み込む
import { createKekkai, undoLastKekkai } from './kekkai.js';

// ... (変数の定義)
const raycaster = new THREE.Raycaster(); // ★追加: 視線判定用

// ... (init関数の中)
  // ★追加: ボタン操作の変更
  const btn = document.getElementById('btnAction');
  btn.textContent = "結"; // ラベル変更
  
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    // プレイヤーの目の前に結界を作る
    const spawnPos = playerBody.position.clone();
    
    // カメラの向いている方向を取得
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    
    // 自分の位置 + (向き * 5メートル)
    spawnPos.vadd(new CANNON.Vec3(dir.x * 5, dir.y * 5, dir.z * 5), spawnPos);
    
    createKekkai(scene, world, spawnPos);
  });

// ... (loop関数はそのまま)
