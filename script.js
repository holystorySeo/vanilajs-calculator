const displayResult = document.querySelector(".calculator-display");
const buttons = document.querySelector(".calculator-button");
let cnt = 0;

buttons.addEventListener("click", (e) => {
  if (e.target.className == "number") {
    if (displayResult.textContent === "0") {
      displayResult.textContent = e.target.textContent;
    } else {
      console.log(displayResult.textContent.length);
      console.log(cnt);
      if (displayResult.textContent.length >= 10) {
        displayResult.style.fontSize = "2.5rem";
      }

      if (displayResult.textContent.length >= 13) {
        displayResult.style.fontSize = "2rem";
      }

      if (displayResult.textContent.length >= 16) {
        displayResult.style.fontSize = "1.8rem";
      }

      if (displayResult.textContent.length >= 19) {
        displayResult.style.fontSize = "1.2rem";
      }

      if (displayResult.textContent.length >= 25) {
        if (cnt >= 18) {
          displayResult.style.fontSize = "1rem";
        }
        displayResult.textContent = displayResult.textContent.slice(1) + 0;
        cnt += 1;
      } else {
        displayResult.textContent =
          displayResult.textContent + e.target.textContent;
      }

      if (cnt === 26) {
        displayResult.textContent = 0;
        displayResult.style.fontSize = "3rem";
      }
    }
  }
});
