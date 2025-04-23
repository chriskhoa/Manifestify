import streakMessages from "../util/streakMessages";
import styles from "./Streak.module.css";

/**
 * Streak Component
 *
 * Displays the user's current job application streak, along with a motivational
 * message and a fun emoji based on the streak count.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.streak - The current number of job applications submitted
 * @returns {JSX.Element} Rendered Streak component
 *
 * @example
 * return <Streak streak={5} />
 */
const Streak = ({ streak }) => {
  const matchedMessage = streakMessages.find((item) => item.id === streak);

  return (
    <div className={styles.box}>
      <h2>Application streak</h2>
      <p className={styles.streak}>{streak}</p>
      <p>
        {matchedMessage
          ? matchedMessage.message
          : `Application ${streak}: Keep going!`}
      </p>
      <p className={styles.emoji}>
        {matchedMessage ? matchedMessage.emoji : "🌟"}
      </p>
    </div>
  );
};

export default Streak;
