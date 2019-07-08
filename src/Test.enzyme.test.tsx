// App.enzyme.test.js
import React from "react";
import App from "./App";

import { mount, render, shallow } from "enzyme";

/**
 * Demo test showing how to use enzyme
 */
it("should render style", () => {
  chai.expect(shallow(
    <div style={{ left: "4rem" }} />,
  )).to.have.style("left", "4rem");
});
