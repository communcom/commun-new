import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Badge = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 5px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50px;
`;

const RewardIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background-color: #fff;
  border-radius: 100%;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 14px;
  height: 14px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 44px;
  right: -34px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 236px;
  height: 110px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 6px;

  &::after {
    position: absolute;
    top: 0;
    right: 52px;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: #fff;
    transform: rotate(45deg) translateY(-50%);
  }
`;

const TooltipHeader = styled.h5`
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

const TooltipInfo = styled.p`
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const TooltipLink = styled.a`
  margin-top: auto;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.blue};
`;

// TODO: locales in future
const locales = [
  {
    header: 'This post has been rewarded',
    info: 'This publication was interesting for Community members',
  },
  {
    header: 'This post is featured in Top',
    info: 'After a given time, it will get the reward',
  },
];

function RewardsBadge({ reward, isClosed, topCount }) {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  const tooltipRef = useRef(null);

  const onAwayClick = useCallback(
    e => {
      if (isTooltipVisible && !tooltipRef.current?.contains(e.target)) {
        setTooltipVisibility(false);
      }
    },
    [isTooltipVisible]
  );

  useEffect(() => {
    if (isTooltipVisible) {
      window.addEventListener('click', onAwayClick);
    }

    return () => {
      window.removeEventListener('click', onAwayClick);
    };
  }, [isTooltipVisible, onAwayClick]);

  function onClick(e) {
    e.preventDefault();

    setTooltipVisibility(prevTooltipVisibility => !prevTooltipVisibility);
  }

  function getTitle() {
    let title;

    if (isClosed) {
      title = parseFloat(reward);
    }

    if (!isClosed && topCount) {
      title = 'Top';
    }

    return title;
  }

  const title = getTitle();

  if (!title) {
    return null;
  }

  const { header, info } = locales[isClosed ? 0 : 1];

  return (
    <Wrapper>
      <Badge onClick={onClick}>
        <RewardIconWrapper>
          <RewardIcon />
        </RewardIconWrapper>
        <Title>{title}</Title>
      </Badge>
      {isTooltipVisible ? (
        <Tooltip tooltipRef={tooltipRef}>
          <TooltipHeader>{header}</TooltipHeader>
          <TooltipInfo>{info}</TooltipInfo>
          <Link to="/faq#What else can you do with the points?" passHref>
            <TooltipLink>Learn more about reward</TooltipLink>
          </Link>
        </Tooltip>
      ) : null}
    </Wrapper>
  );
}

RewardsBadge.propTypes = {
  reward: PropTypes.string,
  topCount: PropTypes.number,
  isClosed: PropTypes.bool,
};

RewardsBadge.defaultProps = {
  reward: null,
  topCount: 0,
  isClosed: false,
};

export default RewardsBadge;
