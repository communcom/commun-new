import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import is from 'styled-is';
import Sticky from 'react-stickynode';
import { ToggleFeature } from '@flopflip/react-redux';

import { userType, communityType } from 'types';
import { CONTAINER_DESKTOP_PADDING, Button } from '@commun/ui';
import { FOOTER_LINKS, APPS_LINKS } from 'components/Footer/Footer';
import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/Header/constants';
import Avatar from 'components/Avatar';

import { SIDE_BAR_MARGIN } from 'shared/constants';
import { FEATURE_SIDEBAR_COMMUNITIES } from 'shared/feature-flags';
import { ProfileIdLink } from 'components/links';

import LinksList from './LinksList';

const DEFAULT_ICON_SIZE = {
  width: 24,
  height: 24,
};

const ITEMS_LIMIT = 5;

const MobileWrapper = styled.nav`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  left: 0;
  width: 80%;
  min-width: 170px;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  z-index: 10;
  background: #fff;
  transform: translateX(-100%);
  transition: transform 0.3s;
  overflow-y: auto;
  overscroll-behavior: none;

  ${is('open')`
    transform: translateX(0);
  `};

  ${up('mobileLandscape')} {
    width: 320px;
    flex-basis: 320px;
    padding: 24px 12px;
    flex-shrink: 0;
  }
`;

const DesktopWrapper = styled.nav`
  width: 220px;
  margin-right: ${SIDE_BAR_MARGIN}px;
  flex-shrink: 0;
`;

const UserLink = styled.a`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

const Overlay = styled.div`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 5;

  ${up('desktop')} {
    display: none;
  }
`;

const NewButtonWrapper = styled.div`
  display: flex;
  margin: 0 12px 20px;

  ${up('desktop')} {
    margin: 0 0 20px;
  }
`;

const NewPostButton = styled(Button)`
  display: block;
  flex-grow: 1;
  height: 50px;
  font-size: 15px;
`;

export default class SideBar extends Component {
  static propTypes = {
    currentUser: PropTypes.shape({}),
    user: userType,
    isOpen: PropTypes.bool,
    isDesktop: PropTypes.bool.isRequired,
    myCommunities: PropTypes.arrayOf(communityType),
    changeMenuStateHandler: PropTypes.func.isRequired,
    fetchMyCommunitiesIfEmpty: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUser: null,
    user: null,
    isOpen: false,
    myCommunities: null,
  };

  componentDidMount() {
    const { fetchMyCommunitiesIfEmpty } = this.props;
    fetchMyCommunitiesIfEmpty();
  }

  getFeeds = () => {
    const { user } = this.props;
    const links = [];

    if (user) {
      links.push({
        route: 'home',
        desc: 'My feed',
        avatar: {
          userId: user.userId,
        },
      });
    } else {
      links.push({
        route: 'home',
        desc: 'All',
        icon: {
          name: 'popular',
          ...DEFAULT_ICON_SIZE,
        },
      });
    }

    links.push(
      {
        route: 'wallet',
        desc: 'Trending',
        icon: {
          name: 'trending',
          width: 12,
          height: 20,
        },
      },
      {
        route: 'wallet',
        desc: 'Wallet',
        icon: {
          name: 'wallet',
          ...DEFAULT_ICON_SIZE,
        },
      },
      {
        route: 'communities',
        desc: 'Discovery',
        icon: {
          name: 'discovery',
          ...DEFAULT_ICON_SIZE,
        },
      }
    );

    return links;
  };

  renderUserBlock = () => {
    const { user, changeMenuStateHandler } = this.props;

    if (!user) {
      return null;
    }

    return (
      <ProfileIdLink userId={user.userId}>
        <UserLink onClick={changeMenuStateHandler}>
          <AvatarStyled userId={user.userId} />
          {user.username}
        </UserLink>
      </ProfileIdLink>
    );
  };

  renderContent() {
    const { isDesktop, changeMenuStateHandler, user, myCommunities } = this.props;

    return (
      <>
        {isDesktop ? null : this.renderUserBlock()}
        <LinksList section={this.getFeeds()} changeMenuStateHandler={changeMenuStateHandler} />
        <NewButtonWrapper>
          <NewPostButton>New post</NewPostButton>
        </NewButtonWrapper>
        {myCommunities && myCommunities.length ? (
          <ToggleFeature flag={FEATURE_SIDEBAR_COMMUNITIES}>
            <LinksList
              section={myCommunities.slice(0, ITEMS_LIMIT).map(community => ({
                route: 'community',
                params: {
                  communityAlias: community.alias,
                },
                decs: community.name,
                avatar: {
                  communityId: community.communityId,
                },
              }))}
              title="Communities"
              link={
                myCommunities.length > ITEMS_LIMIT
                  ? {
                      route: 'profile',
                      params: {
                        username: user.username,
                        section: 'communities',
                      },
                    }
                  : null
              }
              changeMenuStateHandler={changeMenuStateHandler}
            />
          </ToggleFeature>
        ) : null}
        {isDesktop ? null : (
          <>
            <LinksList
              title="Info"
              section={FOOTER_LINKS}
              changeMenuStateHandler={changeMenuStateHandler}
            />
            <LinksList
              title="Applications"
              section={APPS_LINKS}
              changeMenuStateHandler={changeMenuStateHandler}
            />
          </>
        )}
      </>
    );
  }

  render() {
    const { isOpen, isDesktop, changeMenuStateHandler } = this.props;

    if (isDesktop) {
      return (
        <DesktopWrapper>
          <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
            {this.renderContent()}
          </Sticky>
        </DesktopWrapper>
      );
    }

    return (
      <>
        <MobileWrapper open={isOpen}>{this.renderContent()}</MobileWrapper>
        {isOpen ? (
          <Overlay tabIndex="-1" aria-hidden="true" onClick={changeMenuStateHandler} />
        ) : null}
      </>
    );
  }
}
