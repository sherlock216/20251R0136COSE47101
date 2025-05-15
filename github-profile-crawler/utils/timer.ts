const timer = () => {
  let time = 0;
  const interval = setInterval(() => {
    time++;
  }, 1000);

  return () => {
    clearInterval(interval);
    console.log(`소요 시간: ${time % 60}분 ${time % 60}초`);
  };
};

export default timer;
