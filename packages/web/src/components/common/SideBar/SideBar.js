import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import is from 'styled-is';
import Sticky from 'react-stickynode';

import { FEATURE_WALLET, FEATURE_DISCOVER } from 'shared/featureFlags';
import { userType, communityType } from 'types';
import { CONTAINER_DESKTOP_PADDING, CONTAINER_PADDING, Button, up } from '@commun/ui';
// import { FOOTER_LINKS, APPS_LINKS } from 'components/common/Footer';
import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/common/Header';
import Avatar from 'components/common/Avatar';

import { FEED_TYPE_GROUP_TRENDING, SIDE_BAR_MARGIN } from 'shared/constants';
import { ProfileIdLink } from 'components/links';

import LinksList from './LinksList';

const ITEMS_LIMIT = 5;

// TODO: пока закомментил функционал мобильного меню на случай возврата к нему в будущем

// const MobileWrapper = styled.nav`
//   position: fixed;
//   top: ${HEADER_HEIGHT}px;
//   left: 0;
//   width: 80%;
//   min-width: 170px;
//   height: calc(100vh - ${HEADER_HEIGHT}px);
//   z-index: 10;
//   background: #fff;
//   transform: translateX(-100%);
//   transition: transform 0.3s;
//   overflow-y: auto;
//   overscroll-behavior: none;

//   ${is('open')`
//     transform: translateX(0);
//   `};

//   ${up.mobileLandscape} {
//     width: 320px;
//     flex-basis: 320px;
//     padding: 24px 12px;
//     flex-shrink: 0;
//   }
// `;

const DesktopWrapper = styled.nav`
  width: 220px;
  margin-right: ${SIDE_BAR_MARGIN}px;
  flex-shrink: 0;
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
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
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

// const Overlay = styled.div`
//   position: fixed;
//   top: ${HEADER_HEIGHT}px;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: #000;
//   opacity: 0.5;
//   z-index: 5;

//   ${up.desktop} {
//     display: none;
//   }
// `;

const NewButtonWrapper = styled.div`
  display: flex;
  margin: 0 12px 20px;

  ${up.desktop} {
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
    // isOpen: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    featureFlags: PropTypes.shape({}).isRequired,
    // changeMenuStateHandler: PropTypes.func.isRequired,
    manageCommunities: PropTypes.arrayOf(communityType).isRequired,
    myCommunities: PropTypes.arrayOf(communityType).isRequired,
    fetchMyCommunitiesIfEmpty: PropTypes.func.isRequired,
    fetchLeaderCommunitiesIfEmpty: PropTypes.func.isRequired,
    openModalEditor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUser: null,
    user: null,
    // isOpen: false,
  };

  componentDidMount() {
    const { user, fetchMyCommunitiesIfEmpty, fetchLeaderCommunitiesIfEmpty } = this.props;

    if (user) {
      fetchMyCommunitiesIfEmpty();
      fetchLeaderCommunitiesIfEmpty();
    }
  }

  componentDidUpdate(prevProps) {
    const { user, fetchMyCommunitiesIfEmpty, fetchLeaderCommunitiesIfEmpty } = this.props;

    if (!prevProps.user && user) {
      fetchMyCommunitiesIfEmpty();
      fetchLeaderCommunitiesIfEmpty();
    }
  }

  onNewPostClick = () => {
    const { openModalEditor } = this.props;
    openModalEditor();
  };

  getFeeds = () => {
    const { user, featureFlags } = this.props;
    const links = [];

    if (user) {
      links.push({
        route: 'home',
        index: true,
        desc: 'My feed',
        avatar: {
          userId: user.userId,
        },
      });
    }

    links.push({
      route: 'feed',
      params: {
        feedType: FEED_TYPE_GROUP_TRENDING,
        feedSubType: 'topLikes',
      },
      desc: 'Trending',
      icon: {
        name: 'trending',
        width: 12,
        height: 20,
      },
    });

    if (featureFlags[FEATURE_WALLET]) {
      links.push({
        route: 'wallet',
        desc: 'Wallet',
        icon: {
          name: 'wallet',
        },
      });
    }

    if (featureFlags[FEATURE_DISCOVER]) {
      links.push({
        route: 'communities',
        desc: 'Discovery',
        icon: {
          name: 'discovery',
        },
      });
    }

    return links;
  };

  renderUserBlock = () => {
    const { user /* , changeMenuStateHandler */ } = this.props;

    if (!user) {
      return null;
    }

    return (
      <ProfileIdLink userId={user.userId}>
        <UserLink /* onClick={changeMenuStateHandler} */>
          <AvatarStyled userId={user.userId} />
          {user.username}
        </UserLink>
      </ProfileIdLink>
    );
  };

  // eslint-disable-next-line class-methods-use-this
  communityToListItem(community) {
    return {
      route: 'community',
      params: {
        communityAlias: community.alias,
      },
      desc: community.name,
      avatar: {
        communityId: community.communityId,
      },
    };
  }

  renderManagement() {
    const { manageCommunities } = this.props;

    if (!manageCommunities || !manageCommunities.length) {
      return null;
    }

    return (
      <LinksList
        title="Management"
        link={{ route: 'leaderboard' }}
        items={manageCommunities.map(this.communityToListItem)}
      />
    );
  }

  renderMyCommunities() {
    const { /* changeMenuStateHandler, */ user, myCommunities } = this.props;

    if (!myCommunities || !myCommunities.length) {
      return null;
    }

    return (
      <LinksList
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
        items={myCommunities.slice(0, ITEMS_LIMIT).map(this.communityToListItem)}
      />
    );
  }

  renderContent() {
    const { currentUser /* isMobile, changeMenuStateHandler */ } = this.props;

    return (
      <>
        {/* {isMobile ? this.renderUserBlock() : null} */}
        <LinksList items={this.getFeeds()} /* changeMenuStateHandler={changeMenuStateHandler} */ />
        {currentUser ? (
          <NewButtonWrapper>
            <NewPostButton primary onClick={this.onNewPostClick}>
              New post
            </NewPostButton>
          </NewButtonWrapper>
        ) : null}
        {this.renderManagement()}
        {this.renderMyCommunities()}
        {/* {isMobile ? (
          <>
            <LinksList
              title="Info"
              items={FOOTER_LINKS}
              changeMenuStateHandler={changeMenuStateHandler}
            />
            <LinksList
              title="Applications"
              items={APPS_LINKS}
              changeMenuStateHandler={changeMenuStateHandler}
            />
          </>
        ) : null} */}
      </>
    );
  }

  render() {
    const { isMobile, isDesktop /* , changeMenuStateHandler, isOpen */ } = this.props;

    if (isMobile) {
      return null;
      // (
      //   <>
      //     <MobileWrapper open={isOpen}>{this.renderContent()}</MobileWrapper>
      //     {isOpen ? (
      //       <Overlay tabIndex="-1" aria-hidden="true" onClick={changeMenuStateHandler} />
      //     ) : null}
      //   </>
      // );
    }

    return (
      <DesktopWrapper>
        <Sticky
          top={
            isDesktop
              ? HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING
              : HEADER_HEIGHT + CONTAINER_PADDING
          }
        >
          <Wrapper>{this.renderContent()}</Wrapper>
        </Sticky>
      </DesktopWrapper>
    );
  }
}
