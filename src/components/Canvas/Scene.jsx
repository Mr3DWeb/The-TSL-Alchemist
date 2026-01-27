import { OrbitControls } from "@react-three/drei";


function Scene(){
  return(
  <>
  <OrbitControls makeDefault/>

  <ambientLight intensity={0.5} />
  <directionalLight position={[2, 5, 2]} intensity={1} />

  <mesh>
        <boxGeometry />
        <meshNormalMaterial />
  </mesh>
  </>
  )
}

export default Scene;
