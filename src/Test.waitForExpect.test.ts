// Test.waitForExpect.test.js
import App from './App';
import waitForExpect from 'wait-for-expect'

/**
 * Demo test showing how to use waitForExpect
 */
test("it waits for the number to change", async () => {
  let numberToChange = 10
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 3000)
  console.log(`Will be waiting for ${randomTimeout} msec`)

  setTimeout(() => {
    numberToChange = 100
  }, randomTimeout)

  await waitForExpect(() => {
    expect(numberToChange).toEqual(100)
  })
})
