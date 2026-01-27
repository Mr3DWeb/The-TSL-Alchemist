import { time, positionLocal, normalLocal, mx_noise_float, vec3, float } from 'three/tsl'

export const phaseFluid = (intensityUniform, frequencyUniform, speedUniform) => {
    const timer = time.mul(speedUniform)

    const noiseInput = positionLocal.mul(frequencyUniform).add(timer)

    const noiseValue = mx_noise_float(noiseInput, 1, 0)

    const displacement = normalLocal.mul(noiseValue).mul(intensityUniform)

    const newPosition = positionLocal.add(displacement)

    return newPosition
}
