import { OrbitControls } from "@react-three/drei";
import AlchemistSphere from "../Canvas/AlchemistSphere";

function Scene(){
  return(
  <>
  <OrbitControls makeDefault/>

   <ambientLight intensity={0.5} />
   <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
   <pointLight position={[-5, -5, -5]} intensity={2} color="#ffaa00" />


  <AlchemistSphere />

  <mesh position={[0, -1.2, 0]} receiveShadow>
      <cylinderGeometry args={[0.8, 1.2, 0.5, 32]} />
      <meshStandardMaterial color="#ff6600" roughness={0.4} metalness={0.2} />
  </mesh>

  
  </>
  )
}

export default Scene;
