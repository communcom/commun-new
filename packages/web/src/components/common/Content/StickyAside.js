import React from 'react';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

export default function({ className, children }) {
  return (
    <RightWrapper className={className}>
      <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>{children}</Sticky>
    </RightWrapper>
  );
}
