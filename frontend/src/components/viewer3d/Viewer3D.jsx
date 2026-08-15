/**
 * components/viewer3d/Viewer3D.jsx
 * 3D 查看器页面：Canvas + OrbitControls + ContactShadows + frameloop="demand" + dpr=[1,2]
 * 控制栏：重置视角 / 剖面开关 / 高亮说明 + 「演示模型」标注
 */
import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Button, Space, Tooltip, Tag, Spin, Popover } from 'antd';
import {
  ArrowLeftOutlined,
  RotateLeftOutlined,
  ScissorOutlined,
  InfoCircleOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import MotorModel from './MotorModel';
import ModelControls from './ModelControls';
import { getMotor } from '../../api/motors';

export default function Viewer3D() {
  const { id } = useParams();
  const { t } = useTranslation();
  const controlsRef = useRef(null);

  const [cutaway, setCutaway] = useState(false);
  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMotor(id);
        if (mounted && res && res.success) setMotor(res.data);
      } catch (e) {
        // 后端不可用时静默（3D 占位模型仍可展示）
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900">
      <Canvas
        camera={{ position: [5, 3.2, 6], fov: 45 }}
        dpr={[1, 2]}
        frameloop="demand"
        shadows
      >
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 5]} intensity={1.2} />
        <pointLight position={[-5, 3, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <MotorModel cutaway={cutaway} />
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.5}
            scale={10}
            blur={2.6}
            far={4.5}
            resolution={512}
            color="#000000"
          />
          <ModelControls ref={controlsRef} />
        </Suspense>
      </Canvas>

      {/* 顶部左侧：返回 + 标题 + 演示模型标注 */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2">
        <Link to={`/motors/${id}`} className="pointer-events-auto">
          <Button icon={<ArrowLeftOutlined />} className="!bg-white/10 !text-white hover:!text-white">
            {t('viewer.back')}
          </Button>
        </Link>
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
          <ThunderboltFilled className="text-blue-400" />
          <span className="text-sm font-medium text-white">
            {t('viewer.title')} {motor ? `· ${motor.model}` : ''}
          </span>
          <Tag color="gold" className="ml-1">{t('viewer.demoBadge')}</Tag>
        </div>
      </div>

      {/* 顶部右侧：控制栏 */}
      <div className="absolute right-4 top-4 z-10">
        <Space direction="vertical" size="small">
          <Tooltip title={t('viewer.controls.reset')} placement="left">
            <Button
              className="!bg-white/10 !text-white"
              icon={<RotateLeftOutlined />}
              onClick={() => controlsRef.current && controlsRef.current.reset()}
            >
              {t('viewer.controls.reset')}
            </Button>
          </Tooltip>
          <Tooltip title={t('viewer.controls.cutaway')} placement="left">
            <Button
              type={cutaway ? 'primary' : 'default'}
              className={cutaway ? '' : '!bg-white/10 !text-white'}
              icon={<ScissorOutlined />}
              onClick={() => setCutaway((v) => !v)}
            >
              {t('viewer.controls.cutaway')}
            </Button>
          </Tooltip>
          <Popover
            content={<div className="max-w-xs text-sm">{t('viewer.info')}</div>}
            placement="left"
            trigger="click"
          >
            <Button className="!bg-white/10 !text-white" icon={<InfoCircleOutlined />}>
              {t('viewer.controls.highlight')}
            </Button>
          </Popover>
        </Space>
      </div>

      {/* 底部提示 */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-gray-300 backdrop-blur">
        {t('viewer.hint')}
      </div>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/60">
          <Spin size="large" />
          <span className="ml-3 text-white">{t('viewer.loading')}</span>
        </div>
      )}
    </div>
  );
}
