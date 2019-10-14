/* eslint-disable no-alert */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { displayError, displaySuccess } from 'utils/toastsMessages';
import { Icon } from '@commun/icons';
import { styles } from '@commun/ui';

import { communityType } from 'types/common';
import CoverImage from 'components/CoverImage';
import CoverAvatar from 'components/CoverAvatar';
import ContextMenu, { ContextMenuItem } from 'components/ContextMenu';

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
    max-height: 310px;
    max-width: 900px;
    margin: 0 auto;
    padding: 202px 16px 0;
  }
`;

const CoverAvatarStyled = styled(CoverAvatar)`
  width: 92px;
  height: 92px;
  margin-top: 74px;
  flex-shrink: 0;
  border: 5px solid #fff;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  z-index: 1;

  ${up('desktop')} {
    width: 156px;
    height: 156px;
    margin: 0 25px 30px 0;
  }
`;

const CommunityNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;

  ${up('desktop')} {
    align-items: flex-start;
    padding: 0 0 26px;
  }
`;

const CommunityName = styled.p`
  padding: 0 0 4px;
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: -0.31px;
  color: #000;

  ${styles.breakWord};
`;

const CommunityCategory = styled.p`
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
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  ${up('desktop')} {
    padding-bottom: 23px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }

  ${is('isSubscribed')`
    color: ${({ theme }) => theme.colors.contextGrey};
  `};
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

export default class CommunityHeader extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,
    loggedUserId: PropTypes.string,
    userCommunities: PropTypes.arrayOf(PropTypes.shape({})),

    pin: PropTypes.func.isRequired,
    unpin: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userCommunities: [],
    loggedUserId: null,
  };

  state = {};

  onSubscribeClick = async () => {
    const { community, loggedUserId, pin, fetchProfile } = this.props;

    try {
      await pin(community.id);
      await fetchProfile({ userId: loggedUserId });
      displaySuccess('User followed');
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  onUnsubscribeClick = async () => {
    const { community, loggedUserId, unpin, fetchProfile } = this.props;

    try {
      await unpin(community.id);
      await fetchProfile({ userId: loggedUserId });
      displaySuccess('User unfollowed');
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  };

  render() {
    const { community, userCommunities } = this.props;
    // TODO: replace with community leaders check
    const isOwner = false;
    const isSubscribed = userCommunities.length
      ? userCommunities.some(item => community.id === item.id)
      : false;

    return (
      <Wrapper>
        <CoverImage
          userId={community.id}
          isCommunity
          editable={isOwner}
          onUpdate={this.onCoverUpdate}
        />
        <CoverAvatarStyled isCommunity communityId={community.id} editable={isOwner} />
        <CommunityNameWrapper>
          <CommunityName>{community.name}</CommunityName>
          <CommunityCategory>Gaming</CommunityCategory>
        </CommunityNameWrapper>
        <ActionsWrapper>
          <Action
            isSubscribed={isSubscribed}
            name={isSubscribed ? 'community-header__unsubscribe' : 'community-header__subscribe'}
            onClick={isSubscribed ? this.onUnsubscribeClick : this.onSubscribeClick}
          >
            <IconWrapper>
              <IconStyled name="subscribe" />
            </IconWrapper>
            {`Subscribe${isSubscribed ? 'd' : ''}`}
          </Action>
          <ContextMenu
            align="right"
            handler={props => (
              <Action {...props} name="community-header__more-actions">
                <IconWrapper>
                  <IconStyled name="more" />
                </IconWrapper>
                More
              </Action>
            )}
            items={() => (
              // TODO: replace with real context menu actions
              <>
                <ContextMenuItem name="community-header__first-action" onClick={() => {}}>
                  First Action
                </ContextMenuItem>
                <ContextMenuItem name="community-header__second-action" onClick={() => {}}>
                  Second Action
                </ContextMenuItem>
              </>
            )}
          />
        </ActionsWrapper>
      </Wrapper>
    );
  }
}
