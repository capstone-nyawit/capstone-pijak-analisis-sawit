"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Custom shader material for advanced effects
const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    // Slowed down animation speed by multiplying time with smaller factors
    pos.y += sin(pos.x * 5.0 + time * 0.5) * 0.1 * intensity;
    pos.x += cos(pos.y * 4.0 + time * 0.3) * 0.05 * intensity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // Smooth fluid-like distortion instead of dot grid
    float nx = sin(uv.y * 3.0 + time * 0.2) * 0.5 + cos(uv.x * 2.0 - time * 0.1) * 0.5;
    float ny = cos(uv.x * 3.0 + time * 0.3) * 0.5 + sin(uv.y * 2.0 + time * 0.15) * 0.5;
    
    float noise = sin((uv.x + nx) * 5.0) * cos((uv.y + ny) * 5.0);
    
    // Mix colors smoothly
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(0.0, 0.2, 0.1), pow(abs(noise), 2.0) * intensity);
    
    // Add glow effect
    float glow = 1.0 - length(uv - 0.5) * 2.0;
    glow = pow(max(glow, 0.0), 2.0);
    
    // Adjust alpha for a very subtle mist effect
    gl_FragColor = vec4(color * glow, glow * 0.4);
  }
`

export function ShaderPlane({
  position,
  color1 = "#011712", // Deep palm green
  color2 = "#10b981", // Emerald accent
}: {
  position: [number, number, number]
  color1?: string
  color2?: string
}) {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 0.8 },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
    }),
    [color1, color2],
  )

  useFrame((state) => {
    if (mesh.current) {
      // Slow down time increment
      uniforms.time.value = state.clock.elapsedTime * 0.3
      uniforms.intensity.value = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={mesh} position={position} scale={[15, 10, 1]}>
      <planeGeometry args={[2, 2, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function EnergyRing({
  radius = 1,
  position = [0, 0, 0],
}: {
  radius?: number
  position?: [number, number, number]
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.2
      ;(mesh.current.material as THREE.Material).opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <ringGeometry args={[radius * 0.8, radius, 64]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}
