/**
 * pages/About.jsx
 * 关于页：项目介绍 + 技术栈
 */
import { Card, Row, Col, Tag, Typography, Divider } from 'antd';
import {
  ThunderboltFilled,
  CodeOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <ThunderboltFilled className="text-3xl" />
        </div>
        <Title level={2} className="!mb-2">{t('about.title')}</Title>
      </div>

      <Card className="!rounded-2xl">
        <Paragraph className="text-base leading-relaxed text-gray-700">{t('about.p1')}</Paragraph>
        <Paragraph className="text-base leading-relaxed text-gray-700">{t('about.p2')}</Paragraph>
        <Paragraph className="text-base leading-relaxed text-gray-700">{t('about.p3')}</Paragraph>

        <Divider />

        <Title level={4}>{t('about.tech.title')}</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" className="!rounded-xl">
              <div className="flex items-center gap-2 font-medium">
                <CodeOutlined className="text-primary-600" />
                {t('about.tech.frontend')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {['React 18', 'Vite 5', 'Ant Design 5', 'Tailwind CSS 3', 'Three.js / R3F', 'i18next'].map((tech) => (
                  <Tag key={tech} color="blue">{tech}</Tag>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" className="!rounded-xl">
              <div className="flex items-center gap-2 font-medium">
                <DatabaseOutlined className="text-primary-600" />
                {t('about.tech.backend')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Node.js', 'Express', 'SQLite', 'JWT Auth'].map((tech) => (
                  <Tag key={tech} color="green">{tech}</Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>{t('about.tech.features')}</Title>
        <Row gutter={[12, 12]}>
          {t('about.features', { returnObjects: true }).map((feature) => (
            <Col xs={24} sm={12} key={feature}>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-700">
                <CheckCircleOutlined className="text-green-500" />
                {feature}
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
