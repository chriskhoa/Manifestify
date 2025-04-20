import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Streak from "./components/streak";
import JobTable from "./components/JobTable.jsx";
import "@ant-design/v5-patch-for-react-19";

function App() {
  return (
    <>
      <h1>Manifestify</h1>
      <>
        <Streak />
        <JobTable />
      </>
    </>
  );
}

export default App;
