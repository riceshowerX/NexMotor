/**
 * components/viewer3d/ModelControls.jsx
 * 3D 交互控制：OrbitControls（旋转/缩放/阻尼）+ 暴露 reset 视角
 */
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';

/**
 * 相机控制器
 * 通过 ref 暴露 reset()：将相机位置与目标点恢复为初始状态
 */
const ModelControls = forwardRef(function ModelControls(_props, ref) {
  const controlsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      const controls = controlsRef.current;
      if (controls && controls.reset) {
        controls.reset();
        controls.update();
      }
    },
  }));

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={3.5}
      maxDistance={14}
      maxPolarAngle={Math.PI * 0.55}
      target={[0, -0.2, 0]}
    />
  );
});

export default ModelControls;
