import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CFG } from './config.js';
import { setupField } from './field.js';
import { spawnEnemy, updateEnemies } from './enemy.js';
// ★追加: UIモジュールを読み込む
import { setupUI, updateHUD, input } from './ui.js';

let scene, camera, renderer, world;
let playerBody, playerMesh;
let playerHp = CFG.player.maxHp; // プレイヤーの体力を管理

function init() {
  // ... (Three.js, Cannon.jsの初期化は変更なし) ...
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.colors.sky);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 5, 10);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  world = new CANNON.World();
  world.gravity.set(0, CFG.world.gravity, 0);

  // プレイヤー
  playerBody = new CANNON.Body({ mass: 60, shape: new CANNON.Sphere(1), position: new CANNON.Vec3(0, 5, 0), fixedRotation: true });
  world.addBody(playerBody);
  playerMesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({wireframe:true}));
  scene.add(playerMesh);

  setupField(scene, world);
  spawnEnemy(scene, world, 0, -20);

  // ★追加: UIのセットアップ（タッチイベントの登録）
  setupUI();

  loop();
}

function loop() {
  requestAnimationFrame(loop);
  world.step(1 / 60);

  // ★追加: スティック入力を使ってプレイヤーを動かす
  const speed = CFG.player.speed;
  // カメラの向きに合わせて動くように計算（簡易的にZ軸のみ考慮）
  playerBody.velocity.x = input.x * speed;
  playerBody.velocity.z = input.y * speed;

  // ★追加: ボタンが押されたらジャンプ（簡易実装）
  if (input.isActionPressed && Math.abs(playerBody.velocity.y) < 0.1) {
    playerBody.velocity.y = 10;
    input.isActionPressed = false; // 押しっぱなし防止
  }

  // ★追加: UIの表示更新
  updateHUD(playerHp);

  updateEnemies(playerBody);

  playerMesh.position.copy(playerBody.position);
  camera.position.copy(playerBody.position).add(new THREE.Vector3(0, 5, 10));
  camera.lookAt(playerBody.position);

  renderer.render(scene, camera);
}

init();
