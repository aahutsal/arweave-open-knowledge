import React from 'react';

const propTypes = {};
const defaultProps = {};

class SettingsComponent extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  render() {
    return (
        <div {...this.props}>
        </div>
    );
  }
};

SettingsComponent.propTypes = propTypes;
SettingsComponent.defaultProps = defaultProps;

export default SettingsComponent;
