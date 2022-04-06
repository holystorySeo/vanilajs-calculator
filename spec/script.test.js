if (typeof window === "undefined") {
  // for node env
  const fs = require("fs");
  const path = require("path");
  const cwd = process.cwd();
  const { JSDOM } = require("jsdom");
  const { expect } = require("chai");
  console.log(`경로, ${cwd}`);

  const prepared = fs.readFileSync(path.join(cwd, "/script.js"), {
    encoding: "utf-8"
  });
  const html = fs.readFileSync(path.join(cwd, "/calculator.html"));

  let window;
  window = new JSDOM(html, { runScripts: "dangerously" }).window;
  const script = window.document.createElement("script");
  script.textContent = prepared;

  window.document.body.appendChild(script);

  test(window, expect);
} else {
  // for browser env
  var expect = chai.expect;
  test(window, expect);
}

function test(window, expect) {
  describe("bare minimum test", function () {
    bare(window, expect);
  });
}

function bare(window, expect) {
  describe("bare minimum 수준을 통과합니다.", function () {
    afterEach(function () {
      clearButton.dispatchEvent(clickEvent);
    });

    const getButtonBy = function (text, buttons) {
      const result = buttons.filter(function (button) {
        return button.textContent === text;
      });

      if (result.length > 1) {
        throw new Error("no extra buttons allowed");
      } else if (result.length < 1) {
        throw new Error("no button");
      }

      return result[0];
    };

    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const numberButtons = [...window.document.querySelectorAll(".number")];
    // const operators = ['+', '-', '*', '/'];
    const operatorButtons = [...window.document.querySelectorAll(".operator")];
    const decimalButton = window.document.querySelector(".decimal");
    const clearButton = window.document.querySelector(".clear");
    const enterButton = window.document.querySelector(".calculate");
    const allButtons = [
      clearButton,
      enterButton,
      decimalButton,
      ...numberButtons,
      ...operatorButtons
    ];

    describe("Step 1 - 숫자 버튼을 누르고 화면에 숫자를 입력하기", function () {
      it("처음 숫자 버튼을 눌렀을 때, 첫 번째 화면에 누른 숫자가 보여야 합니다.", function (done) {
        const test = ["3", "3"];
        const clicks = test.slice(0, -1);
        const expected = test.slice(-1)[0];
        const display = window.document.querySelector(".calculator-display");
        clicks.forEach(function (click) {
          const button = getButtonBy(click, allButtons);
          button.dispatchEvent(clickEvent);
        });
        expect(display.textContent).to.equal(expected);
        done();
      });

      it("숫자 버튼을 여러 번 눌렀을 때, 계산기 화면에 숫자가 이어붙여져야(concatenation) 합니다.", function (done) {
        const test = ["7", "0", "0", "0", "7000"];
        const clicks = test.slice(0, -1);
        const expected = test.slice(-1)[0];
        const display = window.document.querySelector(".calculator-display");
        clicks.forEach(function (click) {
          const button = getButtonBy(click, allButtons);
          button.dispatchEvent(clickEvent);
        });
        expect(display.textContent).to.equal(expected);
        done();
      });
    });

    describe("Step 2 - '=' 버튼 눌러 계산하고, AC 버튼으로 초기화 시키기", function () {
      it("연산자 버튼을 눌렀을 때, 계산기 화면에 보이는 숫자를 따로 저장하고 계산할 준비를 해야 합니다.", function (done) {
        const test = ["3", "0", "0", "0", "×", "3000"];
        const clicks = test.slice(0, -1); //["3", "0", "0", "0", "×"];
        const expected = test.slice(-1)[0];
        const display = window.document.querySelector(".calculator-display");
        clicks.forEach(function (click) {
          const button = getButtonBy(click, allButtons);
          button.dispatchEvent(clickEvent);
        });
        expect(display.textContent).to.equal(expected);
        done();
      });

      it("= 버튼을 눌렀을 때, 계산기 화면에 보이는 숫자와 저장된 숫자를 함께 조합하여 계산한 결과를 화면에 보여줘야 합니다.", function (done) {
        const test = ["3", "0", "0", "0", "×", "3", "=", "9000"];
        const clicks = test.slice(0, -1); //["3", "0", "0", "0", "×"];
        const expected = test.slice(-1)[0];
        const display = window.document.querySelector(".calculator-display");
        clicks.forEach(function (click) {
          const button = getButtonBy(click, allButtons);
          button.dispatchEvent(clickEvent);
        });
        expect(display.textContent).to.equal(expected);
        done();
      });
    });

    describe("AC 버튼이 제대로 작동하는지 테스트 합니다.", function () {
      afterEach(() => {
        clearButton.dispatchEvent(clickEvent);
      });

      it("AC 버튼을 클릭하면 화면이 초기화 되어야 합니다.", function (done) {
        const display = window.document.querySelector(".calculator-display");
        display.textContent = "bug stuff";
        const clearButton = window.document.querySelector(".clear");
        clearButton.dispatchEvent(clickEvent);

        expect(display.textContent).to.equal("0");
        done();
      });
    });

    describe("calculator 함수를 검사합니다.", () => {
      describe("정수의 연산을 테스트 합니다", () => {
        const calculateFunc = (testElement) => {
          const { firstNum, operator, previousNum, result } = testElement;

          it(`${firstNum}과 ${previousNum}의 계산 결과는 ${result}이여야 합니다.`, function (done) {
            const stringInputResult = window.calculator(
              firstNum,
              operator,
              previousNum
            );

            const numberInputResult = window.calculator(
              firstNum,
              operator,
              previousNum
            );

            const isPassed =
              Boolean(stringInputResult === Number(result)) ||
              Boolean(numberInputResult === Number(result));
            expect(isPassed).to.be.true;
            done();
          });
        };

        describe("덧샘 연산을 검사합니다", function () {
          const testArr = [
            {
              firstNum: "1",
              operator: "+",
              previousNum: "2",
              result: "3"
            },
            {
              firstNum: "5689",
              operator: "+",
              previousNum: "1234",
              result: "6923"
            },
            {
              firstNum: "24",
              operator: "+",
              previousNum: "12",
              result: "36"
            },
            {
              firstNum: "1000",
              operator: "+",
              previousNum: "3100",
              result: "4100"
            }
          ];

          testArr.forEach(calculateFunc);
        });

        describe("뺄샘 연산을 검사합니다", function () {
          const testArr = [
            {
              firstNum: "1",
              operator: "−",
              previousNum: "2",
              result: "-1"
            },
            {
              firstNum: "5784",
              operator: "−",
              previousNum: "5784",
              result: "0"
            },
            {
              firstNum: "1000",
              operator: "−",
              previousNum: "1100",
              result: "-100"
            },
            {
              firstNum: "1100",
              operator: "−",
              previousNum: "1000",
              result: "100"
            }
          ];

          testArr.forEach(calculateFunc);
        });

        describe("곱샘 연산을 검사합니다", function () {
          const testArr = [
            {
              firstNum: "1",
              operator: "×",
              previousNum: "2",
              result: "2"
            },
            {
              firstNum: "5425",
              operator: "×",
              previousNum: "243",
              result: "1318275"
            },
            {
              firstNum: "1000",
              operator: "×",
              previousNum: "100",
              result: "100000"
            },
            {
              firstNum: "100",
              operator: "×",
              previousNum: "0",
              result: "0"
            }
          ];

          testArr.forEach(calculateFunc);
        });

        describe("나눗샘 연산을 검사합니다", function () {
          const testArr = [
            {
              firstNum: "5",
              operator: "÷",
              previousNum: "2",
              result: "2.5"
            },
            {
              firstNum: "100",
              operator: "÷",
              previousNum: "10",
              result: "10"
            },
            {
              firstNum: "2048",
              operator: "÷",
              previousNum: "1024",
              result: "2"
            },
            {
              firstNum: "69249",
              operator: "÷",
              previousNum: "123",
              result: "563"
            }
          ];
          testArr.forEach(calculateFunc);
        });
      });
    });
  });
}
