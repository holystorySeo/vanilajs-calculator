const displayResult = document.querySelector(".calculator-display");
const buttons = document.querySelector(".calculator-button");
let cnt = 0; // 입력된 숫자의 length가 25이상이 되었을 때 부터 계산
let firstNum, operator, previousNum, previousKey;

function calculator(num1, operator, num2) {
  let result = 0;

  if (operator === "+") {
    result = num1 + num2;
  }

  if (operator === "−") {
    result = num1 - num2;
  }

  if (operator === "×") {
    result = num1 * num2;
  }

  if (operator === "÷") {
    result = num1 / num2;
  }

  return result;
}

buttons.addEventListener("click", (e) => {
  const target = e.target;
  const name = target.className;
  const buttonContent = target.textContent;

  if (name == "number") {
    // 숫자 입력의 경우
    if (
      displayResult.textContent === "0" ||
      (operator !== undefined &&
        firstNum !== undefined &&
        previousNum === undefined) ||
      previousKey !== undefined
    ) {
      console.log("1");
      displayResult.textContent = buttonContent;
      previousKey = undefined;
      if (operator !== undefined) {
        previousNum = buttonContent;
      }
    } else {
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
        console.log("2");
        displayResult.textContent = displayResult.textContent + buttonContent;
      }

      if (cnt === 26) {
        displayResult.textContent = 0;
        displayResult.style.fontSize = "3rem";
      }
    }
  }

  if (name === "operator") {
    if (firstNum === undefined) {
      firstNum = displayResult.textContent;
      operator = buttonContent;
    } else {
      displayResult.textContent = calculator(
        Number(firstNum),
        operator,
        Number(displayResult.textContent)
      );
      firstNum = displayResult.textContent;
      operator = buttonContent;
      previousNum = undefined;
      previousKey = "=";
    }
  }

  if (name === "decimal") {
  }

  if (name === "calculate") {
    displayResult.textContent = calculator(
      Number(firstNum),
      operator,
      Number(displayResult.textContent)
    );
    firstNum = undefined;
    operator = undefined;
    previousNum = undefined;
    previousKey = "=";
  }
});
