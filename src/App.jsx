import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Streak from "./components/streak";

function App() {
  return (
    <>
      <h1>Manifestify</h1>
      <Streak />
    </>
  );
}

export default App;
