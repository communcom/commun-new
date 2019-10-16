import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Body = styled.div``;

// eslint-disable-next-line react/prefer-stateless-function
export default class CurrentSettings extends PureComponent {
  render() {
    return (
      <Body>
        <div>A = 3</div>
        <div>B = 4</div>
        <div>C = x^2</div>
      </Body>
    );
  }
}
