import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Streak from "./components/Streak.jsx";
import JobTable from "./components/JobTable.jsx";
import "@ant-design/v5-patch-for-react-19";

function App() {
  const [streak, setStreak] = useState(0);
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
        <JobTable setStreak={setStreak} />
      </>
    </>
  );
}

export default App;
