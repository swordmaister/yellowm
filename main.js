import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CFG } from './config.js';
import { setupField } from './field.js';
import { spawnEnemy, updateEnemies } from './enemy.js';

// グローバル変数
let scene, camera, renderer, world;
let playerBody, playerMesh;

// 初期化
function init() {
  // Three.js セットアップ
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.colors.sky);
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 5, 10);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Cannon.js セットアップ
  world = new CANNON.World();
  world.gravity.set(0, CFG.world.gravity, 0);

  // プレイヤー作成
  playerBody = new CANNON.Body({
    mass: 60,
    shape: new CANNON.Sphere(1),
    position: new CANNON.Vec3(0, 5, 0),
    fixedRotation: true
  });
  world.addBody(playerBody);
  
  // 簡易プレイヤーメッシュ（自分は見えないがカメラ追従用）
  playerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshBasicMaterial({wireframe:true}));
  scene.add(playerMesh);

  // 他ファイルの機能を実行
  setupField(scene, world);
  spawnEnemy(scene, world, 0, -20); // 試しに敵を1体出す
  spawnEnemy(scene, world, 10, -20); 

  // UIイベント（簡易）
  document.getElementById('btnAction').addEventListener('click', () => {
    alert("結界発動（まだ未実装）");
  });

  loop();
}

// メインループ
function loop() {
  requestAnimationFrame(loop);
  
  // 物理演算を進める
  world.step(1 / 60);

  // 敵AIの更新
  updateEnemies(playerBody);

  // プレイヤー操作（簡易移動）
  // ※本来はここにstickZoneの処理を入れる
  
  // カメラ追従
  playerMesh.position.copy(playerBody.position);
  camera.position.copy(playerBody.position).add(new THREE.Vector3(0, 2, 5));
  camera.lookAt(playerBody.position);

  renderer.render(scene, camera);
}

// 起動
init();
