import React from 'react';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import CTACard from 'components/common/CTACard';

const Wrapper = styled(CTACard)`
  width: 100%;
  height: 460px;
  background: #fff;

  ${up('tablet')} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
    margin-bottom: 0;
  }
`;

export default function TrendingBlock() {
  return <Wrapper>Trending communities</Wrapper>;
}
