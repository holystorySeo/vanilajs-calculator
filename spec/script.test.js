if (typeof window === "undefined") {
  // for node env
  const fs = require("fs");
  const path = require("path");
  const cwd = process.cwd();
  const { JSDOM } = require("jsdom");
  const { expect } = require("chai");
  require("mocha");

  const myLibrary = fs.readFileSync(path.join(cwd, "/script.js"), {
    encoding: "utf-8"
  });
  const html = fs.readFileSync(path.join(cwd, "/calculator.html"));

  let window;
  window = new JSDOM(html, { runScripts: "dangerously" }).window;
  const script = window.document.createElement("script");
  script.textContent = myLibrary;

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

    it("처음 숫자 버튼을 눌렀을 때, 첫 번째 화면에 누른 숫자가 보여야 합니다.", function (done) {
      const test = ["7", "7"];
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
}
