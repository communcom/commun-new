/* eslint-disable react/prop-types */

import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { SIDE_BAR_MARGIN } from 'shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;

  ${is('isMobile')`
    min-width: 0px;
    overflow: hidden;
  `};
`;

const Left = styled.main`
  flex: 1;
  min-width: 288px;
  width: 100%;
  padding-bottom: 15px;
`;

const Right = styled.div`
  display: block;
  flex: 0;
  margin-left: ${SIDE_BAR_MARGIN}px;
`;

const Aside = styled.aside`
  display: block;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

export default function Content({ isDesktop, aside, children, ...props }) {
  return (
    <Wrapper {...props}>
      <Left>{children}</Left>
      {isDesktop && aside ? (
        <Right>
          <Aside>{aside()}</Aside>
        </Right>
      ) : null}
    </Wrapper>
  );
}
