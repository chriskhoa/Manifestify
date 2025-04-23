
import React, { useRef, useState } from "react";
import "./JobTable.css";
import {
  SearchOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
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
} from "antd";
import Highlighter from "react-highlight-words";

const { Option } = Select;
/**
 * Renders an editable table cell.
 *
 * @param {Object} props
 * @param {boolean} props.editing - Whether the row is currently being edited.
 * @param {string} props.dataIndex - Data index of the column.
 * @param {string} props.title - Column title.
 * @param {string} props.inputType - Type of input field.
 * @param {Object} props.record - The data record.
 * @param {number} props.index - Row index.
 * @param {React.ReactNode} props.children - Default cell content.
 */
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
  if (dataIndex === "status") {
    inputNode = (
      <Select>
        <Option value="Not submitted">Not submitted</Option>
        <Option value="Applied">Applied</Option>
        <Option value="Interviewing">Interviewing</Option>
        <Option value="Rejected">Rejected</Option>
        <Option value="Offer">Offer</Option>
      </Select>
    );
  } else if (dataIndex === "deadline") {
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

/**
 * JobTable Component
 * Displays and manages an editable job application tracking table.
 * 
 * @component
 * @param {Function} setStreak - Function to update the number of submitted jobs.
 * @param {Function} setProgressValue - Function to update today's progress value.
 * @param {Function} setPercent - Function to update progress percent.
 * @param {number} goalValue - Total job submission goal for the day.
 * @param {Array} dataSource - Array of job data records.
 * @param {Function} setDataSource - Function to update job data.
 */
const JobTable = ({
  setStreak,
  setProgressValue,
  setPercent,
  goalValue,
  dataSource,
  setDataSource,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  
  /** Checks if a row is being edited. */
  const isEditing = (record) => record.key === editingKey;

  /** Enables editing mode for the selected record. */
  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

    /** Cancels editing. */
  const cancel = () => {
    setEditingKey("");
  };

   /**
   * Saves edited record and updates local storage.
   * 
   * @param {string} key - Unique key of the record being saved.
   */
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
        localStorage.setItem("my-jobs", JSON.stringify(newData));
        setEditingKey("");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  
  /**
   * Increments the "manifest it 🙏" click count.
   * 
   * @param {Object} record - Job record.
   */

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
      localStorage.setItem("my-jobs", JSON.stringify(newData));
    }
  };

    /**
   * Updates status and adjusts streak/progress values.
   * 
   * @param {string} value - New status.
   * @param {Object} record - Job record.
   */

  const handleStatusChange = (value, record) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      newData[index].status = value;
      setDataSource(newData);
      localStorage.setItem("my-jobs", JSON.stringify(newData));
    }
  };

  /** Executes a search within a column. */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
    
  /** Resets search input for a column. */
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  /**
   * Returns column search props for a given column.
   * 
   * @param {string} dataIndex
   */
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
          name="keyword"
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
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
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });


  /**
   * Deletes a job record.
   * 
   * @param {string} key - Record key.
   */

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    localStorage.setItem("my-jobs", JSON.stringify(newData));
  };

  // Column definitions
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      editable: true,
      ...getColumnSearchProps("company"),
      className: "col-company",
    },
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      editable: true,
      className: "col-jobtitle",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Job Link",
      dataIndex: "job_link",
      key: "job_link",
      editable: true,
      className: "col-joblink",
      render: (text) => {
        return text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          ""
        );
      },
    },
    {
      title: "Date added",
      dataIndex: "key",
      editable: false,
      className: "col-dateadded",
      sorter: (a, b) => Number(a.key) - Number(b.key),
      render: (key) => new Date(Number(key)).toLocaleDateString(),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      editable: true,
      className: "col-deadline",
    },
    {
      title: "Status",
      dataIndex: "status",
      className: "col-status",
      render: (_, record) => (
        <div
          className={`status-wrapper status-${
            record.status?.toLowerCase() || ""
          }`}
        >
          <Select
            value={record.status}
            onChange={(value) => {
              handleStatusChange(value, record);

              // Update streak and progress
              setStreak(
                JSON.parse(localStorage.getItem("my-jobs")).filter(
                  (item) => item.status !== "Not submitted"
                ).length
              );
              setProgressValue((prevProgressValue) => {
                if (value === "Applied") {
                  const newProgressValue = prevProgressValue + 1;
                  localStorage.setItem(
                    "todayProgress",
                    JSON.stringify(newProgressValue)
                  );
                  return newProgressValue;
                } else if (value === "Not submitted") {
                  const newProgressValue = prevProgressValue - 1;
                  localStorage.setItem(
                    "todayProgress",
                    JSON.stringify(newProgressValue)
                  );
                  return newProgressValue;
                } else {
                  return JSON.parse(localStorage.getItem("todayProgress"));
                }
              });
              setPercent((prevPercent) => {
                if (value === "Applied") {
                  const newPercent = prevPercent + (1 / goalValue) * 100;
                  if (newPercent > 99.99) {
                    localStorage.setItem("todayPercent", JSON.stringify(100));
                    return 100;
                  }
                  localStorage.setItem(
                    "todayPercent",
                    JSON.stringify(newPercent)
                  );
                  return newPercent;
                } else if (value === "Not submitted") {
                  const newPercent = prevPercent - (1 / goalValue) * 100;
                  if (newPercent > 99.99) {
                    localStorage.setItem("todayPercent", JSON.stringify(100));
                    return 100;
                  }
                  localStorage.setItem(
                    "todayPercent",
                    JSON.stringify(newPercent)
                  );
                  return newPercent;
                } else {
                  return JSON.parse(localStorage.getItem("todayPercent"));
                }
              });
            }}
            style={{ width: 120 }}
          >
            <Option value="Not submitted">Not submitted</Option>
            <Option value="Applied">Applied</Option>
            <Option value="Interviewing">Interviewing</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Offer">Offer</Option>
          </Select>
        </div>
      ),
    },
    {
      title: "Manifest it 🙏 ",
      dataIndex: "clicks",
      className: "col-clicks",
      sorter: (a, b) => a.clicks - b.clicks,
      render: (_, record) => (
        <div
          onClick={() => handleClick(record)}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            transform: "scale(1)",
            transition: "transform 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🙏 {record.clicks || 0}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "operation",
      className: "col-actions",
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
              onConfirm={() => {
                handleDelete(record.key);
                setStreak(
                  JSON.parse(localStorage.getItem("my-jobs")).filter(
                    (item) => item.status !== "Not submitted"
                  ).length
                );
              }}
            >
              <a style={{ color: "red" }}>🗑</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <EditOutlined />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                handleDelete(record.key);
                setStreak(
                  JSON.parse(localStorage.getItem("my-jobs")).filter(
                    (item) => item.status !== "Not submitted"
                  ).length
                );
              }}
            >
              <a style={{ color: "red" }}>🗑</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Adding an onCell function to editable columns so the table knows how to render an editable cell when you're editing a row.
  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "deadline"
            ? "date"
            : col.dataIndex === "status"
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
          expandable={{
            expandedRowRender: (record) => {
              const editing = isEditing(record);
              return editing ? (
                <Form.Item name="notes" style={{ margin: 0 }}>
                  <Input.TextArea
                    placeholder="Enter notes here"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </Form.Item>
              ) : (
                <div style={{ padding: "10px 0" }}>
                  <strong>Notes:</strong> {record.notes || "No notes yet"}
                </div>
              );
            },
            rowExpandable: () => true,
          }}
        />
      </Form>
    </>
  );
};

export default JobTable;
