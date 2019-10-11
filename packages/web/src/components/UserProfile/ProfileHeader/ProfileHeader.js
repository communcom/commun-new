/* eslint-disable no-alert,no-console */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import dayjs from 'dayjs';

import { styles, LoaderIcon } from '@commun/ui';
import { Icon } from '@commun/icons';

import { withNamespaces } from 'shared/i18n';

import { profileType } from 'types/common';
import CoverImage from 'components/CoverImage';
import CoverAvatar from 'components/CoverAvatar';
import ContextMenu, { ContextMenuItem } from 'components/ContextMenu';
import { SHOW_MODAL_SEND_POINTS } from 'store/constants/modalTypes';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import Description from '../Description';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 16px;

  background-color: #fff;

  ${up('tablet')} {
    border-left: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-right: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  }

  ${up('desktop')} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    max-height: 410px;
    max-width: 900px;
    margin: 0 auto;
    padding: 202px 16px 0;
  }
`;

const CoverAvatarStyled = styled(CoverAvatar)`
  width: 110px;
  height: 110px;
  margin-top: 57px;
  flex-shrink: 0;
  border: 5px solid #fff;
  border-radius: 50%;
  background-color: #fff;
  z-index: 1;
  position: relative;
  top: -70px;

  ${up('desktop')} {
    width: 156px;
    height: 156px;
    margin: 0 25px 30px 0;
  }
`;

const UsernameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;
  position: relative;
  top: -30px;

  ${up('desktop')} {
    align-items: flex-start;
    padding: 0 0 26px;
  }
`;

const Username = styled.p`
  padding: 0 0 4px;
  font-size: 20px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: -0.31px;
  color: #000;

  ${styles.breakWord};

  ${up('desktop')} {
    font-size: 32px;
  }
`;

const JoinedDate = styled.p`
  padding: 0;
  font-size: 15px;
  letter-spacing: -0.3px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const ActionsWrapper = styled.div`
  display: flex;
  padding-top: 5px;

  ${up('desktop')} {
    align-self: center;
    padding: 25px 16px 0;
    margin-left: auto;
  }

  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 88px;
  width: 88px;
  padding-bottom: 25px;
  font-size: 13px;
  letter-spacing: -0.31px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  ${up('desktop')} {
    padding-bottom: 23px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  border-radius: 50%;
  background-color: #f5f5f5;
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

  state = {
    inFollowing: false,
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

    this.setState({
      inFollowing: true,
    });

    try {
      const result = await pin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }

    this.setState({
      inFollowing: false,
    });
  };

  onUnsubscribeClick = async () => {
    const { profile, unpin, fetchProfile, waitForTransaction } = this.props;

    this.setState({
      inFollowing: true,
    });

    try {
      const result = await unpin(profile.userId);
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });
      displaySuccess('Success');
    } catch (err) {
      displayError(err);
    }

    this.setState({
      inFollowing: false,
    });
  };

  onAvatarUpdate = async url => {
    const { updateProfileMeta } = this.props;

    try {
      await updateProfileMeta({
        profile_image: url,
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
        cover_image: url,
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

  render() {
    const { isOwner, profile, screenType, loggedUserId } = this.props;
    const { inFollowing } = this.state;
    const { userId, username } = profile;
    const isSubscribed = profile.isSubscribed || false;

    return (
      <Wrapper>
        <CoverImage userId={userId} editable={isOwner} onUpdate={this.onCoverUpdate} />
        <CoverAvatarStyled userId={userId} editable={isOwner} onUpdate={this.onAvatarUpdate} />
        <UsernameWrapper>
          <Username>{username}</Username>
          <JoinedDate>
            Joined{' '}
            {profile
              ? dayjs(profile.registration.time).format('MMMM D, YYYY')
              : '{Profile is not available}'}
          </JoinedDate>
          <Description profile={profile} isOwner={isOwner} isCompact />
        </UsernameWrapper>
        {!isOwner && loggedUserId ? (
          <ActionsWrapper>
            <Action name="profile-header__send-points" onClick={this.sendPointsHandler}>
              <IconWrapper>
                <IconStyled name="send-points" />
              </IconWrapper>
              Send points
            </Action>
            <Action
              name={isSubscribed ? 'profile-header__unfollow' : 'profile-header__follow'}
              isSubscribed={isSubscribed}
              onClick={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
            >
              <IconWrapper>
                {inFollowing ? (
                  <LoaderIcon />
                ) : (
                  <IconStyled name={isSubscribed ? 'following' : 'follow'} isBig />
                )}
              </IconWrapper>
              {`Follow${isSubscribed ? 'ing' : ''}`}
            </Action>
            <ContextMenu
              align="right"
              handler={props => (
                <Action {...props} name="profile-header__more-actions">
                  <IconWrapper>
                    <IconStyled name="more" />
                  </IconWrapper>
                  More
                </Action>
              )}
              items={() => (
                <>
                  <ContextMenuItem name="profile-header__block-user" onClick={this.onBlockClick}>
                    Block
                  </ContextMenuItem>
                  <ContextMenuItem
                    name="profile-header__unblock-user"
                    onClick={this.onUnblockClick}
                  >
                    Unblock
                  </ContextMenuItem>
                </>
              )}
            />
          </ActionsWrapper>
        ) : null}
        {screenType === 'mobile' ? (
          <Description profile={profile} isOwner={isOwner} isCompact />
        ) : null}
      </Wrapper>
    );
  }
}
