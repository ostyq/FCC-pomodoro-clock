import $ from 'jquery';

let sessionLengthMinutes = Number($('p.duration-length').text());
let breakLengthMinutes = Number($('p.break-length').text());

let currentMinutes = sessionLengthMinutes;
let currentSeconds = '00';
let breakInProgress = false;

const updateTimer = () => {
  const currentTime = `${currentMinutes}:${currentSeconds}`;
  $('p.countdown-time').html(currentTime);
};

const checkSeconds = (sec) => {
  if (sec < 10 && sec >= 0) {
    return `0${sec}`;
  }
  if (sec < 0) {
    return 59;
  }
  return sec;
};

const countdown = () => {
  currentSeconds = checkSeconds(currentSeconds - 1);
  if (currentSeconds === 59) {
    currentMinutes -= 1;
  }
  if (currentMinutes < 0) {
    if (breakInProgress === false) {
      breakInProgress = true;
      currentMinutes = breakLengthMinutes - 1;
      $('p.countdown-title').text('Break!');
    } else if (breakInProgress === true) {
      breakInProgress = false;
      currentMinutes = sessionLengthMinutes - 1;
      $('p.countdown-title').text('Session:');
    }
  }
  updateTimer();
};

const toggleStartPause = () => {
  $('button.start-button').toggleClass('hidden');
  $('button.pause-button').toggleClass('hidden');
};

let timerId = 0;

const startTimer = () => {
  timerId = setInterval(countdown, 1000);
  toggleStartPause();
};

const pauseTimer = () => {
  clearInterval(timerId);
  toggleStartPause();
};

const resetTimer = () => {
  clearInterval(timerId);
  currentMinutes = sessionLengthMinutes;
  currentSeconds = '00';
  updateTimer();
  breakInProgress = false;
  $('p.countdown-title').text('Session:');
  if ($('button.start-button').hasClass('hidden')) {
    toggleStartPause();
  }
};

const resetBreak = () => {
  clearInterval(timerId);
  currentMinutes = breakLengthMinutes;
  currentSeconds = '00';
  updateTimer();
  if ($('button.start-button').hasClass('hidden')) {
    toggleStartPause();
  }
};

const updateSession = () => {
  $('p.duration-length').text(sessionLengthMinutes);
  if (!breakInProgress) {
    currentMinutes = sessionLengthMinutes;
    updateTimer();
  }
};

const updateBreak = () => {
  $('p.break-length').text(breakLengthMinutes);
  if (breakInProgress) {
    currentMinutes = breakLengthMinutes;
    updateTimer();
  }
};

const increaseSessionLength = () => {
  if (currentSeconds !== '00' && breakInProgress === false) {
    resetTimer();
  }
  sessionLengthMinutes += 1;
  updateSession();
};
const decreaseSessionLength = () => {
  if (currentSeconds !== '00' && breakInProgress === false) {
    resetTimer();
  }
  if (sessionLengthMinutes > 1) {
    sessionLengthMinutes -= 1;
    updateSession();
  }
};

const increaseBreakLength = () => {
  if (currentSeconds !== '00' && breakInProgress) {
    resetBreak();
  }
  breakLengthMinutes += 1;
  updateBreak();
};

const decreaseBreakLength = () => {
  if (currentSeconds !== '00' && breakInProgress) {
    resetBreak();
  }
  if (breakLengthMinutes > 1) {
    breakLengthMinutes -= 1;
  }
  updateBreak();
};

$(document).ready(() => {
  $('button.start-button').on('click', startTimer);
  $('button.pause-button').on('click', pauseTimer);
  $('button.reset-button').on('click', resetTimer);
  $('button.session-plus').on('click', increaseSessionLength);
  $('button.session-minus').on('click', decreaseSessionLength);
  $('button.break-plus').on('click', increaseBreakLength);
  $('button.break-minus').on('click', decreaseBreakLength);
});
