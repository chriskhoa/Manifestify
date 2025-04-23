import React from "react";
import { useEffect } from "react";
import { Progress, Button, Popconfirm, Statistic, InputNumber } from "antd";
import styles from "./DailyGoal.module.css";
const { Countdown } = Statistic;

/**
 * DailyGoal Component
 *
 * Allows users to set and track their daily job application goals.
 * Displays a circular progress bar and countdown to midnight.
 * Persists state using localStorage and resets at the start of a new day.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.goalValue - The number of applications the user aims to submit today
 * @param {Function} props.setGoalValue - Setter for updating `goalValue`
 * @param {boolean} props.goalSet - Whether the goal has already been set today
 * @param {Function} props.setGoalSet - Setter for updating `goalSet` status
 * @param {number} props.progressValue - Current number of applications submitted today
 * @param {Function} props.setProgressValue - Setter for updating `progressValue`
 * @param {number} props.percent - Completion percentage of the goal
 * @param {Function} props.setPercent - Setter for updating `percent`
 * @returns {JSX.Element} The rendered DailyGoal component
 */
const DailyGoal = ({
  goalValue,
  setGoalValue,
  goalSet,
  setGoalSet,
  progressValue,
  setProgressValue,
  percent,
  setPercent,
}) => {
  // Keep track of daily progress in local storage
  useEffect(() => {
    const todayGoal = JSON.parse(localStorage.getItem("todayGoal"));
    const todayProgress = JSON.parse(localStorage.getItem("todayProgress"));
    const todayPercent = JSON.parse(localStorage.getItem("todayPercent"));

    if (todayGoal) {
      setGoalValue(todayGoal);
      setGoalSet(true);
    }
    if (todayProgress) {
      setProgressValue(todayProgress);
    }
    if (todayPercent) {
      setPercent(todayPercent);
    }
  }, []);

  // Reset goal at midnight
  useEffect(() => {
    const lastUpdated = localStorage.getItem("lastUpdatedDate");
    const today = new Date().toDateString();

    if (lastUpdated !== today) {
      // It's a new day – clear the daily data
      localStorage.removeItem("todayGoal");
      localStorage.removeItem("todayProgress");
      localStorage.removeItem("todayPercent");

      localStorage.setItem("lastUpdatedDate", today);

      setGoalSet(false);
      setGoalValue(1);
      setProgressValue(0);
      setPercent(0);
    }
  }, []);

  /**
   * Handles changes to the goal input field.
   * @param {number} value - New goal value input by user
   */
  const onChange = (value) => {
    setGoalValue(value);
  };

  /**
   * Confirms and sets the user's daily goal in localStorage.
   * Resets the progress and percent for the new day.
   * @param {React.MouseEvent} e - The confirm button click event
   */
  const confirm = (e) => {
    localStorage.setItem("todayGoal", JSON.stringify(goalValue));
    localStorage.setItem("todayProgress", JSON.stringify(0));
    localStorage.setItem("todayPercent", JSON.stringify(0));

    setProgressValue(0);
    setPercent(0);
    setGoalSet(true);
  };

  return (
    <>
      {goalSet ? (
        <div className={styles.box}>
          <h2>Your today's goal</h2>
          <div>
            🎯 You’ve set your goal to submit <strong>{goalValue}</strong> job
            application{goalValue > 1 ? "s" : ""} today!
          </div>
          <div>
            <Progress
              type="circle"
              format={() => `${progressValue} / ${goalValue}`}
              percent={percent}
              size={250}
              className={styles.progress}
            />
            <Countdown
              title="Countdown"
              value={new Date().setHours(24, 0, 0, 0)}
            />
          </div>
        </div>
      ) : (
        <div>
          <p>How many job applications do you aim to submit today?</p>
          <InputNumber
            min={1}
            defaultValue={1}
            onChange={onChange}
            value={goalValue}
          />
          <Popconfirm
            title="Set today goal"
            description="Are you sure to set this goal? You cannot change it until tomorrow."
            onConfirm={confirm}
          >
            <Button type="primary">Set goal</Button>
          </Popconfirm>
        </div>
      )}
    </>
  );
};

export default DailyGoal;
