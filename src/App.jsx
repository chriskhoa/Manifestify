import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DailyGoal from "./components/DailyGoal";
import Streak from "./components/Streak.jsx";
import JobTable from "./components/JobTable.jsx";
import "@ant-design/v5-patch-for-react-19";

function App() {
  const [streak, setStreak] = useState(0);
  const [goalValue, setGoalValue] = useState(1);
  const [goalSet, setGoalSet] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setStreak(
      JSON.parse(localStorage.getItem("my-jobs")).filter(
        (item) => item.status !== "Not submitted"
      ).length
    );
  }, []);
  return (
    <>
      <h1>Manifestify</h1>
      <>
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
        <JobTable
          setStreak={setStreak}
          setProgressValue={setProgressValue}
          setPercent={setPercent}
          goalValue={goalValue}
        />
      </>
    </>
  );
}

export default App;
