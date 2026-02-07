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
    
    // 🔥 ویژگی‌های جدید برای واقعی‌تر شدن الماس
    attenuationColor: { value: '#ffffff', label: 'Atten. Color' },
    attenuationDistance: { value: 0.5, min: 0, max: 5, step: 0.1, label: 'Atten. Dist' },
    dispersion: { value: 0.0, min: 0, max: 10, step: 0.1, label: 'Dispersion' }, // اثر رنگین‌کمانی

  }), { collapsed: true });

  useControls('Alchemist Lab', {
    Presets: folder({
      '💎 Diamond': button(() => set({
        baseColor: '#ffffff',
        roughness: 0.0,
        metalness: 0.0,
        transmission: 1.0,
        ior: 2.4,
        thickness: 5.0, // ضخامت بالا برای شکست نور بهتر
        attenuationColor: '#eecfff', // کمی ترفند رنگی برای زیبایی در تاریکی
        attenuationDistance: 0.7, // باعث می‌شود الماس "توپر" به نظر برسد
        dispersion: 4.0, // ایجاد طیف رنگی (رنگین کمان) در لبه‌ها
        waveStrength: 0.0,
        wireThickness: 0.0
      })),
      
      '⚫ Black Pearl': button(() => set({
        baseColor: '#1a1a1a',
        roughness: 0.1,
        metalness: 0.8,
        transmission: 0.0,
        ior: 1.5,
        thickness: 1.5,
        attenuationColor: '#ffffff',
        attenuationDistance: 0.5,
        dispersion: 0.0,
        waveStrength: 0.0,
        wireColor: '#ffffff',
        wireThickness: 0.02
      })),

      '💧 Water Orb': button(() => set({
        baseColor: '#ffffff',
        roughness: 0.02,
        metalness: 0.0,
        transmission: 1.0,
        ior: 1.33,
        thickness: 2.0,
        attenuationColor: '#44aaff', // آب آبی رنگ است
        attenuationDistance: 1.0,
        dispersion: 0.5,
        waveStrength: 0.08,
        waveSpeed: 2.0,
        waveFrequency: 3.5,
        wireThickness: 0.0
      })),

      '🔮 Dark Energy': button(() => set({
        baseColor: '#220033',
        roughness: 0.4,
        metalness: 0.5,
        transmission: 0.1,
        ior: 1.5,
        attenuationColor: '#000000',
        attenuationDistance: 10.0,
        dispersion: 0.0,
        waveStrength: 0.5,
        waveSpeed: 3.0,
        waveFrequency: 4.0,
        wireColor: '#ff00aa',
        wireThickness: 0.5
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

    // یونیفرم‌های جدید
    const uAttenuationColor = uniform(new Color(0xffffff))
    const uAttenuationDistance = uniform(0.5)
    const uDispersion = uniform(0)

    const timer = time.mul(uSpeed)
    const noiseInput = positionLocal.mul(uFrequency).add(timer)
    const noiseValue = mx_noise_float(noiseInput, 1, 0)
    const displacement = normalLocal.mul(noiseValue).mul(uStrength)
    const finalPosition = positionLocal.add(displacement)

    const pattern = sin(positionLocal.y.mul(20).add(positionLocal.x.mul(10)))
    const mask = pattern.greaterThan(0.9)

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
    
    // آپدیت یونیفرم‌های جدید
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
        
        // متصل کردن ویژگی‌های جدید
        attenuationColorNode={materialsProps.attenuationColorNode}
        attenuationDistanceNode={materialsProps.attenuationDistanceNode}
        dispersionNode={materialsProps.dispersionNode} // اگر نسخه three.js شما جدیده این کار میکنه

        transparent={true}
      />
    </mesh>
  )
}

export default AlchemistSphere;
