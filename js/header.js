const time = document.querySelector(".time");

function updateTime() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  time.textContent = `${hour}:${minute}`;
}

updateTime(); // 처음 1번 실행
setInterval(updateTime, 1000); // 1초마다 갱신
