import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { votesType, contentIdType } from 'types/common';
import { displayError } from 'utils/toastsMessages';

const DEFAULT_VOTE_WEIGHT = 10000;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  padding: 0 7px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.background};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50% 0 0 50%;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.15s;

  &:not(:first-child) {
    border-radius: 0 50% 50% 0;
  }

  ${is('positive')`
    padding-left: 2px;

    &:focus,
    &:hover {
      color: ${({ theme }) => theme.colors.blue};
    }
  `};

  ${is('negative')`
    padding-right: 2px;

    &:focus,
    &:hover {
      color: ${({ theme }) => theme.colors.red};
    }
  `};

  ${is('active', 'positive')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  ${is('active', 'negative')`
    color: ${({ theme }) => theme.colors.red};
  `};

  ${is('inComment')`
    width: 28px;
    height: 28px;
  `};
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

export default class VotePanel extends Component {
  static propTypes = {
    entity: PropTypes.shape({
      type: PropTypes.oneOf(['post', 'comment']).isRequired,
      contentId: contentIdType.isRequired,
      votes: votesType.isRequired,
    }).isRequired,
    inComment: PropTypes.bool,
    vote: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    checkAuth: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inComment: false,
  };

  state = {
    isLock: false,
  };

  onUpVoteClick = () => {
    const { entity } = this.props;

    this.vote(entity.votes.hasUpVote ? 0 : DEFAULT_VOTE_WEIGHT);
  };

  onDownVoteClick = () => {
    const { entity } = this.props;

    this.vote(entity.votes.hasDownVote ? 0 : -DEFAULT_VOTE_WEIGHT);
  };

  vote = async weight => {
    // eslint-disable-next-line no-shadow
    const { entity, vote, fetchPost, waitForTransaction, checkAuth } = this.props;
    const { contentId } = entity;

    this.setState({
      isLock: true,
    });

    try {
      await checkAuth(true);
    } catch {
      return;
    }

    try {
      const result = await vote({
        contentId,
        type: entity.type,
        weight,
      });

      try {
        await waitForTransaction(result.transaction_id);

        if (entity.type === 'post') {
          await fetchPost(contentId);
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

    this.setState({
      isLock: false,
    });
  };

  render() {
    const { inComment, entity } = this.props;
    const { isLock } = this.state;

    const { votes } = entity;

    const upTitle = 'Vote Up';
    const downTitle = 'Vote Down';
    const cancelTitle = 'Cancel vote';

    const isUp = votes.hasUpVote;
    const isDown = votes.hasDownVote;

    return (
      <Wrapper>
        <Action
          positive
          name={isUp ? 'vote-panel__unvote' : 'vote-panel__upvote'}
          active={isUp}
          inComment={inComment}
          title={isUp ? cancelTitle : upTitle}
          onClick={isLock ? null : this.onUpVoteClick}
        >
          <IconStyled name="long-arrow" reverse={1} inComment={inComment} />
        </Action>
        <Value>{votes.upCount - votes.downCount}</Value>
        <Action
          negative
          name={isUp ? 'vote-panel__unvote' : 'vote-panel__downvote'}
          active={isDown}
          inComment={inComment}
          title={isDown ? cancelTitle : downTitle}
          onClick={isLock ? null : this.onDownVoteClick}
        >
          <IconStyled name="long-arrow" inComment={inComment} />
        </Action>
      </Wrapper>
    );
  }
}
