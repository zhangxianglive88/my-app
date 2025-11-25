import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  Divider,
  message,
  Select
} from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { tableList, deleteItem, editItem } from "@/api/table";
import EditForm from "./forms/editForm";

const { Column } = Table;
const { Panel } = Collapse;

const TableComponent = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [listQuery, setListQuery] = useState({
    pageNumber: 1,
    pageSize: 10,
    title: "",
    star: "",
    status: ""
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({
    id: 0,
    author: "",
    date: "",
    readings: 0,
    star: "★",
    status: "published",
    title: ""
  });

  const formRef = useRef(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    tableList(listQuery).then((response) => {
      setLoading(false);
      const items = response.data.data.items;
      const totalCount = response.data.data.total;
      setList(items);
      setTotal(totalCount);
    });
  }, [listQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterTitleChange = (e) => {
    const value = e.target.value;
    setListQuery(prev => ({
      ...prev,
      title: value,
    }));
  };

  const filterStatusChange = (value) => {
    setListQuery(prev => ({
      ...prev,
      status: value || "",
    }));
  };

  const filterStarChange = (value) => {
    setListQuery(prev => ({
      ...prev,
      star: value || "",
    }));
  };

  // 清空所有筛选条件
  const handleClearFilters = () => {
    setListQuery({
      pageNumber: 1,
      pageSize: 10,
      title: "",
      star: "",
      status: ""
    });
  };

  const changePage = (pageNumber, pageSize) => {
    setListQuery(prev => ({
      ...prev,
      pageNumber,
    }));
  };

  const changePageSize = (current, pageSize) => {
    setListQuery(prev => ({
      ...prev,
      pageNumber: 1,
      pageSize,
    }));
  };

  const handleDelete = (row) => {
    deleteItem({ id: row.id }).then(res => {
      message.success("删除成功");
      fetchData();
    });
  };

  const handleEdit = (row) => {
    // 先设置数据，再打开弹窗，确保数据已经准备好
    setCurrentRowData({ ...row });
    setEditModalVisible(true);
  };

  const handleOk = () => {
    formRef.current?.validateFields().then((fieldsValue) => {
      const values = {
        ...fieldsValue,
        'star': "".padStart(fieldsValue['star'], '★'),
        'date': fieldsValue['date'].format('YYYY-MM-DD HH:mm:ss'),
      };
      setEditModalLoading(true);
      editItem(values).then((response) => {
        formRef.current?.resetFields();
        setEditModalVisible(false);
        setEditModalLoading(false);
        message.success("编辑成功!");
        fetchData();
      }).catch(e => {
        setEditModalLoading(false);
        message.error("编辑失败,请重试!");
      });
    }).catch(err => {
      // 验证失败
    });
  };

  const handleCancel = () => {
    setEditModalVisible(false);
  };

  return (
    <div className="app-container">
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="筛选" key="1">
          <Form layout="inline">
            <Form.Item label="标题:">
              <Input
                value={listQuery.title}
                onChange={filterTitleChange}
                allowClear
                placeholder="请输入标题"
              />
            </Form.Item>
            <Form.Item label="类型:">
              <Select
                style={{ width: 120 }}
                value={listQuery.status || undefined}
                onChange={filterStatusChange}
                allowClear
                placeholder="请选择类型">
                <Select.Option value="published">published</Select.Option>
                <Select.Option value="draft">draft</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="推荐指数:">
              <Select
                style={{ width: 120 }}
                value={listQuery.star || undefined}
                onChange={filterStarChange}
                allowClear
                placeholder="请选择推荐指数">
                <Select.Option value={1}>★</Select.Option>
                <Select.Option value={2}>★★</Select.Option>
                <Select.Option value={3}>★★★</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                清空
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      <br />
      <Table
        bordered
        rowKey={(record) => record.id}
        dataSource={list}
        loading={loading}
        pagination={false}
      >
        <Column title="序号" dataIndex="id" key="id" width={200} align="center" sorter={(a, b) => a.id - b.id} />
        <Column title="标题" dataIndex="title" key="title" width={200} align="center" />
        <Column title="作者" dataIndex="author" key="author" width={100} align="center" />
        <Column title="阅读量" dataIndex="readings" key="readings" width={195} align="center" />
        <Column title="推荐指数" dataIndex="star" key="star" width={195} align="center" />
        <Column title="状态" dataIndex="status" key="status" width={195} align="center" render={(status) => {
          let color =
            status === "published" ? "green" : status === "deleted" ? "red" : "";
          return (
            <Tag color={color} key={status}>
              {status}
            </Tag>
          );
        }} />
        <Column title="时间" dataIndex="date" key="date" width={195} align="center" />
        <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="编辑" onClick={() => handleEdit(row)} />
            <Divider type="vertical" />
            <Button type="primary" shape="circle" icon={<DeleteOutlined />} title="删除" onClick={() => handleDelete(row)} />
          </span>
        )} />
      </Table>
      <br />
      <Pagination
        total={total}
        pageSizeOptions={["10", "20", "40"]}
        showTotal={(total) => `共${total}条数据`}
        onChange={changePage}
        current={listQuery.pageNumber}
        onShowSizeChange={changePageSize}
        showSizeChanger
        showQuickJumper
        hideOnSinglePage={true}
      />
      <EditForm
        currentRowData={currentRowData}
        ref={formRef}
        open={editModalVisible}
        confirmLoading={editModalLoading}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
};

export default TableComponent;
