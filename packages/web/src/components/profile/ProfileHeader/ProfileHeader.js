/* eslint-disable no-alert,no-console */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import dayjs from 'dayjs';

import { styles, Button, InvisibleText } from '@commun/ui';
import { Icon } from '@commun/icons';

import { withNamespaces } from 'shared/i18n';

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
  background-color: #fff;

  ${up('desktop')} {
    max-height: 340px;
    max-width: 850px;
    margin: 0 auto;
  }
`;

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 50px 15px 20px;

  ${up('desktop')} {
    flex-direction: row;
    padding: 10px 15px;
    height: 130px;
    min-height: 130px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  padding-top: 5px;

  ${up('desktop')} {
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

  ${up('desktop')} {
    flex-direction: row;
    align-items: flex-end;
    padding: 0 0 5px;
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

  ${up('desktop')} {
    display: flex;
    color: ${({ theme }) => theme.colors.contextGrey};
    background-color: ${({ theme }) => theme.colors.contextWhite};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.contextBlueHover};
    }
  }

  ${is('isMobile')`
    display: flex;

    ${up('desktop')} {
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

    ${up('desktop')} {
      position: relative;
      top: 0;
    }
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  padding-left: 5px;
`;

const Username = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: -0.31px;
  color: #000;

  ${styles.breakWord};

  ${up('desktop')} {
    font-size: 30px;
    line-height: 41px;
    margin-right: 10px;
  }
`;

const JoinedDate = styled.p`
  padding: 0;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const IconStyled = styled(Icon)`
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

@withNamespaces()
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
    const { profile, blockUser, waitForTransaction } = this.props;

    try {
      const result = await blockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }
  };

  onUnblockClick = async () => {
    const { profile, unblockUser, waitForTransaction } = this.props;

    try {
      const result = await unblockUser(profile.userId);
      await waitForTransaction(result.transaction_id);
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

    try {
      await updateProfileMeta({
        avatarUrl: url,
      });
      displaySuccess('Metadata updated');
    } catch (err) {
      displayError('Profile updating are failed', err);
    }
  };

  onCoverUpdate = async url => {
    const { updateProfileMeta } = this.props;

    try {
      await updateProfileMeta({
        coverUrl: url,
      });
      displaySuccess('Metadata updated');
    } catch (err) {
      displayError('Profile updating are failed', err);
    }
  };

  sendPointsHandler = () => {
    const { openModal, profile } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS, { userId: profile.userId });
  };

  renderDropDownMenu = isMobile => (
    <DropDownMenuStyled
      align="right"
      openAt="bottom"
      isMobile={isMobile}
      handler={props => (
        <MoreActions {...props} name="profile-header__more-actions" isMobile={isMobile}>
          <IconStyled name="more" />
          <InvisibleText>More</InvisibleText>
        </MoreActions>
      )}
      items={() => (
        <>
          <DropDownMenuItem name="profile-header__block-user" onClick={this.onBlockClick}>
            Block
          </DropDownMenuItem>
          <DropDownMenuItem name="profile-header__unblock-user" onClick={this.onUnblockClick}>
            Unblock
          </DropDownMenuItem>
        </>
      )}
    />
  );

  render() {
    const { isOwner, profile, loggedUserId } = this.props;
    const { userId, username } = profile;
    const isSubscribed = profile.isSubscribed || false;

    return (
      <Wrapper>
        <CoverImage userId={userId} editable={isOwner} onUpdate={this.onCoverUpdate} />
        {!isOwner && loggedUserId ? this.renderDropDownMenu(true) : null}
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
                  name={isSubscribed ? 'profile-header__unfollow' : 'profile-header__follow'}
                >
                  {`Follow${isSubscribed ? 'ing' : ''}`}
                </FollowButton>
              </AsyncAction>
              <Button name="profile-header__send-points" onClick={this.sendPointsHandler}>
                Send points
              </Button>
              {this.renderDropDownMenu()}
            </ActionsWrapper>
          ) : null}
        </InfoWrapper>
      </Wrapper>
    );
  }
}