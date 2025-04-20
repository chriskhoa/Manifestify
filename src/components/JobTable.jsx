import React, { useRef, useState } from 'react';
import './JobTable.css'

import {
  SearchOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import Highlighter from 'react-highlight-words';
import JobForm from './JobForm.jsx';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;
  if (dataIndex === 'status') {
    inputNode = (
      <Select>
        <Option value="Applied">Applied</Option>
        <Option value="Interviewing">Interviewing</Option>
        <Option value="Rejected">Rejected</Option>
        <Option value="Offer">Offer</Option>
      </Select>
    );
  } else if (dataIndex === 'deadline') {
    inputNode = <Input type="date" />;
  } else {
    inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: false }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const JobTable = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(() => {
    return JSON.parse(localStorage.getItem('my-jobs')) || [];
  });

  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const isEditing = (record) => record.key === editingKey;

  const handleAddJob = (job) => {
    const updatedData = [...dataSource, { ...job, clicks: 0 }];
    setDataSource(updatedData);
    localStorage.setItem('my-jobs', JSON.stringify(updatedData));
  };

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updated = { ...item, ...row };
        newData.splice(index, 1, updated);
        setDataSource(newData);
        localStorage.setItem('my-jobs', JSON.stringify(newData));
        setEditingKey('');
      }
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  const handleClick = (record) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      const updated = {
        ...newData[index],
        clicks: (newData[index].clicks || 0) + 1,
      };
      newData.splice(index, 1, updated);
      setDataSource(newData);
      localStorage.setItem('my-jobs', JSON.stringify(newData));
    }
  };

  const handleStatusChange = (value, record) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      newData[index].status = value;
      setDataSource(newData);
      localStorage.setItem('my-jobs', JSON.stringify(newData));
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          name = "keyword"
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    localStorage.setItem('my-jobs', JSON.stringify(newData));
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
      editable: true,
      ...getColumnSearchProps('company'),
      className: 'col-company',
    },
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      editable: true,
      className: 'col-jobtitle',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Job Link',
      dataIndex: 'job_link',
      key: 'job_link',
      editable: true,
      className: 'col-joblink',
    },
    {
      title: 'Date added',
      dataIndex: 'key',
      editable: false,
      className: 'col-dateadded',
      sorter: (a, b) => Number(a.key) - Number(b.key),
      render: (key) => new Date(Number(key)).toLocaleDateString(),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'col-status',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(value, record)}
          style={{ width: 120 }}
        >
          <Option value="Applied">Applied</Option>
          <Option value="Interviewing">Interviewing</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Offer">Offer</Option>
        </Select>
      ),
    },
    {
      title: 'Manifest it 🙏 ',
      dataIndex: 'clicks',
      className: 'col-clicks',
      sorter: (a, b) => a.clicks - b.clicks,
      render: (_, record) => (
        <div
          onClick={() => handleClick(record)}
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            transform: 'scale(1)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(1.5)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🙏 {record.clicks || 0}
        </div>
      ),
    },
    {
      title: 'Notes',
      className: 'col-notes',
      dataIndex: 'notes',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      className: 'col-actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              <SaveOutlined />
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a style={{ marginRight: 8 }}>
                <CloseOutlined />
              </a>
            </Popconfirm>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a style={{ color: 'red' }}>
                🗑
              </a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              <EditOutlined />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a style={{ color: 'red' }}>
                🗑
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === 'deadline'
            ? 'date'
            : col.dataIndex === 'status'
              ? 'select'
              : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <JobForm setJobItems={handleAddJob} />
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <p style={{ margin: 0 }}>{record.notes}</p>
        //   ),
        // }}
        />
      </Form>
    </>
  );
};

export default JobTable;
