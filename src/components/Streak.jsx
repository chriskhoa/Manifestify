import { useState } from "react";
import streakMessages from "../util/streakMessages";
import styles from "./Streak.module.css";

const Streak = ({ streak }) => {
  // const [streak, setStreak] = useState(0);
  return (
    <div className={styles.box}>
      <h2>Application streak</h2>
      <p className={styles.streak}>{streak}</p>
      <p>
        {streakMessages.find((item) => item.id === streak)
          ? streakMessages.find((item) => item.id === streak).message
          : `Application ${streak}: Keep going!`}
      </p>
      <p className={styles.emoji}>
        {streakMessages.find((item) => item.id === streak)
          ? streakMessages.find((item) => item.id === streak).emoji
          : "🌟"}
      </p>
      {/* <button onClick={() => setStreak((prev) => prev + 1)}>Test</button> */}
    </div>
  );
};

export default Streak;
