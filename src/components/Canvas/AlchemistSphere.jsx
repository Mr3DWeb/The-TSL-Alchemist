import { useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { Color } from "three"; 
import { MeshPhysicalNodeMaterial } from "three/webgpu";
import { time, positionLocal, normalLocal, mx_noise_float, uniform, vec3, sin } from "three/tsl";
import { useControls, button, folder } from "leva";

extend({ MeshPhysicalNodeMaterial });

function AlchemistSphere() {

  const [controls, set] = useControls('Alchemist Lab', () => ({
    // --- Wave ---
    waveStrength: { value: 0.0, min: 0, max: 1, step: 0.01 },
    waveSpeed: { value: 1.0, min: 0, max: 5, step: 0.1 },
    waveFrequency: { value: 2.0, min: 1, max: 10, step: 0.1 },

    // --- Wireframe ---
    wireColor: { value: '#00ff88' },
    wireThickness: { value: 0.1, min: 0, max: 1 },

    // --- Base Material ---
    baseColor: { value: '#ffffff', label: 'Base Color' },
    roughness: { value: 0.0, min: 0, max: 1 },
    metalness: { value: 0.0, min: 0, max: 1 },

    // --- Glass/Crystal Properties ---
    transmission: { value: 0.0, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 2.33, step: 0.01 },
    thickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    
    // --- Advanced PBR ---
    attenuationColor: { value: '#ffffff', label: 'Atten. Color' },
    attenuationDistance: { value: 0.5, min: 0, max: 5, step: 0.1, label: 'Atten. Dist' },
    dispersion: { value: 0.0, min: 0, max: 10, step: 0.1, label: 'Dispersion' },

  }), { collapsed: true });

  useControls('Alchemist Lab', {
    Presets: folder({
      
      '🏆 Liquid Gold': button(() => set({
        baseColor: '#ffaa00',
        roughness: 0.15,
        metalness: 1.0,
        transmission: 0.0,
        ior: 1.5,
        thickness: 0,
        attenuationColor: '#ffffff',
        attenuationDistance: 10,
        dispersion: 0,
        waveStrength: 0.1,
        waveSpeed: 0.5,
        waveFrequency: 1.5,
        wireThickness: 0.0
      })),

      '💎 Royal Diamond': button(() => set({
        baseColor: '#ffffff',
        roughness: 0.0,
        metalness: 0.1,
        transmission: 1.0, 
        ior: 2.4,               
        thickness: 5.0,          
        attenuationColor: '#eecfff',
        attenuationDistance: 0.6,
        dispersion: 5.0,          
        waveStrength: 0.0,
        wireThickness: 0.0
      })),

      '🧊 Frosted Ice': button(() => set({
        baseColor: '#aaddff',    
        roughness: 0.45,         
        metalness: 0.1,
        transmission: 1.0,
        ior: 1.31,                 
        thickness: 3.0,
        attenuationColor: '#0055ff', 
        attenuationDistance: 0.8,
        dispersion: 0.5,
        waveStrength: 0.0,
        wireThickness: 0.0
      })),

      '🌋 Molten Core': button(() => set({
        baseColor: '#1a0500',      
        roughness: 0.9,
        metalness: 0.0,
        transmission: 0.0,
        ior: 1.5,
        thickness: 0.1,
        attenuationColor: '#000000',
        attenuationDistance: 10,
        dispersion: 0,
        waveStrength: 0.2,        
        waveSpeed: 0.2,
        waveFrequency: 3.0,
        wireColor: '#ff3300',      
        wireThickness: 0.15       
      })),

      '🕸️ Cyber Matrix': button(() => set({
        baseColor: '#000500',
        roughness: 0.2,
        metalness: 0.8,
        transmission: 0.2,         
        ior: 1.2,
        thickness: 1.0,
        attenuationColor: '#00ff00',
        attenuationDistance: 2.0,
        dispersion: 2.0,
        waveStrength: 0.05,
        waveSpeed: 4.0,           
        waveFrequency: 8.0,        
        wireColor: '#00ff00',      
        wireThickness: 0.05
      })),

      '⚫ Black Pearl': button(() => set({
        baseColor: '#050505',
        roughness: 0.05,         
        metalness: 0.7,
        transmission: 0.0,
        ior: 1.5,
        thickness: 1.0,
        attenuationColor: '#ffffff',
        attenuationDistance: 10,
        dispersion: 0,
        waveStrength: 0.0,
        wireThickness: 0.0
      })),

      '🧼 Soap Bubble': button(() => set({
        baseColor: '#ffffff',
        roughness: 0.0,
        metalness: 0.0,
        transmission: 1.0,
        ior: 1.05,              
        thickness: 0.1,         
        attenuationColor: '#ffffff',
        attenuationDistance: 5.0,
        dispersion: 8.0,         
        waveStrength: 0.1,     
        waveSpeed: 1.0,
        waveFrequency: 1.0,
        wireThickness: 0.0
      })),

      'Reset': button(() => set({
        waveStrength: 0.0,
        baseColor: '#ffffff',
        roughness: 0.0,
        metalness: 0.0,
        transmission: 0.0,
        ior: 1.5,
        thickness: 1.5,
        attenuationColor: '#ffffff',
        attenuationDistance: 0.5,
        dispersion: 0.0,
        wireThickness: 0.1,
        wireColor: '#00ff88'
      }))
    })
  }, [set]);

  const { vertexNode, fragmentNode, materialsProps, uniforms } = useMemo(() => {
    // --- Uniforms Definitions ---
    const uStrength = uniform(0)
    const uSpeed = uniform(0)
    const uFrequency = uniform(0)
    
    const uWireColor = uniform(new Color(0x000000))
    const uWireThickness = uniform(0)
    
    const uBaseColor = uniform(new Color(0x000000))
    const uRoughness = uniform(0)
    const uMetalness = uniform(0)
    
    const uTransmission = uniform(0)
    const uIOR = uniform(1.5)
    const uThickness = uniform(0)

    const uAttenuationColor = uniform(new Color(0xffffff))
    const uAttenuationDistance = uniform(0.5)
    const uDispersion = uniform(0)

    // --- TSL Logic ---
    const timer = time.mul(uSpeed)
    const noiseInput = positionLocal.mul(uFrequency).add(timer)
    const noiseValue = mx_noise_float(noiseInput, 1, 0)
    const displacement = normalLocal.mul(noiseValue).mul(uStrength)
    const finalPosition = positionLocal.add(displacement)

    // Wireframe Pattern
    const pattern = sin(positionLocal.y.mul(20).add(positionLocal.x.mul(10)))
    const mask = pattern.greaterThan(0.9) // Threshold for wire lines

    // Emissive calculation
    const finalEmissive = mask.mix(vec3(0), uWireColor).mul(uWireThickness).mul(5) 

    return {
      vertexNode: finalPosition,
      fragmentNode: finalEmissive,
      materialsProps: { 
        colorNode: uBaseColor,
        roughnessNode: uRoughness,
        metalnessNode: uMetalness,
        transmissionNode: uTransmission,
        iorNode: uIOR,
        thicknessNode: uThickness,
        attenuationColorNode: uAttenuationColor,
        attenuationDistanceNode: uAttenuationDistance,
        dispersionNode: uDispersion
      },
      uniforms: { 
        uStrength, uSpeed, uFrequency, 
        uWireColor, uWireThickness,
        uBaseColor, uRoughness, uMetalness,
        uTransmission, uIOR, uThickness,
        uAttenuationColor, uAttenuationDistance, uDispersion
      }
    }
  }, [])

  useFrame(() => {
    // Sync uniforms with Leva controls
    uniforms.uStrength.value = controls.waveStrength
    uniforms.uSpeed.value = controls.waveSpeed
    uniforms.uFrequency.value = controls.waveFrequency

    uniforms.uWireColor.value.set(controls.wireColor)
    uniforms.uWireThickness.value = controls.wireThickness

    uniforms.uBaseColor.value.set(controls.baseColor)
    uniforms.uRoughness.value = controls.roughness
    uniforms.uMetalness.value = controls.metalness

    uniforms.uTransmission.value = controls.transmission
    uniforms.uIOR.value = controls.ior
    uniforms.uThickness.value = controls.thickness
    
    uniforms.uAttenuationColor.value.set(controls.attenuationColor)
    uniforms.uAttenuationDistance.value = controls.attenuationDistance
    uniforms.uDispersion.value = controls.dispersion
  })

  return (
    <mesh>
      <icosahedronGeometry args={[1, 32]} /> 
      <meshPhysicalNodeMaterial
        positionNode={vertexNode}
        emissiveNode={fragmentNode}
        
        colorNode={materialsProps.colorNode}
        roughnessNode={materialsProps.roughnessNode}
        metalnessNode={materialsProps.metalnessNode}
        
        transmissionNode={materialsProps.transmissionNode}
        iorNode={materialsProps.iorNode}
        thicknessNode={materialsProps.thicknessNode}
        
        attenuationColorNode={materialsProps.attenuationColorNode}
        attenuationDistanceNode={materialsProps.attenuationDistanceNode}
        dispersionNode={materialsProps.dispersionNode}

        transparent={true}
      />
    </mesh>
  )
}

export default AlchemistSphere;
