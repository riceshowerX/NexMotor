/**
 * components/viewer3d/MotorModel.jsx
 * 占位电机模型：横向圆柱机壳 + 前后端盖 + 风罩 + 接线盒 + 底座 + 内层转子
 * 分组命名：shell / rotor / fan / junction / base
 * 交互：hover 部件 emissive 高亮 + drei Html 标签显示部件名
 */
import { Children, cloneElement, useState } from 'react';
import { Html } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

const PART_META = {
  shell: { labelKey: 'viewer.parts.shell', color: '#94a3b8' },
  rotor: { labelKey: 'viewer.parts.rotor', color: '#f59e0b' },
  fan: { labelKey: 'viewer.parts.fan', color: '#64748b' },
  junction: { labelKey: 'viewer.parts.junction', color: '#3b82f6' },
  base: { labelKey: 'viewer.parts.base', color: '#475569' },
};

/**
 * 部件容器：统一管理 hover 状态（emissive 高亮 + Html 名称标签）
 */
function Part({ name, visible = true, labelPosition = [0, 1.4, 0], children }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  const wrapped = Children.map(children, (child) =>
    cloneElement(child, {
      hovered,
      onPointerOver: (e) => {
        e.stopPropagation();
        setHovered(true);
      },
      onPointerOut: () => setHovered(false),
    })
  );

  return (
    <group visible={visible}>
      {wrapped}
      {hovered && (
        <Html
          center
          position={labelPosition}
          distanceFactor={8}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="whitespace-nowrap rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-lg">
            {t(PART_META[name].labelKey)}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 可高亮网格：hover 时设置 emissive
 */
function M({
  hovered = false,
  color = '#94a3b8',
  metalness = 0.85,
  roughness = 0.35,
  emissiveColor = '#60a5fa',
  children,
  ...meshProps
}) {
  return (
    <mesh {...meshProps}>
      {children}
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={hovered ? emissiveColor : '#000000'}
        emissiveIntensity={hovered ? 0.9 : 0}
      />
    </mesh>
  );
}

const HOLES = [
  [-1.1, -1.32],
  [1.1, -1.32],
  [-1.1, 1.32],
  [1.1, 1.32],
];

/**
 * 电机占位模型
 * @param {boolean} cutaway 剖面模式：隐藏 shell/fan 组，露出转子
 */
export default function MotorModel({ cutaway = false }) {
  return (
    <group>
      {/* 机壳：横向圆柱 + 前后端盖 */}
      <Part name="shell" visible={!cutaway} labelPosition={[0, 1.4, 0]}>
        <M color="#94a3b8" rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 3, 48]} />
        </M>
        <M color="#7c8ba1" position={[1.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.08, 1.08, 0.24, 48]} />
        </M>
        <M color="#7c8ba1" position={[-1.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.08, 1.08, 0.24, 48]} />
        </M>
      </Part>

      {/* 风罩：圆台 + 栅格圆环 */}
      <Part name="fan" visible={!cutaway} labelPosition={[-2.6, 1.4, 0]}>
        <M color="#64748b" position={[-2.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.8, 1.05, 0.75, 32, 1, true]} />
        </M>
        <M color="#475569" position={[-2.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.92, 0.06, 12, 36]} />
        </M>
        <M color="#475569" position={[-2.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.7, 0.05, 12, 32]} />
        </M>
      </Part>

      {/* 接线盒：盒体 + 上盖 */}
      <Part name="junction" labelPosition={[0.2, 2.1, 0]}>
        <M color="#3b82f6" position={[0.1, 1.25, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
        </M>
        <M color="#1d4ed8" position={[0.1, 1.56, 0]}>
          <boxGeometry args={[0.7, 0.12, 0.6]} />
        </M>
      </Part>

      {/* 底座：底板 + 4 个安装孔 */}
      <Part name="base" labelPosition={[0, -0.7, 1.5]}>
        <M color="#475569" position={[0, -1.5, 0]}>
          <boxGeometry args={[2.9, 0.28, 1.8]} />
        </M>
        {HOLES.map(([x, z], idx) => (
          <M key={idx} color="#1e293b" position={[x, -1.32, z]}>
            <cylinderGeometry args={[0.16, 0.16, 0.34, 24]} />
          </M>
        ))}
      </Part>

      {/* 转子：内层圆柱，剖面时可见 */}
      <Part name="rotor" labelPosition={[0, 0, 1.5]}>
        <M color="#f59e0b" rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.52, 0.52, 2.9, 32]} />
        </M>
        <M color="#fbbf24" rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6, 0.6, 0.45, 32]} />
        </M>
      </Part>
    </group>
  );
}
