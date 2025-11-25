import React, { useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const EditForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const {
    open,
    onCancel,
    onOk,
    confirmLoading,
    currentRowData,
  } = props;
  
  useImperativeHandle(ref, () => form);
  
  // 当弹窗打开且 currentRowData 有值时，设置表单值
  useEffect(() => {
    if (open && currentRowData && currentRowData.id !== undefined) {
      const { id, author, date, readings, star, status, title } = currentRowData;
      form.setFieldsValue({
        id,
        title: title || '',
        author: author || '',
        readings: readings || 0,
        star: star ? star.length : 0,
        status: status || 'published',
        date: date ? dayjs(date, "YYYY-MM-DD HH:mm:ss") : null,
      });
    }
  }, [open, currentRowData?.id]);
  
  // 弹窗关闭时重置表单
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);
  
  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 16 },
    },
  };
  
  return (
    <Modal
      title="编辑"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      afterOpenChange={(visible) => {
        if (visible && currentRowData && currentRowData.id !== undefined) {
          const { id, author, date, readings, star, status, title } = currentRowData;
          form.setFieldsValue({
            id,
            title: title || '',
            author: author || '',
            readings: readings || 0,
            star: star ? star.length : 0,
            status: status || 'published',
            date: date ? dayjs(date, "YYYY-MM-DD HH:mm:ss") : null,
          });
        }
      }}
    >
      <Form 
        {...formItemLayout} 
        form={form} 
        preserve={false}
        key={currentRowData?.id || 'new'}
        initialValues={currentRowData && currentRowData.id !== undefined ? {
          id: currentRowData.id,
          title: currentRowData.title || '',
          author: currentRowData.author || '',
          readings: currentRowData.readings || 0,
          star: currentRowData.star ? currentRowData.star.length : 0,
          status: currentRowData.status || 'published',
          date: currentRowData.date ? dayjs(currentRowData.date, "YYYY-MM-DD HH:mm:ss") : null,
        } : undefined}
      >
        <Form.Item label="序号:" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item 
          label="标题:" 
          name="title" 
          rules={[{ required: true, message: "请输入标题!" }]}
        >
          <Input placeholder="标题" />
        </Form.Item>
        <Form.Item label="作者:" name="author">
          <Input disabled />
        </Form.Item>
        <Form.Item label="阅读量:" name="readings">
          <Input disabled />
        </Form.Item>
        <Form.Item label="推荐指数:" name="star">
          <Rate count={3} />
        </Form.Item>
        <Form.Item label="状态:" name="status">
          <Select style={{ width: 120 }}>
            <Select.Option value="published">published</Select.Option>
            <Select.Option value="draft">draft</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item 
          label="时间:" 
          name="date" 
          rules={[{ type: 'object', required: true, message: '请选择时间!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditForm;
