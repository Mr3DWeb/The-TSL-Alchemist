import { Canvas } from "@react-three/fiber";
import * as THREE from "three/webgpu";

import Overlay from "./components/UI/Overlay";
import Scene from "./components/Canvas/Scene";

function App() {

  return (
    <>
      <Overlay />

      <Canvas 
      camera={{position:[0,0,2],fov:75}}
      gl={async(props)=>{
      const renderer = new THREE.WebGPURenderer(props);
      await renderer.init();
      return renderer;
      }}
      >
        <Scene />
      </Canvas>
    </>
  )
}

export default App
