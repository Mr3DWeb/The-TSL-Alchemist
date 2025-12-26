import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";


import { getResponsiveConfig } from "../../utils/getResponsiveConfig";




function Scene(){
  const getResponsiveData = useMemo(()=> getResponsiveConfig() ,[]);


  return(
    <>
    <ambientLight intensity={0.5} />
    <OrbitControls />
    <mesh scale={[0.8,0.8,0.8]}>
      <sphereGeometry />
      <meshBasicMaterial wireframe />
    </mesh>
    </>
  )
}

export default Scene;