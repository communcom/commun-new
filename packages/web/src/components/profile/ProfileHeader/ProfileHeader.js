/* eslint-disable no-alert,no-console */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { styles, Button, InvisibleText, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { withTranslation } from 'shared/i18n';

import { profileType } from 'types/common';
import CoverImage from 'components/common/CoverImage';
import CoverAvatar from 'components/common/CoverAvatar';
import AsyncAction from 'components/common/AsyncAction';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { SHOW_MODAL_SEND_POINTS } from 'store/constants/modalTypes';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import Description from '../Description';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2px;
  background-color: #fff;

  ${up.desktop} {
    max-height: 340px;
    max-width: 850px;
    margin: 0 auto;
    margin-bottom: 2px;
  }
`;

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 50px 15px 20px;

  ${up.desktop} {
    flex-direction: row;
    padding: 15px;
    height: 110px;
    min-height: 110px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  padding-top: 5px;

  ${up.desktop} {
    padding: 0 0 0 10px;
  }

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const UsernameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0 10px;
  position: relative;

  ${up.desktop} {
    align-items: flex-start;
    padding: 0 0 5px;
  }
`;

const InfoContainer = styled.div`
  width: 100%;

  ${up.desktop} {
    padding-left: 15px;
  }
`;

const JoinedDate = styled.p`
  padding-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.desktop} {
    padding-bottom: 0;
  }
`;

const MoreActions = styled.button.attrs({ type: 'button' })`
  display: none;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 48px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  transition: color 0.15s;

  ${up.desktop} {
    display: flex;
    color: ${({ theme }) => theme.colors.gray};
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.blueHover};
    }
  }

  ${is('isMobile')`
    display: flex;

    ${up.desktop} {
      display: none;
    }
  `};
`;

const CoverAvatarStyled = styled(CoverAvatar)`
  && {
    position: absolute;
    top: -55px;
    width: 110px;
    height: 110px;
    flex-shrink: 0;
    border: 5px solid #fff;
    border-radius: 50%;
    background-color: #fff;
    z-index: 1;

    ${up.desktop} {
      position: relative;
      top: 0;
      width: 80px;
      height: 80px;
      border: none;
    }
  }
`;

const Username = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 27px;
  color: #000;

  ${styles.breakWord};

  ${up.desktop} {
    font-size: 30px;
    line-height: 1;
    margin: 0 10px 4px 0;
  }
`;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 24px;
  height: 24px;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  ${is('isMobile')`
    position: absolute;
    top: 28px;
    right: 12px;
    z-index: 5;
  `};
`;

const FollowButton = styled(Button)`
  min-width: 100px;
  text-align: center;
`;

@withTranslation()
export default class ProfileHeader extends PureComponent {
  static propTypes = {
    loggedUserId: PropTypes.string,
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    screenType: PropTypes.string.isRequired,

    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  onBlockClick = async () => {
    const { profile, blockUser, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await blockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { profile, unblockUser, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await unblockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onSubscribeClick = async () => {
    const { profile, pin, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await pin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { profile, unpin, fetchProfile, waitForTransaction } = this.props;

    try {
      const result = await unpin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onAvatarUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      avatarUrl: url,
    });
  };

  onCoverUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      coverUrl: url,
    });
  };

  sendPointsHandler = () => {
    const { openModal, profile } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS, { userId: profile.userId });
  };

  renderDropDownMenu = (isMobile, isBlocked) => (
    <DropDownMenuStyled
      align="right"
      openAt="bottom"
      isMobile={isMobile}
      handler={props => (
        <MoreActions {...props} name="profile-header__more-actions" isMobile={isMobile}>
          <MoreIcon />
          <InvisibleText>More</InvisibleText>
        </MoreActions>
      )}
      items={() => (
        <DropDownMenuItem
          name={isBlocked ? 'profile-header__unblock-user' : 'profile-header__block-user'}
          onClick={isBlocked ? this.onUnblockClick : this.onBlockClick}
        >
          {isBlocked ? 'Unblock' : 'Block'}
        </DropDownMenuItem>
      )}
    />
  );

  render() {
    const { isOwner, profile, loggedUserId } = this.props;
    const { userId, username, isBlocked } = profile;
    const isSubscribed = profile.isSubscribed || false;

    return (
      <Wrapper>
        <CoverImage userId={userId} editable={isOwner} onUpdate={this.onCoverUpdate} />
        {!isOwner && loggedUserId ? this.renderDropDownMenu(true, isBlocked) : null}
        <InfoWrapper>
          <CoverAvatarStyled userId={userId} editable={isOwner} onUpdate={this.onAvatarUpdate} />
          <InfoContainer>
            <UsernameWrapper>
              <Username>{username}</Username>
              <JoinedDate>
                Joined{' '}
                {profile
                  ? dayjs(profile.registration.time).format('MMMM D, YYYY')
                  : '{Profile is not available}'}
              </JoinedDate>
            </UsernameWrapper>
            <Description profile={profile} isOwner={isOwner} isCompact />
          </InfoContainer>
          {!isOwner && loggedUserId ? (
            <ActionsWrapper>
              <AsyncAction
                onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
              >
                <FollowButton
                  primary
                  name={isSubscribed ? 'profile-header__unfollow' : 'profile-header__follow'}
                >
                  {`Follow${isSubscribed ? 'ing' : ''}`}
                </FollowButton>
              </AsyncAction>
              <Button primary name="profile-header__send-points" onClick={this.sendPointsHandler}>
                Send points
              </Button>
              {this.renderDropDownMenu(false, isBlocked)}
            </ActionsWrapper>
          ) : null}
        </InfoWrapper>
      </Wrapper>
    );
  }
}
