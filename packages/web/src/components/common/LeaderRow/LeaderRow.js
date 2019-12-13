import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, styles, up } from '@commun/ui';
import { displaySuccess } from 'utils/toastsMessages';
import { ProfileLink } from 'components/links';
import LeaderAvatar from 'components/common/LeaderAvatar';
import { ActionsItem, ActionsPanel } from 'containers/community/common';
import AsyncAction from 'components/common/AsyncAction';

const LeadersItem = styled.li`
  padding: 15px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const LeaderItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const LeaderAvatarStyled = styled(LeaderAvatar)`
  margin-left: -1px;
`;

const LeaderTextBlock = styled.div`
  margin: -2px 0 0 10px;
  overflow: hidden;
`;

const LeaderNameWrapper = styled.div``;

const LeaderName = styled.a`
  display: block;
  padding-bottom: 4px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  ${styles.overflowEllipsis};
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }

  ${up.tablet} {
    font-size: 17px;
  }
`;

const LeaderTitle = styled.div`
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    font-size: 12px;
  }
`;

const RatingPercent = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.blue};
`;

const InactiveStatus = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const WelcomeUrlBlock = styled.div`
  margin-top: 15px;
  line-height: 21px;
  font-size: 14px;
  overflow: hidden;
`;

const ActionsPanelStyled = styled(ActionsPanel)`
  display: flex;
  margin-left: auto;
`;

function renderUrlBlock(url) {
  let content;

  if (/^(https?:)?\/\//.test(url)) {
    content = (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    );
  } else {
    content = url;
  }

  return <WelcomeUrlBlock>{content}</WelcomeUrlBlock>;
}

export default function LeaderRow({
  currentUserId,
  communityId,
  leader,
  onVote,
  onChangeLoader,
  voteLeader,
  unVoteLeader,
  fetchProfile,
  waitForTransaction,
}) {
  const onVoteClick = async (leaderId, isVote) => {
    const action = isVote ? voteLeader : unVoteLeader;

    const { transaction_id: trxId } = await action({ communityId, leaderId });

    if (isVote) {
      displaySuccess('Successfully voted');
    } else {
      displaySuccess('Vote canceled');
    }

    setTimeout(async () => {
      if (onChangeLoader) {
        onChangeLoader(true);
      }

      try {
        await waitForTransaction(trxId);

        const promises = [];

        if (onVote) {
          promises.push(onVote());
        }

        if (leaderId === currentUserId) {
          promises.push(fetchProfile({ userId: currentUserId }));
        }

        await Promise.all(promises);
      } finally {
        if (onChangeLoader) {
          onChangeLoader(false);
        }
      }
    }, 0);
  };

  return (
    <LeadersItem key={leader.userId}>
      <LeaderItemContent>
        <ProfileLink user={leader.username} allowEmpty>
          <LeaderAvatarStyled userId={leader.userId} percent={leader.ratingPercent} useLink />
        </ProfileLink>
        <LeaderTextBlock>
          <LeaderNameWrapper>
            <ProfileLink user={leader.username} allowEmpty>
              <LeaderName>{leader.username || `id: ${leader.userId}`}</LeaderName>
            </ProfileLink>
            {leader.isActive ? null : (
              <>
                {' '}
                <InactiveStatus>(inactive)</InactiveStatus>
              </>
            )}
          </LeaderNameWrapper>
          <LeaderTitle>
            {leader.rating} points •{' '}
            <RatingPercent>{Math.round(leader.ratingPercent * 100)}%</RatingPercent>
          </LeaderTitle>
        </LeaderTextBlock>
        {typeof leader.isVoted === 'boolean' ? (
          <ActionsPanelStyled>
            <ActionsItem>
              <AsyncAction onClickHandler={() => onVoteClick(leader.userId, !leader.isVoted)}>
                <Button primary={!leader.isVoted}>{leader.isVoted ? 'Voted' : 'Vote'}</Button>
              </AsyncAction>
            </ActionsItem>
          </ActionsPanelStyled>
        ) : null}
      </LeaderItemContent>
      {leader.url ? renderUrlBlock(leader.url) : null}
    </LeadersItem>
  );
}

LeaderRow.propTypes = {
  currentUserId: PropTypes.string,
  communityId: PropTypes.string.isRequired,
  leader: PropTypes.shape({}),
  onVote: PropTypes.func,
  onChangeLoader: PropTypes.func,
  voteLeader: PropTypes.func.isRequired,
  unVoteLeader: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
};

LeaderRow.defaultProps = {
  currentUserId: null,
  leader: null,
  onVote: undefined,
  onChangeLoader: undefined,
};
