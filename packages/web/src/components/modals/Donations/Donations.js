import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar, Button, CloseButton, up } from '@commun/ui';

import { commentType, postType, userType } from 'types';
import { useTranslation } from 'shared/i18n';

import { CommunityLink } from 'components/links';
import ProfileLink from 'components/links/ProfileLink';
import DonationRow from 'components/modals/Donations/DonationRow';
import { Wrapper } from '../common/common.styled';

const WrapperStyled = styled(Wrapper)`
  & {
    padding: 0;
    flex-basis: 360px;

    ${up.tablet} {
      flex-basis: 390px;
    }
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
  flex-wrap: wrap;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 64px;
    padding: 0 30px;
  }
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
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
  hegith: 21px;
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 21px;
  hegith: 21;
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
`;

const DonatesTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Donations = ({
  isComment,
  isOwner,
  entity,
  author,
  donations: { donations, totalAmount },
  reward: { displayReward, reward },
  openDonateModal,
  closeTopModal,
  close,
}) => {
  const { t } = useTranslation();

  const handleCloseClick = () => close();

  const handleDonateClick = () => openDonateModal(author, entity.contentId);

  const handleLinkClick = () => closeTopModal();

  const rewardAmount = parseFloat(displayReward || 0) || parseFloat(reward || 0);

  return (
    <WrapperStyled>
      <DescriptionHeader>
        <TotalInfo>
          <ProfileLink user={author}>
            <AvatarWrapper onClick={handleLinkClick}>
              <Avatar size="large" avatarUrl={author.avatarUrl} />
            </AvatarWrapper>
          </ProfileLink>
          <Info>
            <TotalPoints>
              {parseFloat(totalAmount || 0) + rewardAmount}{' '}
              {t('common.point', { count: parseFloat(totalAmount) })}
            </TotalPoints>
            <PostInfo>
              <ProfileLink user={author}>
                <UserWrapper onClick={handleLinkClick}>
                  {t(`modals.donations.${isComment ? 'comment_author' : 'post_author'}`, {
                    author: author.username,
                  })}
                </UserWrapper>
              </ProfileLink>
              {` \u2022 `}
              <CommunityLink community={entity.community}>
                <BlueLink onClick={handleLinkClick}>
                  {t('modals.donations.in_community', { community: entity.community.name })}
                </BlueLink>
              </CommunityLink>
            </PostInfo>
          </Info>
        </TotalInfo>
        <CloseButton onClick={handleCloseClick} />
      </DescriptionHeader>
      <PointsWrapper>
        <Points>
          <CircleWrapper>
            <TrophyIcon />
          </CircleWrapper>
          <PointsInfo>
            <PointsValue>{rewardAmount}</PointsValue>
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
        {!isOwner ? (
          <DonateButton onClick={handleDonateClick}>{t('modals.donations.donate')}</DonateButton>
        ) : null}
      </PointsWrapper>
      {donations && donations.length ? (
        <DonatesList>
          <DonatesTitle>{t('modals.donations.donators')}</DonatesTitle>
          {donations.map(donation => (
            <DonationRow donation={donation} />
          ))}
        </DonatesList>
      ) : null}
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

  openDonateModal: PropTypes.func.isRequired,
  closeTopModal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

Donations.defaultProps = {
  isComment: false,
  isOwner: false,
};

export default Donations;
