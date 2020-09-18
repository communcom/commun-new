import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar, Button, CloseButton, up } from '@commun/ui';

import { commentType, postType, userType } from 'types';
import { FEATURE_POST_GET_REWARD } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';

import EmptyList from 'components/common/EmptyList';
import { CommunityLink } from 'components/links';
import ProfileLink from 'components/links/ProfileLink';
import DonationRow from 'components/modals/Donations/DonationRow';
import { Wrapper } from '../common/common.styled';

const WrapperStyled = styled(Wrapper)`
  & {
    padding: 0;
    overflow: hidden;
  }
`;

const DescriptionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 20px 10px 15px;
`;

const TotalInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.a``;

const Info = styled.div`
  margin-left: 10px;
`;

const TotalPoints = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  text-transform: lowercase;
  color: ${({ theme }) => theme.colors.black};
`;

const PostInfo = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const UserWrapper = styled.a`
  color: ${({ theme }) => theme.colors.gray};
`;

const BlueLink = styled.a``;

const PointsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 64px;
    padding: 0 30px;
  }
`;

const PointsGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;

  ${up.tablet} {
    flex-direction: row;
    margin: 0;
  }
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;

  & :not(:last-child) {
    margin-bottom: 10px;
  }

  ${up.tablet} {
    & :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

const PointsInfo = styled.div`
  margin-left: 15px;
`;

const PointsValue = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.black};
`;

const PointsField = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 50%;
`;

const TrophyIcon = styled(Icon).attrs({ name: 'trophy' })`
  width: 21px;
  height: 21px;
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 21px;
  height: 21px;
`;

const DonateButton = styled(Button)`
  margin: 10px 0;

  ${up.tablet} {
    margin: 0;
  }
`;

const DonatesList = styled.div`
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

const ClaimWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 13px 0 35px;
`;

const ClaimDescription = styled.div`
  margin-top: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  max-width: 370px;
`;

const ClaimValue = styled.div`
  margin: 15px 0 20px;
  font-weight: 600;
  font-size: 19px;
  color: ${({ theme }) => theme.colors.green};
  text-transform: lowercase;
`;

const CoinsIcon = styled(Icon).attrs({ name: 'coins' })`
  width: 116px;
  height: 92px;
`;

const DonatesTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const EmptyIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
  background: url('/images/present.png') 50% 50% no-repeat;
  background-size: 32px;
`;

const Donations = ({
  isComment,
  isOwner,
  entity,
  author,
  donations: { donations, totalAmount },
  reward: { displayReward, reward, userClaimableReward },
  featureToggles,
  claimPost,
  openDonateModal,
  close,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleRouteChange = () => {
    close();
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  });

  const handleCloseClick = () => close();

  const handleDonateClick = () => openDonateModal(author, entity.contentId);

  const handleClaimClick = () => claimPost(entity.contentId);

  const rewardAmount = parseFloat(displayReward || 0) || parseFloat(reward || 0);

  return (
    <WrapperStyled>
      <DescriptionHeader>
        <TotalInfo>
          <ProfileLink user={author}>
            <AvatarWrapper>
              <Avatar size="large" avatarUrl={author.avatarUrl} />
            </AvatarWrapper>
          </ProfileLink>
          <Info>
            <TotalPoints>
              {(parseFloat(totalAmount || 0) + parseFloat(rewardAmount)).toFixed(3)}{' '}
              {t('common.point', { count: parseFloat(totalAmount) })}
            </TotalPoints>
            <PostInfo>
              <ProfileLink user={author}>
                <UserWrapper>
                  {t(`modals.donations.${isComment ? 'comment_author' : 'post_author'}`, {
                    author: author.username,
                  })}
                </UserWrapper>
              </ProfileLink>
              {` \u2022 `}
              <CommunityLink community={entity.community}>
                <BlueLink>
                  {t('modals.donations.in_community', { community: entity.community.name })}
                </BlueLink>
              </CommunityLink>
            </PostInfo>
          </Info>
        </TotalInfo>
        <CloseButton onClick={handleCloseClick} />
      </DescriptionHeader>
      <PointsWrapper>
        <PointsGroup>
          <Points>
            <CircleWrapper>
              <TrophyIcon />
            </CircleWrapper>
            <PointsInfo>
              <PointsValue>{parseFloat(rewardAmount).toFixed(3)}</PointsValue>
              <PointsField>{t('modals.donations.rewards')}</PointsField>
            </PointsInfo>
          </Points>
          <Points>
            <CircleWrapper>
              <RewardIcon />
            </CircleWrapper>
            <PointsInfo>
              <PointsValue>{totalAmount || 0}</PointsValue>
              <PointsField>{t('modals.donations.donations')}</PointsField>
            </PointsInfo>
          </Points>
        </PointsGroup>
        {!isOwner ? (
          <DonateButton onClick={handleDonateClick}>{t('modals.donations.donate')}</DonateButton>
        ) : null}
      </PointsWrapper>

      <DonatesList>
        {featureToggles[FEATURE_POST_GET_REWARD] && isOwner && userClaimableReward ? (
          <ClaimWrapper>
            <CoinsIcon />
            <ClaimDescription
              dangerouslySetInnerHTML={{ __html: t('modals.donations.claim_desc') }}
            />
            <ClaimValue>
              {parseFloat(userClaimableReward).toFixed(3)}{' '}
              {t('common.point', { count: parseFloat(userClaimableReward) })}
            </ClaimValue>
            <Button primary onClick={handleClaimClick}>
              {t('modals.donations.get_reward')}
            </Button>
          </ClaimWrapper>
        ) : null}
        {donations && donations.length ? (
          <>
            <DonatesTitle>{t('modals.donations.donators')}</DonatesTitle>
            {donations.map(donation => (
              <DonationRow donation={donation} />
            ))}
          </>
        ) : (
          <EmptyList
            icon={<EmptyIcon />}
            headerText={t('modals.donations.no_found')}
            subText={t(`modals.donations.no_found_desc_${isComment ? 'comment' : 'post'}`)}
          >
            {!isOwner ? (
              <Button primary onClick={handleDonateClick}>
                {t('modals.donations.donate')}
              </Button>
            ) : null}
          </EmptyList>
        )}
      </DonatesList>
    </WrapperStyled>
  );
};

Donations.propTypes = {
  isComment: PropTypes.bool,
  isOwner: PropTypes.bool,
  entity: PropTypes.oneOfType([postType, commentType]).isRequired,
  author: userType.isRequired,
  reward: PropTypes.object.isRequired,
  donations: PropTypes.object.isRequired,

  featureToggles: PropTypes.object.isRequired,
  claimPost: PropTypes.func.isRequired,
  openDonateModal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

Donations.defaultProps = {
  isComment: false,
  isOwner: false,
};

export default injectFeatureToggles([FEATURE_POST_GET_REWARD])(Donations);
