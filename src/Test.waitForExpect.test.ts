// Test.waitForExpect.test.js
import waitForExpect from "wait-for-expect";
import App from "./App";

/**
 * Demo test showing how to use waitForExpect
 */
test("it waits for the number to change", async () => {
  let numberToChange = 10;
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 3000);
  setTimeout(() => {
    numberToChange = 100;
  }, randomTimeout);

  await waitForExpect(() => {
    expect(numberToChange).toEqual(100);
  });
});
