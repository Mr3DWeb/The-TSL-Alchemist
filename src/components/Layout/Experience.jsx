import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Overlay from "../UI/Overlay";
import Scene from "../Canvas/Scene";
import { WebGPURenderer } from "three/webgpu";

gsap.registerPlugin(ScrollTrigger);

function Experience(){
  return(
    <>
    <div className="canvas-warpper">
      <Canvas 
      shadows
      camera={{position:[0,0,5],fov:45}}
      gl={async(props)=>{
      const renderer = new WebGPURenderer(props);
      await renderer.init();
      return renderer;
     }}
      >
        <Scene />
      </Canvas>
    </div>

    <Overlay />
    </>
  )
}


export default Experience;