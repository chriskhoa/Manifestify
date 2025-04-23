import React, { useState } from "react";
import { Button, DatePicker, Form, Input } from "antd";
import styles from "./JobForm.module.css";

//This code follows code examples at "https://ant.design/components/form"

const { TextArea } = Input;

/**
 * JobForm component allows users to add a new job application.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.setJobItems - Function to update the job list with a new job object.
 * @returns {JSX.Element} The rendered form component.
 */
const JobForm = ({ setJobItems }) => {
  /** Ant Design form instance for controlling form behavior */
  const [form] = Form.useForm();

  /** @type {[string, Function]} Company input and setter */
  const [company, setCompany] = useState("");

  /** @type {[string, Function]} Job title input and setter */
  const [title, setTitle] = useState("");

  /** @type {[string, Function]} Job link input and setter */
  const [link, setLink] = useState("");

  /** @type {[moment.Moment | null, Function]} Deadline input and setter */
  const [deadline, setDeadline] = useState("");

  /** @type {[string, Function]} Notes input and setter */
  const [notes, setNotes] = useState("");
  /** @type {[string, Function]} Status input and setter */
  const [status, setStatus] = useState("");

  /**
 * Handles creating and submitting a new job object to the parent component.
 * Resets the form upon successful submission.
 */
  const addJob = () => {
    if (company && title) {
      const newJob = {
         /** Unique identifier for Ant Design Table rows */
        key: Date.now().toString(),
        company,
        title,
        job_link: link,
         /** Format deadline or fallback to "Rolling" */
        deadline: deadline ? deadline.format("YYYY-MM-DD") : "Rolling",
        notes,
        /** Default status to "Not submitted" */
        status: status ? status : "Not submitted",
      };

      setJobItems(newJob); // Pass new job object to parent state

       // Reset form fields
      setCompany("");
      setTitle("");
      setLink("");
      setDeadline(null);
      setNotes("");
      setStatus("");
      form.resetFields(); // Resets Ant Design controlled form inputs
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
