import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { contentIdType } from 'types';
import { REWARDS_BADGE_NAME } from 'shared/constants';
import { FEATURE_POST_CONVERTED_REWARD } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

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
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 100%;
`;

const TitleWrapper = styled.p`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 14px;
  height: 14px;
`;

const ClaimedIcon = styled(Icon).attrs({ name: 'claimed' })`
  width: 14px;
  height: 14px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 44px;
  right: -34px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 236px;
  height: 110px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
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
    background-color: ${({ theme }) => theme.colors.white};
    transform: rotate(45deg) translateY(-50%);
  }
`;

const TooltipHeader = styled.h5`
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.black};
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

function RewardsBadge({
  reward: { reward, contentId, isClosed, topCount, userClaimableReward, convertedReward },
  isOwner,
  claimPost,
  className,
  featureFlags,
}) {
  const { t } = useTranslation();
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

    if (isOwner && userClaimableReward) {
      claimPost(contentId);
    }
  }

  function getTitle() {
    let rewardAmount = parseFloat(reward);

    if (convertedReward && featureFlags[FEATURE_POST_CONVERTED_REWARD]) {
      rewardAmount = `${convertedReward.usd}$`;
    }

    if (isClosed) {
      return rewardAmount;
    }

    if (!isClosed && topCount > 1) {
      return `${t('components.rewards_badge.top')}: ${rewardAmount}`;
    }

    return null;
  }

  const title = getTitle();

  if (!title) {
    return null;
  }

  const header = isClosed
    ? t('components.rewards_badge.title-rewarded')
    : t('components.rewards_badge.title');
  const desc = isClosed
    ? t('components.rewards_badge.desc-rewarded')
    : t('components.rewards_badge.desc');

  return (
    <Wrapper className={className}>
      <Badge name={REWARDS_BADGE_NAME} onClick={onClick}>
        <RewardIconWrapper>
          {!isOwner || userClaimableReward ? <RewardIcon /> : <ClaimedIcon />}
        </RewardIconWrapper>
        <TitleWrapper>{title}</TitleWrapper>
      </Badge>
      {isTooltipVisible ? (
        <Tooltip tooltipRef={tooltipRef}>
          <TooltipHeader>{header}</TooltipHeader>
          <TooltipInfo>{desc}</TooltipInfo>
          <Link to="/faq#4" passHref>
            <TooltipLink>{t('components.rewards_badge.learn_more')}</TooltipLink>
          </Link>
        </Tooltip>
      ) : null}
    </Wrapper>
  );
}

RewardsBadge.propTypes = {
  reward: PropTypes.shape({
    reward: PropTypes.string,
    contentId: contentIdType.isRequired,
    topCount: PropTypes.number,
    userClaimableReward: PropTypes.number,
    isClosed: PropTypes.bool,
    convertedReward: PropTypes.shape({
      cmn: PropTypes.string,
      usd: PropTypes.string,
    }),
  }),
  isOwner: PropTypes.bool,
  claimPost: PropTypes.func.isRequired,
  featureFlags: PropTypes.object.isRequired,
};

RewardsBadge.defaultProps = {
  reward: {
    reward: null,
    topCount: 0,
    userClaimableReward: 0,
    isClosed: false,
    convertedReward: undefined,
  },
  isOwner: false,
};

export default RewardsBadge;
