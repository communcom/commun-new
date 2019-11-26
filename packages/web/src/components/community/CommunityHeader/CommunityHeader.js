/* eslint-disable no-alert */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { displayError, displaySuccess } from 'utils/toastsMessages';
import { Icon } from '@commun/icons';
import { InvisibleText, Button, styles, up } from '@commun/ui';

import { communityType } from 'types/common';
import CoverImage from 'components/common/CoverImage';
import CoverAvatar from 'components/common/CoverAvatar';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import AsyncAction from 'components/common/AsyncAction';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fff;

  ${up.desktop} {
    max-height: 340px;
    max-width: 850px;
  }
`;

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 50px 16px 20px;

  ${up.desktop} {
    flex-direction: row;
    padding: 10px 15px;
    height: 130px;
    min-height: 130px;
  }
`;

const CoverAvatarStyled = styled(CoverAvatar)`
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
`;

const InfoContainer = styled.div`
  width: 100%;

  ${up.desktop} {
    padding-left: 15px;
  }
`;

const CommunityNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0 10px;
  position: relative;

  ${up.desktop} {
    flex-direction: row;
    align-items: flex-end;
    padding: 0 0 5px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  padding-top: 5px;

  ${up.desktop} {
    padding: 0 0 0 10px;
  }

  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

// const NotificationsButton = styled.button.attrs({ type: 'button' })`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 34px;
//   height: 34px;
//   border-radius: 48px;
//   color: ${({ theme }) => theme.colors.blue};
//   background-color: ${({ theme }) => theme.colors.lightGrayBlue};
//   transition: color 0.15s;
//
//   &:hover,
//   &:focus {
//     color: ${({ theme }) => theme.colors.blueHover};
//   }
// `;

const FollowButton = styled(Button)`
  min-width: 140px;
  text-align: center;

  ${up.desktop} {
    min-width: 70px;
  }
`;

const MoreActions = styled.button.attrs({ type: 'button' })`
  display: none;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 48px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  transition: color 0.15s;

  ${up.desktop} {
    display: flex;
    color: #000;
    background-color: transparent;

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

const CommunityName = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 27px;
  color: #000;

  ${styles.breakWord};

  ${up.desktop} {
    font-size: 30px;
    line-height: 41px;
    margin-right: 10px;
  }
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  ${is('isMobile')`
    position: absolute;
    top: 28px;
    right: 12px;
    z-index: 5;
  `};
`;

const JoinedDate = styled.p`
  padding-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default class CommunityHeader extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    isLeader: PropTypes.bool.isRequired,
    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
  };

  onSubscribeClick = async () => {
    const { community, joinCommunity } = this.props;

    try {
      await joinCommunity(community.id);
      displaySuccess('Joined');
    } catch (err) {
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { community, leaveCommunity } = this.props;

    try {
      await leaveCommunity(community.id);
      displaySuccess('Leaved successfully');
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onNotificationsClick = () => {
    // TODO: onNotificationsClick handler
  };

  onAvatarUpdate = async url => {
    const { community, setCommunityInfo } = this.props;

    try {
      await setCommunityInfo({
        communityId: community.id,
        updates: {
          avatarUrl: url,
        },
      });
      displaySuccess('Proposal for avatar changing has created');
    } catch (err) {
      displayError('Avatar updating are failed', err);
    }
  };

  onCoverUpdate = async url => {
    const { community, setCommunityInfo } = this.props;

    try {
      await setCommunityInfo({
        communityId: community.id,
        updates: {
          coverUrl: url,
        },
      });
      displaySuccess('Proposal for cover changing has created');
    } catch (err) {
      displayError('Cover updating are failed', err);
    }
  };

  renderDropDownMenu = (isMobile, isSubscribed) => {
    if (isSubscribed) {
      return null;
    }

    return (
      <DropDownMenuStyled
        align="right"
        openAt="bottom"
        isMobile={isMobile}
        handler={props => (
          <MoreActions {...props} name="community-header__more-actions" isMobile={isMobile}>
            <IconStyled name="vertical-more" />
            <InvisibleText>More</InvisibleText>
          </MoreActions>
        )}
        items={() => (
          // TODO: replace with real context menu actions
          <>
            <DropDownMenuItem name="community-header__first-action" onClick={() => {}}>
              First Action
            </DropDownMenuItem>
            <DropDownMenuItem name="community-header__second-action" onClick={() => {}}>
              Second Action
            </DropDownMenuItem>
          </>
        )}
      />
    );
  };

  render() {
    const { community, isLeader } = this.props;
    const { isSubscribed } = community;

    return (
      <Wrapper>
        <CoverImage communityId={community.id} editable={isLeader} onUpdate={this.onCoverUpdate} />
        {/* TODO: should be added when design will be ready */}
        {/* {this.renderDropDownMenu(true, isSubscribed)} */}
        <InfoWrapper>
          <CoverAvatarStyled
            isCommunity
            communityId={community.id}
            editable={isLeader}
            onUpdate={this.onAvatarUpdate}
          />
          <InfoContainer>
            <CommunityNameWrapper>
              <CommunityName>{community.name}</CommunityName>
              {/* TODO: should be replaced with real data from server */}
              <JoinedDate>
                Created {dayjs(community.registrationTime).format('MMMM D, YYYY')}
              </JoinedDate>
            </CommunityNameWrapper>
          </InfoContainer>
          <ActionsWrapper>
            {/* {isSubscribed ? ( */}
            {/*  <NotificationsButton onClick={this.onNotificationsClick}> */}
            {/*    <Icon name="notifications" size={20} /> */}
            {/*  </NotificationsButton> */}
            {/* ) : null} */}
            <AsyncAction
              onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
            >
              <FollowButton
                name={
                  isSubscribed ? 'community-header__unsubscribe' : 'community-header__subscribe'
                }
                primary={!isSubscribed}
              >
                {isSubscribed ? 'Unfollow' : 'Follow'}
              </FollowButton>
            </AsyncAction>
            {this.renderDropDownMenu(false, isSubscribed)}
          </ActionsWrapper>
        </InfoWrapper>
      </Wrapper>
    );
  }
}
