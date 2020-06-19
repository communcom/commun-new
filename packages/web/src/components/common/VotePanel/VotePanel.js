import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { userType } from 'types';
import { contentIdType, votesType } from 'types/common';
import { DOWNVOTE, UNVOTE, UPVOTE } from 'shared/constants';
import { FEATURE_DONATE_MAKE } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { displayError, displayWarning } from 'utils/toastsMessages';

import DonateTooltip from 'components/tooltips/DonateTooltip';
import FirstLikeTooltip from 'components/tooltips/FirstLikeTooltip';

const Container = styled.div`
  position: relative;
  display: flex;
  z-index: 11;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 4;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 7px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  word-break: normal;
  color: ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('active')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  ${is('isFilled')`
    color: ${({ theme }) => theme.colors.lightGrayBlue};
    background-color: ${({ theme }) => theme.colors.blue};

    ${is('active')`
      color: #fff;
    `};
  `};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 34px;
  padding-left: 2px;
  border-radius: 50% 0 0 50%;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  transition: color 0.15s ease-in-out;

  &:not(:first-child) {
    border-radius: 0 50% 50% 0;
  }

  ${is('active')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  ${is('isFilled')`
    color: ${({ theme }) => theme.colors.lightGrayBlue};
    background-color: ${({ theme }) => theme.colors.blue};

    ${is('active')`
      color: #fff;
    `};
  `};

  ${({ isLock, isDisabled }) => {
    if (isDisabled) {
      return 'cursor: default;';
    }

    if (isLock) {
      return 'cursor: progress;';
    }

    return `
      &:hover {
        color: ${({ theme }) => theme.colors.blue};
      }
    `;
  }};
`;

const IconStyled = styled(Icon)`
  width: 22px;
  height: 22px;

  ${is('reverse')`
    transform: rotate(180deg);
  `};
`;

const DonateTooltipStyled = styled(DonateTooltip)`
  ${({ left }) => `
    left: -${left}px;
  `}
`;

function VotePanel({
  inComment,
  inFeed,
  isFilled,
  isMobile,
  entity,
  author,
  vote,
  isOwner,
  fetchPost,
  fetchComment,
  waitForTransaction,
  checkAuth,
  featureToggles,
}) {
  const { t } = useTranslation();
  const votePanelRef = useRef(null);
  const tooltipLikeRef = useRef(null);
  const tooltipDonateRef = useRef(null);
  const [left, setLeft] = useState(0);
  const [arrowLeft, setArrowLeft] = useState(0);
  const [isLock, setIsLock] = useState(false);
  const [isTooltipLikeVisible, setTooltipLikeVisibility] = useState(false);
  const [isTooltipDonateVisible, setTooltipDonateVisibility] = useState(false);

  const { hasUpVote, hasDownVote, upCount, downCount } = entity.votes;

  const onAwayClick = useCallback(
    e => {
      if (isTooltipLikeVisible && !tooltipLikeRef.current?.contains(e.target)) {
        setTooltipLikeVisibility(false);
      }

      if (isTooltipDonateVisible && !tooltipDonateRef.current?.contains(e.target)) {
        setTooltipDonateVisibility(false);
      }
    },
    [isTooltipLikeVisible, isTooltipDonateVisible]
  );

  const donationReposition = useCallback(
    throttle(() => {
      // fix for mobile - https://github.com/communcom/commun/issues/2449
      if (inComment && isMobile && votePanelRef.current) {
        const votePanelLeft = votePanelRef.current.getBoundingClientRect().left;
        setLeft(votePanelLeft);
        setArrowLeft(votePanelLeft + votePanelRef.current.getBoundingClientRect().width / 2 - 7); // 7 is half width of DonateTooltip

        // reset to default
      } else if (left || arrowLeft) {
        setLeft(0);
        setArrowLeft(0);
      }
    }, 500),
    [isMobile]
  );

  useEffect(() => {
    if (isTooltipLikeVisible || isTooltipDonateVisible) {
      window.addEventListener('click', onAwayClick, true);
    }

    window.addEventListener('resize', donationReposition, true);

    return () => {
      window.removeEventListener('click', onAwayClick, true);
      window.removeEventListener('resize', donationReposition, true);
    };
  }, [isTooltipLikeVisible, isTooltipDonateVisible, onAwayClick, donationReposition]);

  async function handleVote(action) {
    const { contentId, type } = entity;

    setIsLock(true);

    try {
      await checkAuth({ allowLogin: true });
    } catch {
      setIsLock(false);
      return;
    }

    try {
      // tracking first user's like on commun for showing tooltip
      const isFirstLike = localStorage.getItem('isLiked');

      if (action === UPVOTE && isFirstLike) {
        donationReposition();
        setTooltipDonateVisibility(true);
      }

      const result = await vote({
        action,
        type,
        contentId,
      });

      if (action === UPVOTE && !isFirstLike) {
        localStorage.setItem('isLiked', true);
        setTooltipLikeVisibility(true);
      }

      try {
        await waitForTransaction(result.transaction_id);
        if (type === 'post') {
          await fetchPost(contentId);
        } else if (type === 'comment') {
          await fetchComment({ contentId });
        }
      } catch {
        // Do nothing
      }
    } catch (err) {
      displayError(err);
    }

    setIsLock(false);
  }

  function onUpVoteClick() {
    if (isOwner) {
      displayWarning(t('components.vote_panel.cant_cancel_own'));
      return;
    }

    handleVote(entity.votes.hasUpVote ? UNVOTE : UPVOTE);
  }

  function onDownVoteClick() {
    if (isOwner) {
      displayWarning(t('components.vote_panel.cant_down_own'));
      return;
    }

    handleVote(entity.votes.hasDownVote ? UNVOTE : DOWNVOTE);
  }

  let upVoteTitle = null;
  let downVoteTitle = null;

  if (!isOwner) {
    if (hasUpVote) {
      upVoteTitle = t('components.vote_panel.cancel');
    } else {
      upVoteTitle = t('components.vote_panel.vote_up');
    }

    if (hasDownVote) {
      downVoteTitle = t('components.vote_panel.cancel');
    } else {
      downVoteTitle = t('components.vote_panel.vote_down');
    }
  }

  return (
    <Container ref={votePanelRef}>
      <Wrapper>
        <Action
          name={hasUpVote ? 'vote-panel__unvote' : 'vote-panel__upvote'}
          active={hasUpVote}
          isLock={isLock}
          isFilled={isFilled}
          isDisabled={isOwner}
          title={upVoteTitle}
          onClick={isLock ? null : onUpVoteClick}
        >
          <IconStyled name={isFilled && hasUpVote ? 'bold-long-arrow' : 'long-arrow'} reverse={1} />
        </Action>
        <Value active={hasUpVote} isFilled={isFilled}>
          {upCount - downCount}
        </Value>
        <Action
          name={hasDownVote ? 'vote-panel__unvote' : 'vote-panel__downvote'}
          active={hasDownVote}
          isLock={isLock}
          isFilled={isFilled}
          isDisabled={isOwner}
          title={downVoteTitle}
          onClick={isLock ? null : onDownVoteClick}
        >
          <IconStyled name={isFilled && hasDownVote ? 'bold-long-arrow' : 'long-arrow'} />
        </Action>
      </Wrapper>
      {isTooltipLikeVisible && inFeed ? <FirstLikeTooltip tooltipRef={tooltipLikeRef} /> : null}
      {featureToggles[FEATURE_DONATE_MAKE] && isTooltipDonateVisible ? (
        <DonateTooltipStyled
          tooltipRef={tooltipDonateRef}
          entity={entity}
          author={author}
          left={left}
          arrowLeft={arrowLeft}
        />
      ) : null}
    </Container>
  );
}

VotePanel.propTypes = {
  entity: PropTypes.shape({
    type: PropTypes.oneOf(['post', 'comment']).isRequired,
    contentId: contentIdType.isRequired,
    votes: votesType.isRequired,
  }).isRequired,
  author: userType,
  inComment: PropTypes.bool,
  inFeed: PropTypes.bool,
  isFilled: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,

  vote: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  checkAuth: PropTypes.func.isRequired,
  featureToggles: PropTypes.object.isRequired,
};

VotePanel.defaultProps = {
  author: null,
  inComment: false,
  inFeed: false,
  isFilled: false,
  isMobile: false,
};

export default injectFeatureToggles([FEATURE_DONATE_MAKE])(VotePanel);
