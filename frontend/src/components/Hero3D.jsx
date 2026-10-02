import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";

function Orb() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh>
        <sphereGeometry args={[1.4, 64, 64]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          distort={0.45}
          speed={2}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={2} color="#22d3ee" />
      <directionalLight position={[-3, -2, -3]} intensity={1.5} color="#f472b6" />
      <Orb />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  );
}

export default Hero3D;