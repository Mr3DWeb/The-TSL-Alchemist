import { OrbitControls } from "@react-three/drei";
import AlchemistSphere from "../Canvas/AlchemistSphere";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";

function Scene(){

   const envControls = useControls(
  'Environment Settings',
  {
    bgVisible: { value: false, label: 'Background Visible' },
    bgBlur: { value: 0.5, min: 0, max: 1, step: 0.05, label: 'Background Blur' }
  },
  { collapsed: true }
)

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

  
  <Environment 
  files={"/hdri/potsdamer_platz_1k.hdr"} 
  background={envControls.bgVisible}
  blur={envControls.bgBlur}
  />
  </>
  )
}

export default Scene;
