import motivationMessage from "../util/motivationMessage";
import { useState } from "react";
import styles from "./Motivator.module.css";

const Motivator = () => {
  const [index, setIndex] = useState(0);
  console.log(index);
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
