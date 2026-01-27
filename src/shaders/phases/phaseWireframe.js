import {color , float, Fn, mix , positionLocal, sin, step, time, uv } from "three/tsl"

const phaseWireframe = Fn(()=>{
  const baseColor = color('#2e004d');
  const highlightColor = color('#00ffff');

  const gridUv = uv().mul(20.0);
  const gridLine = gridUv.fract();

  const lineX = step(0.05,gridLine.x);
  const lineY = step(0.05, gridLine.y);

  const gridPattern = float(1.0).sub(lineX.mul(lineY));

  const pulse = sin(time.mul(2.0)).add(1.0).mul(0.5);

  const finalColor = mix(baseColor,highlightColor,gridPattern.mul(pulse));

  return finalColor;
})

export default phaseWireframe;