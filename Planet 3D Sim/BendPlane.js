import * as THREE from 'three';

export function BendPlane(g, rMin, rMax){
    let pos = g.attributes.position;
    let uv = g.attributes.uv;
    let v2 = new THREE.Vector2();
    let fullTurn = Math.PI * 2;
    for(let i = 0; i < pos.count; i++){
        v2.fromBufferAttribute(uv, i);
        let a = fullTurn * v2.x;
        let r = THREE.MathUtils.lerp(rMax, rMin, v2.y);
        pos.setXY(i, Math.cos(a) * r, Math.sin(a) * r);
    }
    pos.needsUpdate = true;
}