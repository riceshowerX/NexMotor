/**
 * components/motor/FilterPanel.jsx
 * 多维筛选面板：14 个筛选参数 + 型号/描述关键字 + 排序 + 重置（实时防抖筛选）
 */
import { Collapse, Form, Input, InputNumber, Select, Button, Row, Col } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FILTER_DEFINITIONS, SORT_OPTIONS } from '../../utils/constants';

/** 表单初始值（与筛选状态一致） */
function buildInitialValues() {
  const values = {};
  FILTER_DEFINITIONS.forEach((def) => {
    if (def.type === 'range') {
      values[def.key] = {};
    } else {
      values[def.key] = null;
    }
  });
  return values;
}

export default function FilterPanel({ filters, updateFilter, resetFilters, sortBy, setSortBy }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues) => {
    Object.entries(changedValues).forEach(([key, value]) => {
      updateFilter(key, value ?? null);
    });
  };

  const handleReset = () => {
    form.resetFields();
    resetFilters();
  };

  const renderField = (def) => {
    const label = t(def.labelKey);
    const placeholder = def.placeholder
      ? def.placeholder.startsWith('catalog.')
        ? t(def.placeholder)
        : def.placeholder
      : undefined;

    if (def.type === 'range') {
      return (
        <Form.Item key={def.key} label={label}>
          <div className="flex items-center gap-2">
            <Form.Item name={[def.key, 'min']} noStyle>
              <InputNumber
                className="w-full"
                placeholder={t('catalog.filter.min')}
                min={0}
                step={def.step || 1}
                controls={false}
              />
            </Form.Item>
            <span className="shrink-0 text-gray-400">~</span>
            <Form.Item name={[def.key, 'max']} noStyle>
              <InputNumber
                className="w-full"
                placeholder={t('catalog.filter.max')}
                min={0}
                step={def.step || 1}
                controls={false}
              />
            </Form.Item>
          </div>
        </Form.Item>
      );
    }

    if (def.type === 'select') {
      return (
        <Form.Item key={def.key} name={def.key} label={label}>
          <Select
            allowClear
            placeholder={t('catalog.filter.placeholder.select')}
            options={(def.options || []).map((opt) => ({ value: opt, label: String(opt) }))}
          />
        </Form.Item>
      );
    }

    // number / text
    const input =
      def.type === 'number' ? (
        <InputNumber
          className="w-full"
          placeholder={placeholder}
          min={0}
          step={def.step || 1}
          controls={false}
        />
      ) : (
        <Input placeholder={placeholder} allowClear />
      );

    return (
      <Form.Item key={def.key} name={def.key} label={label}>
        {input}
      </Form.Item>
    );
  };

  const sortOptions = SORT_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.value === '' ? t(opt.labelKey) : t(opt.labelKey),
  }));

  return (
    <Collapse
      defaultActiveKey={['filter']}
      items={[
        {
          key: 'filter',
          label: (
            <span className="flex items-center gap-2 font-medium">
              <FilterOutlined />
              {t('catalog.filter.title')}
            </span>
          ),
          children: (
            <Form
              form={form}
              layout="vertical"
              initialValues={buildInitialValues()}
              onValuesChange={handleValuesChange}
            >
              <Row gutter={[16, 0]}>
                {FILTER_DEFINITIONS.map((def) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={def.key}>
                    {renderField(def)}
                  </Col>
                ))}
              </Row>
              <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{t('catalog.sort.placeholder')}:</span>
                  <Select
                    className="w-44"
                    value={sortBy}
                    onChange={(v) => setSortBy(v || '')}
                    options={sortOptions}
                  />
                </div>
                <div className="ml-auto flex gap-2">
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    {t('common.buttons.reset')}
                  </Button>
                </div>
              </div>
            </Form>
          ),
        },
      ]}
    />
  );
}
