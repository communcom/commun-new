import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, styles, up } from '@commun/ui';

import { leaderType } from 'types';
import { useTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';

import { ActionsItem, ActionsPanel } from 'containers/community/common';
import AsyncAction from 'components/common/AsyncAction';
import LeaderAvatar from 'components/common/LeaderAvatar';
import { ProfileLink } from 'components/links';

const LeadersItem = styled.li`
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const LeaderItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const LeaderAvatarStyled = styled(LeaderAvatar)`
  margin-left: -1px;
`;

const LeaderTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -2px 0 0 10px;
  overflow: hidden;
`;

const LeaderNameWrapper = styled.div``;

const LeaderName = styled.a`
  display: block;
  padding-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  ${styles.overflowEllipsis};
  color: ${({ theme }) => theme.colors.black};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const LeaderTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-transform: lowercase;
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
  voteLeaderWithCheck,
  unVoteLeader,
  fetchProfile,
  waitForTransaction,
}) {
  const { t } = useTranslation();

  const onVoteClick = async (leaderId, isVote) => {
    const action = isVote ? voteLeaderWithCheck : unVoteLeader;

    const result = await action({ communityId, leaderId });

    if (!result) {
      return;
    }

    const trxId = result.transaction_id;

    if (isVote) {
      displaySuccess(t('components.leader_row.toastsMessages.success_vote'));
    } else {
      displaySuccess(t('components.leader_row.toastsMessages.canceled_vote'));
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
                <InactiveStatus>({t('components.leader_row.inactive')})</InactiveStatus>
              </>
            )}
          </LeaderNameWrapper>
          <LeaderTitle>
            {leader.rating} {t('common.point', { count: leader.rating })} •{' '}
            <RatingPercent>{Math.round(leader.ratingPercent * 100)}%</RatingPercent>
          </LeaderTitle>
        </LeaderTextBlock>
        {typeof leader.isVoted === 'boolean' ? (
          <ActionsPanelStyled>
            <ActionsItem>
              <AsyncAction onClickHandler={() => onVoteClick(leader.userId, !leader.isVoted)}>
                <Button primary={!leader.isVoted}>
                  {leader.isVoted
                    ? t('components.leader_row.voted')
                    : t('components.leader_row.vote')}
                </Button>
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
  leader: leaderType,
  onVote: PropTypes.func,
  onChangeLoader: PropTypes.func,
  voteLeaderWithCheck: PropTypes.func.isRequired,
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
