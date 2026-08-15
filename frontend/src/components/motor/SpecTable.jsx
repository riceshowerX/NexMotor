/**
 * components/motor/SpecTable.jsx
 * 详情参数表（antd Descriptions，全参数）
 */
import { Descriptions, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { MOTOR_FIELDS } from '../../utils/constants';
import { formatMotorField } from '../../utils/format';

export default function SpecTable({ motor }) {
  const { t } = useTranslation();

  if (!motor) {
    return <Empty description="—" />;
  }

  const items = MOTOR_FIELDS.filter((field) => {
    const value = motor[field.key];
    return value !== null && value !== undefined && value !== '';
  }).map((field) => ({
    key: field.key,
    label: t(field.labelKey),
    children: formatMotorField(motor, field.key),
  }));

  return (
    <Descriptions
      bordered
      size="middle"
      column={{ xs: 1, sm: 2, lg: 3 }}
      items={items}
      className="[&_.ant-descriptions-item-label]:!w-40"
    />
  );
}
