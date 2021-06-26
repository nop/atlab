// TODO: add timezone support (also for DST)
// right now, everything works on laboum's time
let atl = [
  {type: 'sleep', start: 12, duration: 6},
  {type: 'work',  start: 20, duration: 9},
];

let laboum = [
  {type: 'sleep', start: 23, duration: 6},
  {type: 'work',  start: 12, duration: 6},
  {type: 'work',  start: 20, duration: 3},
];

let qualityTime = [
  {type: 'quality', start: 05, duration: 7},
  {type: 'quality', start: 18, duration: 2},
];

function updateDays() {
  document.getElementById("streak").textContent = function () {
    const anniversary = new Date(2021, 03, 02); // month is 0-indexed
    const now = new Date();
    return Math.round((now - anniversary)/(1000*60*60*24)) + 1; // count the day we're on
  }();
}
window.addEventListener('load', updateDays, false);

function clock() {
  var date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  hh = (hh < 10) ? "0" + hh : hh;
  mm = (mm < 10) ? "0" + mm : mm;
  ss = (ss < 10) ? "0" + ss : ss;

  let time = hh + ":" + mm + ":" + ss;

  document.getElementById("clock").innerText = time;
  setTimeout(clock, 1000);
}
window.addEventListener('load', clock, false);

let hours = Array.from(document.getElementsByClassName("hour"));

function update() {
  let date = new Date();
  let hh = date.getUTCHours();

  // wrangle UTC date into AWST
  hh = (hh + 8) % 24;

  // reset all of the "nows" so that multiple hours don't show as "now"
  for (hour of hours) hour.dataset.now = false;
  hours.find(hour => hour.dataset.hour == hh).dataset.now = true;

  // call every hour
  let nextDate = new Date();
  nextDate.setHours(0); // will never be longer than an hour
  nextDate.setMinutes(60 - nextDate.getMinutes());
  nextDate.setSeconds(60 - nextDate.getSeconds());
  setTimeout(update, nextDate - new Date());
}
window.addEventListener('load', update, false);

function insertBlock(block) {
  if (block.start + block.duration > 24) {
    insertBlock({
      start: block.start,
      duration: 24 - block.start,
      type: block.type,
    });
    insertBlock({
      start: 00,
      duration: block.duration - (24 - block.start),
      type: block.type,
    });
    return;
  }

  let elem = document.createElement("td");
  elem.className = block.type;
  elem.rowSpan = block.duration;
  if (block.type === 'quality') elem.colSpan = 2;

  let text = document.createTextNode((block.type === 'quality') ? 'quality time' : block.type);
  elem.appendChild(text);

  let hour = hours.find(hour => hour.dataset.hour == block.start);
  hour.insertBefore(elem, hour.childNodes[hour.childNodes.length - 2]);
}
window.addEventListener('load', () => {
  laboum.forEach(insertBlock)
  atl.forEach(insertBlock)
  qualityTime.forEach(insertBlock)
}, false);
