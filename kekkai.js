import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CFG } from './config.js';

export const kekkaiList = []; // 結界のリスト

// ■ 結界を作る
export function createKekkai(scene, world, position, size = {x:1, y:1, z:1}) {
  // 1. 物理ボディ
  const body = new CANNON.Body({ mass: 0 }); // 空中に浮くので質量0
  body.position.copy(position);
  body.addShape(new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)));
  world.addBody(body);

  // 2. 見た目のメッシュ
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const material = new THREE.MeshBasicMaterial({ 
    color: CFG.colors.kekkai, 
    transparent: true, 
    opacity: 0.5 
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  
  // 枠線を追加
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  mesh.add(edges);
  
  scene.add(mesh);

  // リストに保存
  kekkaiList.push({ body, mesh });
}

// ■ 結界を消す（解・滅）
export function removeKekkai(scene, world, index) {
  if (index < 0 || index >= kekkaiList.length) return;
  
  const target = kekkaiList[index];
  
  // 物理と見た目を削除
  world.removeBody(target.body);
  scene.remove(target.mesh);
  
  // リストから削除
  kekkaiList.splice(index, 1);
}

// ■ 一番新しい結界を消す
export function undoLastKekkai(scene, world) {
  if (kekkaiList.length > 0) {
    removeKekkai(scene, world, kekkaiList.length - 1);
  }
}
