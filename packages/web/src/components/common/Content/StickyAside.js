import React from 'react';
import Sticky from 'react-stickynode';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

export default function StickyAside({ isEnabled, className, children }) {
  return (
    <RightWrapper className={className}>
      <Sticky enabled={isEnabled} top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
        {children}
      </Sticky>
    </RightWrapper>
  );
}

StickyAside.propTypes = {
  isEnabled: PropTypes.bool,
};

StickyAside.defaultProps = {
  isEnabled: true,
};
