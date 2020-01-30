import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { votesType, contentIdType } from 'types/common';
import { UPVOTE, DOWNVOTE, UNVOTE } from 'shared/constants';
import { displayError, displayWarning } from 'utils/toastsMessages';
import FirstLikeTooltip from 'components/tooltips/FirstLikeTooltip';

const Container = styled.div`
  position: relative;
  z-index: 5;
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

export default function VotePanel({
  inComment,
  inFeed,
  entity,
  vote,
  isOwner,
  fetchPost,
  fetchComment,
  waitForTransaction,
  checkAuth,
}) {
  const [isLock, setIsLock] = useState(false);
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  const { hasUpVote, hasDownVote, upCount, downCount } = entity.votes;

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

  async function handleVote(action) {
    const { contentId, type } = entity;

    setIsLock(true);

    try {
      await checkAuth(true);
    } catch {
      setIsLock(false);
      return;
    }

    try {
      const result = await vote({
        action,
        type,
        contentId,
      });
      // tracking first user's like on commun for showing tooltip
      const isFirstLike = localStorage.getItem('isLiked');

      if (!isFirstLike && action === UPVOTE) {
        localStorage.setItem('isLiked', true);
        setTooltipVisibility(true);
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
      displayWarning(`Can't cancel vote on own publication`);
      return;
    }

    handleVote(entity.votes.hasUpVote ? UNVOTE : UPVOTE);
  }

  function onDownVoteClick() {
    if (isOwner) {
      displayWarning(`Can't down vote your own publications`);
      return;
    }

    handleVote(entity.votes.hasDownVote ? UNVOTE : DOWNVOTE);
  }

  let upVoteTitle = null;
  let downVoteTitle = null;

  if (!isOwner) {
    if (hasUpVote) {
      upVoteTitle = 'Cancel vote';
    } else {
      upVoteTitle = 'Vote Up';
    }

    if (hasDownVote) {
      downVoteTitle = 'Cancel vote';
    } else {
      downVoteTitle = 'Vote Down';
    }
  }

  return (
    <Container>
      <Wrapper>
        <Action
          name={hasUpVote ? 'vote-panel__unvote' : 'vote-panel__upvote'}
          active={hasUpVote}
          isLock={isLock}
          isDisabled={isOwner}
          inComment={inComment}
          title={upVoteTitle}
          onClick={isLock ? null : onUpVoteClick}
        >
          <IconStyled name="long-arrow" reverse={1} inComment={inComment} />
        </Action>
        <Value active={hasUpVote}>{upCount - downCount}</Value>
        <Action
          name={hasDownVote ? 'vote-panel__unvote' : 'vote-panel__downvote'}
          active={hasDownVote}
          isLock={isLock}
          isDisabled={isOwner}
          inComment={inComment}
          title={downVoteTitle}
          onClick={isLock ? null : onDownVoteClick}
        >
          <IconStyled name="long-arrow" inComment={inComment} />
        </Action>
      </Wrapper>
      {isTooltipVisible && inFeed ? <FirstLikeTooltip tooltipRef={tooltipRef} /> : null}
    </Container>
  );
}

VotePanel.propTypes = {
  entity: PropTypes.shape({
    type: PropTypes.oneOf(['post', 'comment']).isRequired,
    contentId: contentIdType.isRequired,
    votes: votesType.isRequired,
  }).isRequired,
  inComment: PropTypes.bool,
  inFeed: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,

  vote: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  checkAuth: PropTypes.func.isRequired,
};

VotePanel.defaultProps = {
  inComment: false,
  inFeed: false,
};
