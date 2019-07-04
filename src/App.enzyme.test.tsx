import React from 'react';
import App from './App';

import { shallow, render, mount } from 'enzyme';

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
})


