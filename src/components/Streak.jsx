import { useState } from "react";
import streakMessages from "../util/streakMessages";

const Streak = () => {
  const [streak, setStreak] = useState(0);
  return (
    <div>
      <h2>{streak}</h2>
      <p>
        {streakMessages.find((item) => item.id === streak)
          ? streakMessages.find((item) => item.id === streak).message
          : "no"}
      </p>
      <p>
        {streakMessages.find((item) => item.id === streak)
          ? streakMessages.find((item) => item.id === streak).emoji
          : "no"}
      </p>
      <button onClick={() => setStreak((prev) => prev + 1)}>Test</button>
    </div>
  );
};

export default Streak;
