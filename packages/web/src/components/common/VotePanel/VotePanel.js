import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';

import { userType } from 'types';
import { votesType, contentIdType } from 'types/common';
import { UPVOTE, DOWNVOTE, UNVOTE } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { displayError, displayWarning } from 'utils/toastsMessages';
import FirstLikeTooltip from 'components/tooltips/FirstLikeTooltip';
import DonateTooltip from 'components/tooltips/DonateTooltip';
import { FEATURE_DONATE_MAKE } from 'shared/featureFlags';

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

  ${is('inComment')`
    width: 28px;
    height: 28px;
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

  ${is('inComment')`
    width: 18px;
    height: 18px;
  `};
`;

function VotePanel({
  inComment,
  inFeed,
  isFilled,
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
  const tooltipLikeRef = useRef(null);
  const tooltipDonateRef = useRef(null);
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

  useEffect(() => {
    if (isTooltipLikeVisible || isTooltipDonateVisible) {
      window.addEventListener('click', onAwayClick, true);
    }

    return () => {
      window.removeEventListener('click', onAwayClick, true);
    };
  }, [isTooltipLikeVisible, isTooltipDonateVisible, onAwayClick]);

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
    <Container>
      <Wrapper>
        <Action
          name={hasUpVote ? 'vote-panel__unvote' : 'vote-panel__upvote'}
          active={hasUpVote}
          isLock={isLock}
          isFilled={isFilled}
          isDisabled={isOwner}
          inComment={inComment}
          title={upVoteTitle}
          onClick={isLock ? null : onUpVoteClick}
        >
          <IconStyled
            name={isFilled && hasUpVote ? 'bold-long-arrow' : 'long-arrow'}
            reverse={1}
            inComment={inComment}
          />
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
          inComment={inComment}
          title={downVoteTitle}
          onClick={isLock ? null : onDownVoteClick}
        >
          <IconStyled
            name={isFilled && hasDownVote ? 'bold-long-arrow' : 'long-arrow'}
            inComment={inComment}
          />
        </Action>
      </Wrapper>
      {isTooltipLikeVisible && inFeed ? <FirstLikeTooltip tooltipRef={tooltipLikeRef} /> : null}
      {featureToggles[FEATURE_DONATE_MAKE] && isTooltipDonateVisible && entity.type === 'post' ? (
        <DonateTooltip tooltipRef={tooltipDonateRef} entity={entity} author={author} />
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
};

export default injectFeatureToggles([FEATURE_DONATE_MAKE])(VotePanel);
