import { useRef } from "react";
import { useFrame,extend } from "@react-three/fiber";
import { MeshPhysicalNodeMaterial } from "three/webgpu";
import phaseWireframe from "../../shaders/phases/phaseWireframe";

extend({MeshPhysicalNodeMaterial});

function AlchemistSphere(){
  const materialRef = useRef();
  const materialLogic = phaseWireframe();

  return(
    <mesh>
      <icosahedronGeometry args={[1, 60]} /> 
      <meshPhysicalNodeMaterial 
        ref={materialRef}
        colorNode={materialLogic}
        transparent={true}
      />
    </mesh>
  )
}

export default AlchemistSphere;