import motivationMessage from "../util/motivationMessage";
import { useState } from "react";

const Motivator = () => {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <h2>When in doubt, remember</h2>
      <p>{motivationMessage[index]}</p>
      <button onClick={() => setIndex((prev) => prev + 1)}>Generate</button>
    </div>
  );
};

export default Motivator;
