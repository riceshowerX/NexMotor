/**
 * components/motor/MotorCard.jsx
 * 列表卡片：型号/机座号/功率/转速/电压/效率
 */
import { Card, Tag, Descriptions, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMotorField } from '../../utils/format';

export default function MotorCard({ motor }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!motor) return null;

  const goDetail = () => navigate(`/motors/${motor.id}`);

  return (
    <Card
      hoverable
      className="h-full !rounded-2xl shadow-sm transition-shadow hover:shadow-md"
      onClick={goDetail}
      styles={{ body: { padding: 20 } }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-gray-900">{motor.model}</div>
          <div className="mt-1 text-xs text-gray-500">{motor.description || t('detail.demoModel')}</div>
        </div>
        <Tag color="blue" className="shrink-0">{motor.frameSize}</Tag>
      </div>

      <Descriptions column={1} size="small" colon={false} className="mb-4">
        <Descriptions.Item label={t('detail.field.power')}>{formatMotorField(motor, 'power')}</Descriptions.Item>
        <Descriptions.Item label={t('detail.field.rpm')}>{formatMotorField(motor, 'rpm')}</Descriptions.Item>
        <Descriptions.Item label={t('detail.field.voltage')}>{formatMotorField(motor, 'voltage')}</Descriptions.Item>
        <Descriptions.Item label={t('detail.field.efficiency')}>{formatMotorField(motor, 'efficiency')}</Descriptions.Item>
      </Descriptions>

      <Button type="primary" block icon={<ArrowRightOutlined />}>
        {t('common.buttons.detail')}
      </Button>
    </Card>
  );
}
