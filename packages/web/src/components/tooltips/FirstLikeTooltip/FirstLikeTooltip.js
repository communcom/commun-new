import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { Link } from 'shared/routes';

import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  position: absolute;
  bottom: -15px;
  left: -15px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 20px);
  padding: 14px 15px 20px;
  margin: 0 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: #fff;
  opacity: 0;
  transition: opacity 1s;

  @media (min-width: 360px) {
    width: 346px;
    margin: 0;
  }

  ${is('isMounted')`
    opacity: 1;
  `};
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  margin-bottom: 15px;
  border-radius: 100%;
  background-color: #fff;
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 25px;
  height: 25px;
`;

const TooltipDesc = styled.p`
  margin-bottom: 28px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
`;

const LearnMoreLink = styled.a`
  align-self: flex-end;
  margin-right: 18px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  text-decoration-line: underline;
`;

function FirstLikeTooltip({ tooltipRef, className }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Wrapper ref={tooltipRef} isMounted={isMounted} className={className}>
      <IconWrapper>
        <RewardIcon />
      </IconWrapper>
      <TooltipDesc>
        If you hold Points of this Community and this post will get to the “Top 10 of the day”, then
        you and the author would get more points as the reward.
      </TooltipDesc>
      <Link to="/faq#What else can you do with the points?" passHref>
        <LearnMoreLink>Learn more about reward</LearnMoreLink>
      </Link>
    </Wrapper>
  );
}

FirstLikeTooltip.propTypes = {
  tooltipRef: PropTypes.object.isRequired,
};

export default memo(FirstLikeTooltip);
