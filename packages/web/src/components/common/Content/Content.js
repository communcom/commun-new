/* eslint-disable react/prop-types */

import React from 'react';
import styled from 'styled-components';

import { SIDE_BAR_MARGIN } from 'shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Left = styled.main`
  flex: 1;
  min-width: 288px;
  width: 100%;
`;

const Right = styled.div`
  display: block;
  flex: 0;
  margin-left: ${SIDE_BAR_MARGIN}px;
`;

const Aside = styled.aside`
  display: block;

  & > :not(:last-of-type) {
    margin-bottom: 8px;
  }
`;

export default function Content({ isDesktop, aside, children, ...props }) {
  return (
    <Wrapper {...props}>
      <Left>{children}</Left>
      {isDesktop ? (
        <Right>
          <Aside>{aside()}</Aside>
        </Right>
      ) : null}
    </Wrapper>
  );
}
