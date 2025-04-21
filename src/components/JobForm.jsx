import React, { useState } from "react";
import { CloudSyncOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input } from "antd";
import styles from "./JobForm.module.css";

const { TextArea } = Input;

const JobForm = ({ setJobItems }) => {
  const [form] = Form.useForm();

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const addJob = () => {
    if (company && title) {
      const newJob = {
        key: Date.now().toString(), // Make sure it has a key for Ant Design Table
        company,
        title,
        job_link: link,
        deadline: deadline ? deadline.format("YYYY-MM-DD") : "Rolling",
        notes,
        status: status ? status : "Not submitted",
      };

      setJobItems(newJob); // Just pass the object

      // Reset fields
      setCompany("");
      setTitle("");
      setLink("");
      setDeadline(null);
      setNotes("");
      setStatus("");
      // setDate('');
      form.resetFields();
    }
  };

  return (
    <div className={styles.box}>
      <h2>Add an application</h2>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="company" label="Company">
          <Input
            autoComplete="company"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="title" label="Job Title">
          <Input
            autoComplete="job-title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="link" label="Job Link">
          <Input
            autoComplete="job-link"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="deadline" label="Deadline">
          <DatePicker
            id="deadline"
            autoComplete="deadline"
            value={deadline}
            onChange={(date) => setDeadline(date)}
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <TextArea
            id="notes"
            autoComplete="notes"
            name="notes"
            value={notes}
            rows={4}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Item>
        <Form.Item type="primary" onClick={addJob}>
          <Button type="primary">Add Job</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default JobForm;
