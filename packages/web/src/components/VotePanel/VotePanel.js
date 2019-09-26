import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { votesType } from 'types/common';
import { displayError } from 'utils/toastsMessages';
import { Icon } from '@commun/icons';

import { MODAL_CANCEL, SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';

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
  padding: 0 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.contextGrey};
  background: ${({ theme }) => theme.colors.contextWhite};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50% 0 0 50%;
  color: ${({ theme }) => theme.colors.contextGrey};
  background-color: ${({ theme }) => theme.colors.contextWhite};
  transition: background-color 0.15s;

  &:not(:first-child) {
    border-radius: 0 50% 50% 0;
  }

  ${is('positive')`
    &:focus,
    &:hover {
      color: ${({ theme }) => theme.colors.contextBlue};
    }
  `};

  ${is('negative')`
    &:focus,
    &:hover {
      color: ${({ theme }) => theme.colors.contextRed};
    }
  `};

  ${is('active', 'positive')`
    color: ${({ theme }) => theme.colors.contextBlue};
  `};

  ${is('active', 'negative')`
    color: ${({ theme }) => theme.colors.contextRed};
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
      // payout: payoutType.isRequired, // TODO: after refactoring prism
      votes: votesType.isRequired,
    }).isRequired,
    inComment: PropTypes.bool,
    loggedUserId: PropTypes.string,
    totalPayout: PropTypes.number.isRequired,

    vote: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inComment: false,
    loggedUserId: null,
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
    const { entity, vote, fetchPost, waitForTransaction, loggedUserId, openModal } = this.props;
    const { contentId } = entity;

    this.setState({
      isLock: true,
    });

    if (!loggedUserId) {
      const result = await openModal(SHOW_MODAL_LOGIN);
      if (result.status === MODAL_CANCEL) {
        return;
      }
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
    const { inComment, entity, totalPayout } = this.props;
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
        <Value>{totalPayout}</Value>
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
