import React from "react";
import { InputNumber } from "antd";
import { useState, useEffect } from "react";
import { Progress, Space, Button, Popconfirm, Statistic } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Countdown } = Statistic;

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
  // const [goalValue, setGoalValue] = useState(1);
  // const [goalSet, setGoalSet] = useState(false);
  // const [progressValue, setProgressValue] = useState(0);
  // const [percent, setPercent] = useState(0);

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
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0); // Midnight tonight
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      // Clear localStorage values
      localStorage.removeItem("todayGoal");
      localStorage.removeItem("todayProgress");
      localStorage.removeItem("todayPercent");

      // Reset state
      setGoalSet(false);
      setGoalValue(1);
      setProgressValue(0);
      setPercent(0);
    }, timeUntilMidnight);
    console.log(
      `⏱ Reset will happen in ${(timeUntilMidnight / 1000 / 60).toFixed(
        2
      )} minutes.`
    );

    return () => clearTimeout(timer); // Clean up if component unmounts
  }, []);

  const onChange = (value) => {
    setGoalValue(value);
  };
  const confirm = (e) => {
    // set local storage to keep track of progress
    localStorage.setItem("todayGoal", JSON.stringify(goalValue));
    localStorage.setItem("todayProgress", JSON.stringify(0));
    localStorage.setItem("todayPercent", JSON.stringify(0));
    // set daily goal progress value after confirmation
    setProgressValue(0);
    setPercent(0);
    setGoalSet(true);
  };

  const increase = () => {
    // test function
    setProgressValue((prevProgressValue) => {
      const newProgressValue = prevProgressValue + 1;
      localStorage.setItem("todayProgress", JSON.stringify(newProgressValue));
      return newProgressValue;
    });

    setPercent((prevPercent) => {
      const newPercent = prevPercent + (1 / goalValue) * 100;
      if (newPercent > 99.99) {
        localStorage.setItem("todayPercent", JSON.stringify(100));
        return 100;
      }
      localStorage.setItem("todayPercent", JSON.stringify(newPercent));
      return newPercent;
    });
  };

  return (
    <>
      {goalSet ? (
        <div>
          <div>
            🎯 You’ve set your goal to submit <strong>{goalValue}</strong> job
            application{goalValue > 1 ? "s" : ""} today!
          </div>
          <div>
            <Progress
              type="circle"
              format={() => `${progressValue} / ${goalValue}`}
              percent={percent}
            />
            {/* <Space.Compact>
              <Button onClick={increase} icon={<PlusOutlined />} />
            </Space.Compact> */}
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
