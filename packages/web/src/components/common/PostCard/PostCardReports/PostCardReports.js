import React, { Component } from 'react';
import styled from 'styled-components';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import AsyncButton from 'components/common/AsyncButton/AsyncButton';

const Wrapper = styled.div``;

// eslint-disable-next-line react/prefer-stateless-function
export default class PostCardReports extends Component {
  static propTypes = {};

  render() {
    return (
      <Wrapper>
        <CardFooterDecision
          title="Reports"
          text="5"
          actions={() => (
            <>
              <AsyncButton onClick={() => {}}>Accept</AsyncButton>
              <AsyncButton onClick={() => {}}>Reject</AsyncButton>
            </>
          )}
        />
      </Wrapper>
    );
  }
}
