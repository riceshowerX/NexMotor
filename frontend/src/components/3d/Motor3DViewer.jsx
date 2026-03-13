import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, OrbitControls, ContactShadows, Environment } from '@react-three/drei';

// --- 通用电机模型组件 (纯代码生成) ---
const ProceduralMotor = (props) => {
  const group = useRef();

  // 让电机缓慢旋转展示
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) * 0.5; // 缓慢左右摆动
  });

  const industrialBlue = "#1e3a8a"; // 工业蓝
  const metalSilver = "#d1d5db";    // 金属银
  const black = "#1f2937";          // 黑色

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 1. 主机身 (带散热片的圆柱体模拟) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* args: [顶半径, 底半径, 高度, 分段数] */}
        <cylinderGeometry args={[1, 1, 2.5, 32]} />
        <meshStandardMaterial color={industrialBlue} roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* 散热片纹理模拟 (用稍微大一点的低多边形圆柱体) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.05, 1.05, 2.2, 12]} />
        <meshStandardMaterial color={industrialBlue} roughness={0.5} wireframe />
      </mesh>

      {/* 2. 转轴 (前端) */}
      <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
        <meshStandardMaterial color={metalSilver} roughness={0.2} metalness={1} />
      </mesh>
      
      {/* 轴承盖 */}
      <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
         <cylinderGeometry args={[0.6, 0.8, 0.2, 32]} />
         <meshStandardMaterial color={black} />
      </mesh>

      {/* 3. 风扇罩 (后端) */}
      <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.02, 1.02, 0.6, 32]} />
        <meshStandardMaterial color={black} roughness={0.8} />
      </mesh>

      {/* 4. 接线盒 (顶部) */}
      <mesh position={[0.2, 1.1, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color={black} roughness={0.5} />
      </mesh>
      {/* 接线盒盖子 */}
      <mesh position={[0.2, 1.36, 0]}>
        <boxGeometry args={[0.85, 0.05, 0.85]} />
        <meshStandardMaterial color={black} />
      </mesh>

      {/* 5. 底座 (底部) */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.6]} />
        <meshStandardMaterial color={black} />
      </mesh>
      <mesh position={[0.6, -0.9, 0.6]}>
         <boxGeometry args={[0.4, 0.4, 0.2]} />
         <meshStandardMaterial color={black} />
      </mesh>
       <mesh position={[-0.6, -0.9, 0.6]}>
         <boxGeometry args={[0.4, 0.4, 0.2]} />
         <meshStandardMaterial color={black} />
      </mesh>
      <mesh position={[0.6, -0.9, -0.6]}>
         <boxGeometry args={[0.4, 0.4, 0.2]} />
         <meshStandardMaterial color={black} />
      </mesh>
       <mesh position={[-0.6, -0.9, -0.6]}>
         <boxGeometry args={[0.4, 0.4, 0.2]} />
         <meshStandardMaterial color={black} />
      </mesh>

    </group>
  );
};

const Motor3DViewer = () => {
  return (
    <div className="w-full h-[500px] bg-gray-50 rounded-2xl overflow-hidden relative cursor-move">
      <Canvas shadows camera={{ position: [4, 2, 5], fov: 50 }}>
        {/* 环境光照 */}
        <Environment preset="city" />
        
        {/* Stage 自动处理居中、阴影和最佳光照 */}
        <Stage environment="city" intensity={0.6} contactShadow={{ resolution: 1024, scale: 10 }}>
          <ProceduralMotor />
        </Stage>
        
        {/* 交互控制：允许缩放和旋转，禁用平移 */}
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      
      {/* 提示覆盖层 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-500 pointer-events-none select-none shadow-sm">
        拖动旋转 • 滚轮缩放
      </div>
    </div>
  );
};

export default Motor3DViewer;