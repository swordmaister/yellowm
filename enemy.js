import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CFG } from './config.js';

export const enemies = []; // 敵のリスト

// 敵を出現させる関数
export function spawnEnemy(scene, world, x, z) {
  const size = 1.0;
  
  // 物理ボディ
  const body = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(size),
    linearDamping: 0.5,
    position: new CANNON.Vec3(x, 5, z) // 上空から出現
  });
  world.addBody(body);

  // 見た目のメッシュ
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size),
    new THREE.MeshStandardMaterial({ color: CFG.colors.enemy })
  );
  scene.add(mesh);

  enemies.push({ body, mesh });
}

// 毎フレーム実行するAIロジック
export function updateEnemies(playerBody) {
  const speed = 15.0;

  enemies.forEach(e => {
    // 1. 見た目を物理座標に合わせる
    e.mesh.position.copy(e.body.position);
    e.mesh.quaternion.copy(e.body.quaternion);

    // 2. プレイヤーへの方向を計算
    const direction = playerBody.position.vsub(e.body.position);
    direction.normalize();

    // 3. 移動（力を加える）
    e.body.applyForce(direction.scale(speed), e.body.position);

    // 4. 落下したらリセット（簡易的）
    if (e.body.position.y < -10) {
      e.body.position.set(0, 20, -20);
      e.body.velocity.set(0,0,0);
    }
  });
}
