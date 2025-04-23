import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Motivator from "./components/Motivator";
import DailyGoal from "./components/DailyGoal";
import Streak from "./components/Streak.jsx";
import JobTable from "./components/JobTable.jsx";
import "@ant-design/v5-patch-for-react-19";
import JobForm from "./components/JobForm.jsx";
import { Layout, Row, Col } from "antd";

function App() {
  const { Content } = Layout;
  const [streak, setStreak] = useState(0);
  const [goalValue, setGoalValue] = useState(1);
  const [goalSet, setGoalSet] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [percent, setPercent] = useState(0);
  const [dataSource, setDataSource] = useState(() => {
    return JSON.parse(localStorage.getItem("my-jobs")) || [];
  });

  const handleAddJob = (job) => {
    const updatedData = [...dataSource, { ...job, clicks: 0 }];
    setDataSource(updatedData);
    localStorage.setItem("my-jobs", JSON.stringify(updatedData));
  };

  useEffect(() => {
    setStreak(
      localStorage.getItem("my-jobs")
        ? JSON.parse(localStorage.getItem("my-jobs")).filter(
            (item) => item.status !== "Not submitted"
          ).length
        : 0
    );
  }, []);
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
