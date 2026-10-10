import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

// Smooth easing function for fluid transitions
const easeInOut = (t) => t * t * (3 - 2 * t)

const mapRange = (val, inMin, inMax, outMin, outMax) => {
  if (val <= inMin) return outMin
  if (val >= inMax) return outMax
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin)
}

/* ------------------------------------------------
   Premium Sculpture — organic & geometric
   ------------------------------------------------ */
function Sculpture({ scrollProgress, theme }) {
  const groupRef = useRef()

  // High-contrast material properties
  // Light theme: pale silver/white object so black text pops over it
  // Dark theme: extremely dark graphite so white text pops over it
  const metalness = 0.9
  const roughness = 0.3
  const clearcoat = 1.0
  const color = theme === 'light' ? '#e0e0e0' : '#0a0a0a'

  useFrame(() => {
    if (!groupRef.current || !scrollProgress) return
    const p = scrollProgress.current

    // Phase 1: Object moves from right side to center (0.05 to 0.45)
    const p1 = Math.max(0, Math.min(1, (p - 0.05) / 0.40))
    const e1 = easeInOut(p1)

    // Phase 2: Object scales down and shifts to halo position (0.45 to 0.65)
    // Finishes settling BEFORE the Welcome text appears (at 0.65+)
    const p2 = Math.max(0, Math.min(1, (p - 0.45) / 0.20))
    const e2 = easeInOut(p2)

    // Scale: Grows to 2.8, then shrinks to 1.8 for the halo background
    const scale = mapRange(e1, 0, 1, 1.2, 2.8) + mapRange(e2, 0, 1, 0, -1.0)
    
    // Position: Starts right, centers, then pushes up and back
    const x = mapRange(e1, 0, 1, 1.8, 0) + mapRange(e2, 0, 1, 0, 0)
    const y = mapRange(e1, 0, 1, -0.2, 0) + mapRange(e2, 0, 1, 0, 1.4)
    const z = mapRange(e1, 0, 1, 0, 0) + mapRange(e2, 0, 1, 0, -3)

    const rotX = mapRange(e1, 0, 1, 0, Math.PI * 0.45) + mapRange(e2, 0, 1, 0, Math.PI * 0.25)
    const rotY = mapRange(e1, 0, 1, -Math.PI * 0.15, Math.PI * 1.0) + mapRange(e2, 0, 1, 0, Math.PI * 0.5)

    groupRef.current.scale.setScalar(scale)
    groupRef.current.position.set(x, y, z)
    groupRef.current.rotation.set(rotX, rotY, 0)
  })

  return (
    <group ref={groupRef}>
      {/* 
        A highly refined intersecting ring composition (armillary-inspired) 
        providing a premium, architectural look that avoids generic primitives.
      */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.0, 0.18, 128, 128]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={clearcoat} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 2, 0]}>
        <torusGeometry args={[0.85, 0.22, 128, 128]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={clearcoat} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <torusGeometry args={[0.65, 0.28, 128, 128]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={clearcoat} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------
   HeroScene — the Canvas wrapper
   ------------------------------------------------ */
export default function HeroScene({ scrollProgress, theme }) {
  // Studio lighting intensities adapted to theme background
  const lightIntensity = theme === 'light' ? 2 : 1
  const ambientIntensity = theme === 'light' ? 1.5 : 0.5

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]} // Restrict max DPR to 2 for performance
      gl={{ antialias: true, alpha: true }}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    >
      <ambientLight intensity={ambientIntensity} />
      
      {/* Key Light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={lightIntensity * 2.5} 
        color={theme === 'light' ? '#ffffff' : '#f0f0f0'} 
      />
      
      {/* Fill Light (cool tone) */}
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={lightIntensity * 1.5} 
        color="#a0c0ff" 
      />
      
      {/* Rim Light (warm tone) */}
      <spotLight 
        position={[0, 5, -5]} 
        intensity={lightIntensity * 3} 
        color="#ffe0b0" 
        penumbra={1} 
      />

      <Sculpture scrollProgress={scrollProgress} theme={theme} />
      
      <Environment preset="city" />
    </Canvas>
  )
}
