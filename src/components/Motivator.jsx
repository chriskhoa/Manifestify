import motivationMessage from "../util/motivationMessage";
import { useState } from "react";
import styles from "./Motivator.module.css";

/**
 * Motivator Component
 *
 * Displays a motivational quote from a predefined list and allows users
 * to cycle through quotes by clicking the "Generate" button.
 *
 * @component
 * @example
 * return (
 *   <Motivator />
 * )
 */
const Motivator = () => {
  /**
   * Index of the current motivational message being displayed.
   * @type {[number, Function]}
   */
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.box}>
      <h2>When in doubt, remember</h2>
      <p className={styles.quote}>{motivationMessage[index]}</p>
      <button
        onClick={() =>
          setIndex((prev) => (prev + 1) % motivationMessage.length)
        }
      >
        Generate
      </button>
    </div>
  );
};

export default Motivator;
