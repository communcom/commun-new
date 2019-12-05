import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';

import { votesType, contentIdType } from 'types/common';
import { UPVOTE, DOWNVOTE, UNVOTE } from 'shared/constants';
import { displayError } from 'utils/toastsMessages';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

  ${isNot('isLock')`
    &:hover {
      color: ${({ theme }) => theme.colors.blue};
    }
  `};

  ${is('active')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  ${is('inComment')`
    width: 28px;
    height: 28px;
  `};
`;

const IconStyled = styled(Icon)`
  width: 22px;
  height: 22px;

  ${is('isLock')`
    cursor: progress;
  `};

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
  entity,
  vote,
  fetchPost,
  fetchComment,
  waitForTransaction,
  checkAuth,
}) {
  const [isLock, setIsLock] = useState(false);
  const { hasUpVote, hasDownVote, upCount, downCount } = entity.votes;

  const cancelTitle = 'Cancel vote';

  async function handleVote(action) {
    const { contentId, type } = entity;

    setIsLock(true);

    try {
      await checkAuth(true);
    } catch {
      return;
    }

    try {
      const result = await vote({
        action,
        type,
        contentId,
      });

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
      // eslint-disable-next-line no-console
      console.error(err);
      // TODO: replace by toastr
      // eslint-disable-next-line no-undef,no-alert
      displayError(err);
    }

    setIsLock(false);
  }

  function onUpVoteClick() {
    handleVote(entity.votes.hasUpVote ? UNVOTE : UPVOTE);
  }

  function onDownVoteClick() {
    handleVote(entity.votes.hasDownVote ? UNVOTE : DOWNVOTE);
  }

  return (
    <Wrapper>
      <Action
        name={hasUpVote ? 'vote-panel__unvote' : 'vote-panel__upvote'}
        active={hasUpVote}
        isLock={isLock}
        inComment={inComment}
        title={hasUpVote ? cancelTitle : 'Vote Up'}
        onClick={isLock ? null : onUpVoteClick}
      >
        <IconStyled isLock={isLock} name="long-arrow" reverse={1} inComment={inComment} />
      </Action>
      <Value active={hasUpVote}>{upCount - downCount}</Value>
      <Action
        name={hasDownVote ? 'vote-panel__unvote' : 'vote-panel__downvote'}
        active={hasDownVote}
        isLock={isLock}
        inComment={inComment}
        title={hasDownVote ? cancelTitle : 'Vote Down'}
        onClick={isLock ? null : onDownVoteClick}
      >
        <IconStyled isLock={isLock} name="long-arrow" inComment={inComment} />
      </Action>
    </Wrapper>
  );
}

VotePanel.propTypes = {
  entity: PropTypes.shape({
    type: PropTypes.oneOf(['post', 'comment']).isRequired,
    contentId: contentIdType.isRequired,
    votes: votesType.isRequired,
  }).isRequired,
  inComment: PropTypes.bool,

  vote: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  checkAuth: PropTypes.func.isRequired,
};

VotePanel.defaultProps = {
  inComment: false,
};
