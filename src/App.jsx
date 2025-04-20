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

function App() {
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
      <h1>Manifestify</h1>
      <>
        <Motivator />
        <Streak streak={streak} />
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
        <JobForm setJobItems={handleAddJob} />
        <JobTable
          setStreak={setStreak}
          setProgressValue={setProgressValue}
          setPercent={setPercent}
          goalValue={goalValue}
          dataSource={dataSource}
          setDataSource={setDataSource}
        />
      </>
    </>
  );
}

export default App;
