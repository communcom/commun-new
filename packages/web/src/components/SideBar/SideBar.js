import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import is from 'styled-is';
import Sticky from 'react-stickynode';
import { ToggleFeature } from '@flopflip/react-redux';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { FOOTER_LINKS, APPS_LINKS } from 'components/Footer/Footer';
import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/Header/constants';
import Avatar from 'components/Avatar';

import { SIDE_BAR_MARGIN } from 'shared/constants';
import { FEATURE_SIDEBAR_COMMUNITIES } from 'shared/feature-flags';
import { ProfileIdLink } from 'components/links';

import LinksList from './LinksList';

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
  width: 170px;
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

export default class SideBar extends Component {
  static propTypes = {
    changeMenuStateHandler: PropTypes.func.isRequired,
    loggedUserId: PropTypes.string,
    username: PropTypes.string,
    isOpen: PropTypes.bool,
    isDesktop: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    username: null,
    isOpen: false,
  };

  getNavLinks = () => {
    const { loggedUserId } = this.props;
    const links = [];

    if (!loggedUserId) {
      return [];
    }

    links.push(
      { route: 'wallet', desc: 'Wallet', icon: 'wallet' },
      {
        route: 'notifications',
        desc: 'Notifications',
        icon: 'notifications',
      }
    );

    return links;
  };

  getFeeds = () => {
    const { username } = this.props;
    const links = [];

    links.push({ route: 'home', desc: 'All', icon: 'popular' });

    if (username) {
      links.push({
        route: 'profile',
        desc: 'My feed',
        avatar: 'avatar',
        params: { username },
      });
    }

    return links;
  };

  renderUserBlock = () => {
    const { loggedUserId, changeMenuStateHandler } = this.props;

    if (!loggedUserId) {
      return null;
    }

    return (
      <ProfileIdLink userId={loggedUserId}>
        <UserLink onClick={changeMenuStateHandler}>
          <AvatarStyled userId={loggedUserId} />
          {loggedUserId}
        </UserLink>
      </ProfileIdLink>
    );
  };

  renderContent() {
    const { isDesktop, changeMenuStateHandler } = this.props;

    // TODO: Get from store
    const communities = [];

    return (
      <>
        {!isDesktop && (
          <>
            {this.renderUserBlock()}
            <LinksList
              section={this.getNavLinks()}
              changeMenuStateHandler={changeMenuStateHandler}
            />
          </>
        )}
        <LinksList
          section={this.getFeeds()}
          title={isDesktop ? null : 'Feeds'}
          changeMenuStateHandler={changeMenuStateHandler}
        />
        <ToggleFeature flag={FEATURE_SIDEBAR_COMMUNITIES}>
          <LinksList
            section={communities}
            title="Communities"
            changeMenuStateHandler={changeMenuStateHandler}
          />
        </ToggleFeature>
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
