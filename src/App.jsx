import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import "./App.css";
import Motivator from "./components/Motivator";
import DailyGoal from "./components/DailyGoal";
import Streak from "./components/Streak.jsx";
import JobTable from "./components/JobTable.jsx";
import JobForm from "./components/JobForm.jsx";
import "@ant-design/v5-patch-for-react-19";
import { Layout, Row, Col } from "antd";

/**
 * App Component
 *
 * Main container for the job application tracker app.
 * Includes layout for setting goals, tracking streaks, job submissions,
 * and a motivational message.
 *
 * @component
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  const { Content } = Layout;

  /**
   * State to track the user's current streak of submitted applications.
   * Initialized from localStorage if available.
   * @type {[number, Function]}
   */
  const [streak, setStreak] = useState(
    localStorage.getItem("my-jobs")
      ? JSON.parse(localStorage.getItem("my-jobs")).filter(
          (item) => item.status !== "Not submitted"
        ).length
      : 0
  );

  /** @type {[number, Function]} */
  const [goalValue, setGoalValue] = useState(1);

  /** @type {[boolean, Function]} */
  const [goalSet, setGoalSet] = useState(false);

  /** @type {[number, Function]} */
  const [progressValue, setProgressValue] = useState(0);

  /** @type {[number, Function]} */
  const [percent, setPercent] = useState(0);

  /**
   * State to hold all job entries submitted by the user.
   * Initialized from localStorage if available.
   * @type {[Array<Object>, Function]}
   */
  const [dataSource, setDataSource] = useState(() => {
    return JSON.parse(localStorage.getItem("my-jobs")) || [];
  });

  /**
   * Adds a new job entry to the data source and saves it to localStorage.
   *
   * @param {Object} job - The job entry object to add
   */
  const handleAddJob = (job) => {
    const updatedData = [...dataSource, { ...job, clicks: 0 }];
    setDataSource(updatedData);
    localStorage.setItem("my-jobs", JSON.stringify(updatedData));
  };

  return (
    <>
      {/* Ant Design Layout https://ant.design/components/layout */}
      <h1 style={{ textAlign: "center", margin: "24px 0" }}>Manifestify</h1>
      <Layout
        style={{ background: "#fff", minHeight: "100vh", padding: "24px" }}
      >
        <Content>
          {/* Top section with 3 columns */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <JobForm setJobItems={handleAddJob} />
            </Col>
            <Col xs={24} md={8}>
              <Streak streak={streak} />
              <Motivator />
            </Col>
            <Col xs={24} md={8}>
              <DailyGoal
                goalValue={goalValue}
                setGoalValue={setGoalValue}
                goalSet={goalSet}
                setGoalSet={setGoalSet}
                progressValue={progressValue}
                setProgressValue={setProgressValue}
                percent={percent}
                setPercent={setPercent}
              />
            </Col>
          </Row>

          {/* Bottom section with table */}
          <Row style={{ marginTop: "32px" }}>
            <Col span={24}>
              <JobTable
                setStreak={setStreak}
                setProgressValue={setProgressValue}
                setPercent={setPercent}
                goalValue={goalValue}
                dataSource={dataSource}
                setDataSource={setDataSource}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}

export default App;
