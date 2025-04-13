import React from "react";
import { InputNumber } from "antd";
import { useState, useEffect } from "react";
import { Progress, Flex, Space, Button, message, Popconfirm } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const DailyGoal = () => {
  const [goalSet, setGoalSet] = useState(false);
  const [goalValue, setGoalValue] = useState(1);
  const [progressValue, setProgressValue] = useState(0);
  const [percent, setPercent] = useState(0);

  const onChange = (value) => {
    console.log("changed", value);
    setGoalValue(value);
  };
  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
    setGoalSet(true);
  };
  const increase = () => {
    setProgressValue((prev) => prev + 1);
    setPercent((prevPercent) => {
      const newPercent = prevPercent + (1 / goalValue) * 100;
      if (newPercent > 99.99) {
        return 100;
      }
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
            <Space.Compact>
              <Button onClick={increase} icon={<PlusOutlined />} />
            </Space.Compact>
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
