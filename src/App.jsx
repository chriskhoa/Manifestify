import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DailyGoal from "./components/DailyGoal";

function App() {
  return (
    <>
      <h1>Manifestify</h1>
      <DailyGoal />
    </>
  );
}

export default App;
