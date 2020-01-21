import React, { Component } from 'react';

import { LAYOUT_TYPE_1PANE } from 'components/common/Layout';

export default class MyComponent extends Component {
  layout = LAYOUT_TYPE_1PANE;

  render() {
    return <div>paymentComplete</div>;
  }
}

MyComponent.propTypes = {};
