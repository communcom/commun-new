import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Body = styled.div``;

// eslint-disable-next-line react/prefer-stateless-function
export default class ProposalsList extends PureComponent {
  render() {
    return (
      <Body>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Body>
    );
  }
}
