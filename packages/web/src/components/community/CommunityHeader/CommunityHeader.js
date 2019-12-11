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
import Avatar from 'components/common/Avatar';

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
  padding: 50px 16px 20px;

  ${up.desktop} {
    flex-direction: row;
    padding: 15px;
    height: 110px;
    min-height: 110px;
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
    align-items: flex-start;
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
    line-height: 1;
    margin: 0 10px 4px 0;
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

const CountersWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: normal;
  margin-top: 15px;
`;

const CountersLeft = styled.div`
  display: flex;
  flex: 1;
`;

const CounterField = styled.div`
  display: flex;
  align-items: baseline;
`;

const CounterValue = styled.div`
  font-weight: bold;
  font-size: 15px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};
`;

const CounterName = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const FriendsRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 4px;
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  border: 2px solid #ffffff;

  margin-right: -8px;
`;

export default class CommunityHeader extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLeader: PropTypes.bool.isRequired,
    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
  };

  onSubscribeClick = async () => {
    const { community, joinCommunity } = this.props;

    try {
      await joinCommunity(community.id);
      displaySuccess('Community followed');
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

    await setCommunityInfo({
      communityId: community.id,
      updates: {
        avatarUrl: url,
      },
    });
  };

  onCoverUpdate = async url => {
    const { community, setCommunityInfo } = this.props;

    await setCommunityInfo({
      communityId: community.id,
      updates: {
        coverUrl: url,
      },
    });
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

  renderCounters() {
    const { community } = this.props;

    return (
      <CountersWrapper>
        <CountersLeft>
          <CounterField>
            <CounterValue>{community.subscribersCount}</CounterValue>&nbsp;
            <CounterName>Members&nbsp;•&nbsp;</CounterName>
          </CounterField>
          <CounterField>
            <CounterValue>{community.leadersCount}</CounterValue>&nbsp;
            <CounterName>Leaders</CounterName>
          </CounterField>
        </CountersLeft>
        {community.friends ? (
          <>
            <FriendsRow>
              {community.friends.slice(0, 3).map(userId => (
                <AvatarStyled key={userId} userId={userId} useLink />
              ))}
            </FriendsRow>
            {community.friendsCount > 3 ? (
              <CounterField>
                <CounterValue>&nbsp;+&nbsp;{community.friendsCount - 3}</CounterValue>&nbsp;
                <CounterName>Friends</CounterName>
              </CounterField>
            ) : null}
          </>
        ) : null}
      </CountersWrapper>
    );
  }

  render() {
    const { community, isLeader, isMobile } = this.props;
    const { isSubscribed } = community;

    return (
      <Wrapper>
        <CoverImage
          communityId={community.id}
          editable={isLeader}
          successMessage="Proposal for cover changing has created"
          onUpdate={this.onCoverUpdate}
        />
        {/* TODO: should be added when design will be ready */}
        {/* {this.renderDropDownMenu(true, isSubscribed)} */}
        <InfoWrapper>
          <CoverAvatarStyled
            isCommunity
            communityId={community.id}
            successMessage="Proposal for avatar changing has created"
            editable={isLeader}
            onUpdate={this.onAvatarUpdate}
          />
          <InfoContainer>
            <CommunityNameWrapper>
              <CommunityName>{community.name}</CommunityName>
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
            {/* {this.renderDropDownMenu(false, isSubscribed)} */}
          </ActionsWrapper>

          {isMobile ? this.renderCounters() : null}
        </InfoWrapper>
      </Wrapper>
    );
  }
}
