import { useEffect,useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Overlay from "../UI/Overlay";
import Scene from "../Canvas/Scene";
import useStore from "../../store/useStore"
import { WebGPURenderer } from "three/webgpu";

gsap.registerPlugin(ScrollTrigger);

function Experience(){

  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const scrollRef = useRef(null);

  useEffect(()=>{
    const trigger = ScrollTrigger.create({
      trigger:scrollRef.current,
      start:"top top",
      end:"bottom bottom",
      scrub:1,
      onUpdate:(self)=>setScrollProgress(self.progress),
    })

    return () => {
      trigger.kill();
    }
  },[setScrollProgress])


  return(
    <>
    <div className="canvas-warpper">
      <Canvas 
      shadows
      camera={{position:[0,0,4],fov:45}}
      gl={async(props)=>{
      const renderer = new WebGPURenderer(props);
      await renderer.init();
      return renderer;
     }}
      >
        <Scene />
      </Canvas>
    </div>

    <Overlay ref={scrollRef} />
    </>
  )
}


export default Experience;