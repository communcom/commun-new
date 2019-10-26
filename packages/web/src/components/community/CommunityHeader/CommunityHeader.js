/* eslint-disable no-alert */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

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
  margin-bottom: 2px;

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
  padding: 50px 15px 20px;

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
    color: ${({ theme }) => theme.colors.contextGrey};
    background-color: ${({ theme }) => theme.colors.contextWhite};
  }

  ${is('isMobile')`
    display: flex;

    ${up.desktop} {
      display: none;
    }
  `};

  ${up.desktop} {
    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.contextBlueHover};
    }
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  padding-left: 5px;
`;

const CommunityNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;

  ${up.desktop} {
    align-items: flex-start;
    padding: 0 0 26px;
  }
`;

const CommunityName = styled.p`
  padding: 0 0 4px;
  font-size: 30px;
  font-weight: bold;
  line-height: 41px;
  color: #000;

  ${styles.breakWord};
`;

const ActionsWrapper = styled.div`
  display: flex;
  padding-top: 5px;

  ${up.desktop} {
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
  min-width: 106px;
  text-align: center;
`;

export default class CommunityHeader extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
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

  renderDropDownMenu = isMobile => (
    <DropDownMenuStyled
      align="right"
      openAt="bottom"
      isMobile={isMobile}
      handler={props => (
        <MoreActions {...props} name="community-header__more-actions">
          <IconStyled name="more" />
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

  render() {
    const { community } = this.props;
    // TODO: replace with community leaders check
    const isOwner = false;
    const { isSubscribed } = community;

    return (
      <Wrapper>
        <CoverImage
          userId={community.id}
          isCommunity
          editable={isOwner}
          onUpdate={this.onCoverUpdate}
        />
        {this.renderDropDownMenu(true)}
        <InfoWrapper>
          <CoverAvatarStyled isCommunity communityId={community.id} editable={isOwner} />
          <InfoContainer>
            <CommunityNameWrapper>
              <CommunityName>{community.name}</CommunityName>
            </CommunityNameWrapper>
          </InfoContainer>
          <ActionsWrapper>
            <AsyncAction
              onClickHandler={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
            >
              <FollowButton
                name={
                  isSubscribed ? 'community-header__unsubscribe' : 'community-header__subscribe'
                }
                primary={!isSubscribed}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </FollowButton>
            </AsyncAction>
            {this.renderDropDownMenu()}
          </ActionsWrapper>
        </InfoWrapper>
      </Wrapper>
    );
  }
}
