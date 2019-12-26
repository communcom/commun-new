import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import Button from '../Button';

const ButtonWrapper = styled.div`
  position: relative;
  z-index: 5;
`;

const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border-radius: 100%;
  background-color: #fff;
`;

const ClockIcon = styled(Icon).attrs({ name: 'clock' })`
  width: 20px;
  height: 20px;
`;

function ButtonWithTooltip({ tooltip, children, onClick, ...props }) {
  const [isTooltipShowed, onTooltipVisibilityChange] = useState(false);
  const toolTipRef = useRef(null);

  useEffect(() => {
    const onAwayClick = e => {
      if (isTooltipShowed && !toolTipRef.current.contains(e.target)) {
        onTooltipVisibilityChange(false);
      }
    };

    window.addEventListener('click', onAwayClick);

    return () => {
      window.removeEventListener('click', onAwayClick);
    };
  }, [isTooltipShowed]);

  const changeTooltipState = () => {
    onTooltipVisibilityChange(!isTooltipShowed);

    if (onClick) {
      onClick();
    }
  };

  if (!tooltip) {
    return (
      <Button {...props} onClick={onClick}>
        {children}
      </Button>
    );
  }

  return (
    <ButtonWrapper ref={toolTipRef}>
      <ButtonStyled {...props} onClick={changeTooltipState}>
        <IconWrapper>
          <ClockIcon />
        </IconWrapper>
        {children}
      </ButtonStyled>
      {isTooltipShowed ? tooltip(changeTooltipState) : null}
    </ButtonWrapper>
  );
}

ButtonWithTooltip.propTypes = {
  type: PropTypes.string,
  tooltip: PropTypes.element,
  onClick: PropTypes.func,
};

ButtonWithTooltip.defaultProps = {
  type: 'button',
  tooltip: null,
  onClick: null,
};

export default memo(ButtonWithTooltip);
