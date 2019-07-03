// Link.react.test.js
import React from 'react';
import App from './App';
import renderer from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'
import { shallow, render, mount } from 'enzyme';


/**
 * Demo test showing how to use react-test-renderer
 */
test('Link changes the class when hovered', () => {
  const component = renderer.create(<App />)
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // re-rendering
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  // if(tree)
  //   tree.props.onMouseLeave()
  // re-rendering
  tree = component.toJSON()
  if(tree)
    expect(tree).toMatchSnapshot()
})
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

/**
 * Demo test showing how to use enzyme
 */
it('should render style', () => {
  chai.expect(shallow(
    <div
      style={{
        left: '4rem'
      }}
    />
  )).to.have.style('left', '4rem');
});
