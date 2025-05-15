const stopWatch = () => {
  let time = 0;
  const interval = setInterval(() => {
    time++;
  }, 1000);

  return {
    stop: () => {
      clearInterval(interval);
      console.log(`소요 시간: ${Math.floor(time / 60)}분 ${time % 60}초`);
    },
    lap: () => {
      console.log(`${Math.floor(time / 60)}분 ${time % 60}초 경과`);
    },
  };
};

export default stopWatch;
