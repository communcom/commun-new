import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import NsfwWarning from 'components/common/NsfwWarning';

const Wrapper = styled.div`
  position: relative;
  cursor: default;

  ${is('isNsfw')`
    min-height: 230px;
  `};
`;

const NsfwWarningContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 10px;
  cursor: default;
  overflow: hidden;
`;

export default function NsfwContainer({ isNsfw, onAccept, onClick, children, ...props }) {
  function onAcceptClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (onAccept) {
      onAccept();
    }
  }

  function onWrapperClick(e) {
    if (isNsfw) {
      e.preventDefault();
      e.stopPropagation();
    } else if (onClick) {
      onClick(e);
    }
  }

  return (
    <Wrapper {...props} isNsfw={isNsfw} onClick={onWrapperClick}>
      {children}
      {isNsfw ? (
        <NsfwWarningContainer>
          <NsfwWarning onAcceptClick={onAcceptClick} />
        </NsfwWarningContainer>
      ) : null}
    </Wrapper>
  );
}

NsfwContainer.propTypes = {
  isNsfw: PropTypes.bool,
  onAccept: PropTypes.func,
  onClick: PropTypes.func,
};

NsfwContainer.defaultProps = {
  isNsfw: false,
  onAccept: undefined,
  onClick: undefined,
};
