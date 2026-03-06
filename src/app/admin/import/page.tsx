'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        droppedFile.type === 'application/vnd.ms-excel' ||
        droppedFile.name.endsWith('.xlsx') ||
        droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: {
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(data.error || '导入失败');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败，请检查网络连接');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        '型号': 'Y2-90S-2',
        '机座号': '90S',
        '功率': 1.5,
        '电压': 380,
        '电流': 3.4,
        '转速': 2840,
        '效率': 82.5,
        '功率因数': 0.85,
        '频率': 50,
        '极数': 2,
        '防护等级': 'IP54',
        '绝缘等级': 'F',
        '安装方式': 'B3',
        '重量': 22,
        '接法': 'Y',
        '堵转转矩': 2.2,
        '最大转矩': 2.3,
        '启动电流': 7,
        '噪声': 68,
        '描述': '三相异步电动机，适用于一般传动',
        '图片': '',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '产品数据');
    XLSX.writeFile(wb, '电机产品导入模板.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回后台
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">产品批量导入</h1>
              <p className="text-sm text-muted-foreground">通过Excel文件批量导入电机产品数据</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">上传文件</TabsTrigger>
            <TabsTrigger value="template">模板说明</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  上传Excel文件
                </CardTitle>
                <CardDescription>
                  支持 .xlsx 和 .xls 格式的Excel文件
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    file
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    {file ? (
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">
                          拖拽文件到此处，或点击选择文件
                        </p>
                        <p className="text-sm text-muted-foreground">
                          支持 .xlsx 和 .xls 格式
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleImport}
                    disabled={!file || importing}
                    className="flex-1"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        导入中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        开始导入
                      </>
                    )}
                  </Button>
                  {file && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      清除
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Import Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>导入结果</CardTitle>
                  <CardDescription>
                    {result.success === result.total
                      ? '所有数据导入成功！'
                      : `成功 ${result.success} 条，失败 ${result.failed} 条`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.total}
                      </div>
                      <div className="text-sm text-muted-foreground">总数</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.success}
                      </div>
                      <div className="text-sm text-muted-foreground">成功</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {result.failed}
                      </div>
                      <div className="text-sm text-muted-foreground">失败</div>
                    </div>
                  </div>

                  {result.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>导入错误</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          {result.errors.slice(0, 10).map((error, index) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                          {result.errors.length > 10 && (
                            <li className="text-sm">
                              还有 {result.errors.length - 10} 条错误未显示...
                            </li>
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Link href="/admin/products" className="flex-1">
                      <Button className="w-full">
                        查看产品列表
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setResult(null)}
                    >
                      继续导入
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>导入模板说明</CardTitle>
                <CardDescription>
                  请按照以下格式准备Excel文件
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>提示</AlertTitle>
                  <AlertDescription>
                    下载模板文件，按照示例格式填写数据。除"型号"和"功率"为必填项外，其他字段可选。
                  </AlertDescription>
                </Alert>

                <Button onClick={downloadTemplate} className="gap-2">
                  <Download className="h-4 w-4" />
                  下载Excel模板
                </Button>

                <div className="space-y-4">
                  <h3 className="font-semibold">字段说明</h3>
                  <div className="grid gap-2 text-sm">
                    {[
                      { name: '型号', required: true, desc: '产品型号，必填，唯一' },
                      { name: '机座号', required: false, desc: '如：90S、100L等' },
                      { name: '功率', required: true, desc: '单位：kW，必填，大于0' },
                      { name: '电压', required: false, desc: '单位：V，如：380' },
                      { name: '电流', required: false, desc: '单位：A' },
                      { name: '转速', required: false, desc: '单位：rpm' },
                      { name: '效率', required: false, desc: '百分比，如：85.5' },
                      { name: '功率因数', required: false, desc: '0-1之间的小数' },
                      { name: '频率', required: false, desc: '单位：Hz，如：50' },
                      { name: '极数', required: false, desc: '如：2、4、6、8' },
                      { name: '防护等级', required: false, desc: '如：IP54' },
                      { name: '绝缘等级', required: false, desc: '如：F' },
                      { name: '安装方式', required: false, desc: '如：B3、B5' },
                      { name: '重量', required: false, desc: '单位：kg' },
                      { name: '接法', required: false, desc: '如：Y、△' },
                      { name: '堵转转矩', required: false, desc: '倍数，如：2.2' },
                      { name: '最大转矩', required: false, desc: '倍数，如：2.3' },
                      { name: '启动电流', required: false, desc: '倍数，如：7' },
                      { name: '噪声', required: false, desc: '单位：dB' },
                      { name: '描述', required: false, desc: '产品描述' },
                      { name: '图片', required: false, desc: '图片URL' },
                    ].map((field, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        {field.required ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{field.name}</span>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">必填</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1">{field.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertTitle>注意事项</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>第一行为表头，包含字段名称</li>
                      <li>从第二行开始填写实际数据</li>
                      <li>型号不能重复，否则会导入失败</li>
                      <li>数值字段请填写数字，不要添加单位</li>
                      <li>日期格式请使用标准格式：YYYY-MM-DD</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
