/**
 * components/motor/MotorTable.jsx
 * 后台 CRUD 表格：antd Table + 分页/搜索/新增/编辑 Modal/删除 Popconfirm
 * 表单校验与后端一致：必填 model/frameSize/power/voltage/rpm，数字范围一致
 */
import { useCallback, useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  InputNumber,
  Select,
  Modal,
  Form,
  Row,
  Col,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { App as AntdApp } from 'antd';
import { getMotors, createMotor, updateMotor, deleteMotor } from '../../api/motors';
import { MOTOR_FIELDS, SELECT_FIELD_OPTIONS } from '../../utils/constants';

const { Text } = Typography;

/** 字段级校验规则（与后端 controller 校验一致；空值视为合法，非空才校验） */
function buildRules(field, t) {
  const rules = [];
  if (field.required) {
    rules.push({ required: true, message: t('admin.form.required') });
  }
  if (field.type === 'number') {
    rules.push({
      validator: (_, value) => {
        if (value === null || value === undefined || value === '') return Promise.resolve();
        const num = Number(value);
        if (Number.isNaN(num)) return Promise.reject(new Error(t('admin.form.number')));
        if (field.exclusiveMin && num <= 0) {
          return Promise.reject(new Error(t('admin.form.positive')));
        }
        if (field.min !== undefined && num < field.min) {
          const msg =
            field.max !== undefined
              ? field.max === 100
                ? t('admin.form.range0_100')
                : t('admin.form.range0_1')
              : t('admin.form.nonNegative');
          return Promise.reject(new Error(msg));
        }
        if (field.max !== undefined && num > field.max) {
          return Promise.reject(
            new Error(field.max === 100 ? t('admin.form.range0_100') : t('admin.form.range0_1'))
          );
        }
        return Promise.resolve();
      },
    });
  }
  return rules;
}

/** 渲染表单控件 */
function renderFieldControl(field) {
  if (field.type === 'number') {
    return (
      <InputNumber
        className="w-full"
        placeholder="0"
        min={field.min !== undefined ? field.min : undefined}
        max={field.max !== undefined ? field.max : undefined}
        step={field.step || 1}
        precision={field.step && field.step < 1 ? 2 : 1}
      />
    );
  }
  if (SELECT_FIELD_OPTIONS[field.key]) {
    return (
      <Select
        allowClear
        placeholder="—"
        options={SELECT_FIELD_OPTIONS[field.key].map((opt) => ({ value: opt, label: String(opt) }))}
      />
    );
  }
  if (field.key === 'description') {
    return <Input.TextArea rows={2} placeholder="—" />;
  }
  return <Input placeholder="—" />;
}

/** 清理 payload：剔除空值，数字字段转为 number */
function cleanPayload(values) {
  const payload = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    const field = MOTOR_FIELDS.find((f) => f.key === key);
    payload[key] = field && field.type === 'number' ? Number(value) : value;
  });
  return payload;
}

export default function MotorTable() {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = search ? { model: search } : {};
      const res = await getMotors(filters, '');
      const list = (res && res.data) || [];
      setData(list);
    } catch (e) {
      message.error(e.message || t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [search, message, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMotor(id);
      message.success(t('admin.table.deleted'));
      fetchData();
    } catch (e) {
      message.error(e.message || t('admin.table.deleteFailed'));
    }
  };

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (e) {
      return;
    }
    const payload = cleanPayload(values);
    setSubmitting(true);
    try {
      if (editing) {
        await updateMotor(editing.id, payload);
      } else {
        await createMotor(payload);
      }
      message.success(t('admin.form.submitSuccess'));
      setModalOpen(false);
      fetchData();
    } catch (e) {
      message.error(e.message || t('admin.form.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: t('detail.field.model'), dataIndex: 'model', key: 'model', render: (v) => <Text strong>{v}</Text> },
    { title: t('detail.field.frameSize'), dataIndex: 'frameSize', key: 'frameSize', render: (v) => <Tag>{v}</Tag> },
    { title: t('detail.field.power'), dataIndex: 'power', key: 'power', render: (v) => (v ?? '—') },
    { title: t('detail.field.voltage'), dataIndex: 'voltage', key: 'voltage', render: (v) => (v ?? '—') },
    { title: t('detail.field.rpm'), dataIndex: 'rpm', key: 'rpm', render: (v) => (v ?? '—') },
    { title: t('detail.field.efficiency'), dataIndex: 'efficiency', key: 'efficiency', render: (v) => (v ?? '—') },
    {
      title: t('admin.table.actions'),
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {t('common.buttons.edit')}
          </Button>
          <Popconfirm
            title={t('admin.table.confirmDelete')}
            okText={t('common.buttons.confirm')}
            cancelText={t('common.buttons.cancel')}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              {t('common.buttons.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input.Search
          allowClear
          placeholder={t('admin.table.searchPlaceholder')}
          onSearch={(v) => setSearch(v.trim())}
          style={{ width: 260 }}
          enterButton={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t('admin.table.addButton')}
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 720 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total) => t('catalog.resultCount', { count: total }),
        }}
      />

      <Modal
        open={modalOpen}
        title={editing ? t('admin.form.edit') : t('admin.form.add')}
        okText={t('common.buttons.save')}
        cancelText={t('common.buttons.cancel')}
        confirmLoading={submitting}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={760}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ frequency: 50 }}
          className="mt-4"
        >
          <Row gutter={[16, 0]}>
            {MOTOR_FIELDS.map((field) => (
              <Col xs={24} sm={12} md={8} key={field.key}>
                <Form.Item
                  name={field.key}
                  label={t(field.labelKey)}
                  rules={buildRules(field, t)}
                >
                  {renderFieldControl(field)}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
