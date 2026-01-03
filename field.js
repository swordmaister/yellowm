import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CFG } from './config.js';

export function setupField(scene, world) {
  // 1. ライト
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(50, 100, 50);
  sun.castShadow = true;
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x555555));

  // 2. 地面 (物理 + 見た目)
  const gMat = new THREE.MeshStandardMaterial({ color: CFG.colors.ground });
  const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), gMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  const groundBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  // 3. テスト用の障害物（箱）
  const boxM = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  boxM.position.set(5, 1, 5);
  boxM.castShadow = true;
  scene.add(boxM);

  const boxB = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(5, 1, 5) });
  boxB.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
  world.addBody(boxB);
}
