const display = document.querySelector(".calculator-display");
const buttons = document.querySelector(".calculator-button");

// operator가 눌러지게되면 값이 할당된다.
let firstNum;

let operator;

// operator가 눌러지고 그 다음 숫자를 새로 입력하게 되면 값이 1회 할당된다.
// 숫자를 한번 입력한 상태에서 previousNum !== undefined 일 경우
// 그 다음 순서로 입력하는 숫자는 앞 숫자의 뒤에 이어서 붙이도록 한다.
let previousNum;

// 계산을 한번 해서 그 결과를 화면에 표시한 경우 값이 할당된다.
let previousKey;

function calculator(num1, operator, num2) {
  let result = 0;

  if (operator === "+") {
    result = Number(num1) + Number(num2);
  }

  if (operator === "−") {
    result = Number(num1) - Number(num2);
  }

  if (operator === "×") {
    result = Number(num1) * Number(num2);
  }

  if (operator === "÷") {
    result = Number(num1) / Number(num2);
  }

  return result;
}

function printOut() {
  console.log(
    `firstNum=${firstNum}, operator=${operator}, displayleResult=${display.textContent}, previousNum=${previousNum}, previousKey=${previousKey}`
  );
}

buttons.addEventListener("click", (e) => {
  const target = e.target;
  const name = target.className;
  const buttonContent = target.textContent;

  if (name == "number") {
    // console.log("구분");
    // 화면 초기화 후 표시하는 경우
    if (previousNum === undefined) {
      // console.log("1");
      // printOut();
      display.textContent = buttonContent;
      previousNum = display.textContent;
      // printOut();
    } else if (previousKey !== "decimal" && previousKey !== undefined) {
      // console.log("6");
      display.textContent = buttonContent;
      previousKey = undefined;
      // printOut();
      // 숫자를 이어서 표시하는 경우
    } else if (previousNum !== undefined) {
      // console.log("2");
      // printOut();
      display.textContent = display.textContent + buttonContent;
      previousNum = display.textContent;
      // printOut();
    } else if (previousKey === undefined) {
      // console.log("7");
      // printOut();
      display.textContent = display.textContent + buttonContent;
      previousKey = "operator";
      // printOut();
    }
  }

  if (name === "operator") {
    // console.log("구분");
    if (firstNum === undefined && previousKey !== "decimal") {
      firstNum = display.textContent;
      operator = buttonContent;
      previousKey = "operator";
      // console.log("3");
      // printOut();
    } else if (previousKey === "operator") {
      // console.log("18");
      operator = buttonContent;
      // printOut();
      return;
    } else if (previousKey === "calculate") {
      firstNum = display.textContent;
      operator = buttonContent;
      previousKey = "operator";
      // console.log("10");
      // printOut();
    } else if (firstNum !== undefined && previousNum !== undefined) {
      display.textContent = calculator(firstNum, operator, display.textContent);
      operator = buttonContent;
      firstNum = display.textContent;
      previousKey = "operator";
      previousNum = undefined;
      // console.log("9");
      // printOut();
    } else if (firstNum !== undefined && previousNum === undefined) {
      display.textContent = calculator(firstNum, operator, 0);
      // console.log("11");
      // printOut();
    } else if (previousKey === "decimal" && previousNum !== undefined) {
      firstNum = display.textContent;
      operator = buttonContent;
      previousKey = "operator";
      previousNum = undefined;
      // console.log("13");
      // printOut();
    }
  }

  if (name === "calculate") {
    // console.log("구분");
    // 화면에 표시된 숫자를 firstNum에 할당해야 하는 경우
    if (previousKey === "calculate") {
      display.textContent = calculator(
        display.textContent,
        operator,
        previousNum
      );
      firstNum = display.textContent;
      // console.log("4");
      // printOut();
      // 화면에 표시된 숫자를 previousNum에 할당해야 하는 경우
    } else if (previousKey === "operator") {
      // console.log("5");
      previousNum = display.textContent;
      display.textContent = calculator(firstNum, operator, previousNum);
      previousKey = "calculate";
      // printOut();
    } else if (previousKey === undefined) {
      // console.log("8");
      previousNum = display.textContent;
      display.textContent = calculator(firstNum, operator, previousNum);
      previousKey = "calculate";
      // printOut();
    } else if (
      previousKey === "decimal" &&
      firstNum !== undefined &&
      previousNum !== undefined
    ) {
      // console.log("15");
      display.textContent = calculator(firstNum, operator, previousNum);
      previousKey = "calculate";
      // printOut();
    }
  }

  if (name === "decimal") {
    if (display.textContent === "0") {
      // console.log("12");
      display.textContent = "0.";
      previousNum = "0";
      previousKey = "decimal";
      // printOut();
    } else if (previousKey === "operator" && previousNum === undefined) {
      // console.log("17");
      // printOut();
      display.textContent = "0.";
      previousKey = "decimal";
      previousNum = "0";
    } else if (previousKey === "decimal") {
      // console.log("19");
      return;
    } else if (previousKey === "operator") {
      // console.log("14");
      display.textContent = display.textContent + ".";
      previousKey = "decimal";
      // printOut();
    } else if (previousKey === undefined) {
      // console.log("16");
      display.textContent = display.textContent + ".";
      previousKey = "decimal";
      // printOut();
    }
  }

  if (name === "clear") {
    // console.log("구분");
    display.textContent = "0";
    firstNum = undefined;
    operator = undefined;
    previousNum = undefined;
    previousKey = undefined;
  }
});
