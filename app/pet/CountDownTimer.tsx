import React, { useState, useEffect } from "react";

interface commentProp {
  seconds: number;
}

const CountDownTimer = ({ seconds }: commentProp) => {
  const [remainSecond, setRemainSecond] = useState(0);

  useEffect(() => {
    const countDownSecond = seconds;

    const startTime = Date.now();
    const countDown = setInterval(() => {
      const pastSeconds = (Date.now() - startTime) / 1000;
      const remain = countDownSecond - pastSeconds;
      setRemainSecond(remain < 0 ? 0 : remain);

      if (remain <= 0) {
        clearInterval(countDown);
      }
    }, 1000);

    return () => {
      clearInterval(countDown);
    };
  }, [seconds]);
  useEffect(() => {
    console.log(new Date(remainSecond * 1000).toISOString());
  }, [remainSecond]);

  return (
    <div className="contain">
      {new Date(remainSecond * 1000).toISOString().substr(11, 8)}
    </div>
  );
};

export default CountDownTimer;
