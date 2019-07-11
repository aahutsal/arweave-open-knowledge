import React from "react";
import Toolbar from "./ArweaveAuth";
const propTypes = {};
const defaultProps = {};

class HomeDefault extends React.Component {
  public static propTypes = {};
  public static defaultProps = {};

  public render() {
    return (
        <div className="Home">
           <Toolbar/>
           <span className="h6 text-white">Home &gt;&gt;</span>
           {this.props.children}
        </div>
    );
  }
}

HomeDefault.propTypes = propTypes;
HomeDefault.defaultProps = defaultProps;

export default HomeDefault;
