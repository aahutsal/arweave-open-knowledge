// App.test.js
import React from 'react'
import App from './App';
import renderer from 'react-test-renderer'

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
