import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import is from 'styled-is';
import Sticky from 'react-stickynode';
import { Link } from 'shared/routes';
import { ToggleFeature } from '@flopflip/react-redux';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';
import { FOOTER_LINKS, APPS_LINKS } from 'components/Footer/Footer';
import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/Header/constants';
import Avatar from 'components/Avatar';
import { SHOW_MODAL_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants/modalTypes';

import { SIDE_BAR_MARGIN } from 'shared/constants';
import { FEATURE_SIDEBAR_COMMUNITIES } from 'shared/feature-flags';

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

const AuthButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  font-size: 15px;
  letter-spacing: -0.41px;
  border: none;
  border-radius: 4px;
  transition: color 0.15s, background-color 0.15s;
`;

const RegisterButton = styled(AuthButton)`
  background-color: ${({ theme }) => theme.colors.contextBlue};
  color: #fff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const LoginButton = styled(AuthButton)`
  color: ${({ theme }) => theme.colors.contextBlue};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const LogoutButton = styled(RegisterButton)``;

const AuthButtonsWrapper = styled.div`
  padding-bottom: 24px;
  margin: 0 16px;

  ${up('tablet')} {
    margin: 0;
  }
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
    isUnsafeAuthorized: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    isDesktop: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    username: null,
    isOpen: false,
  };

  state = {};

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

  // mocked data
  getCommunities = () => [
    {
      route: 'community',
      desc: 'Photographers',
      avatar: 'avatar',
      params: { communityId: 'photographers' },
    },
    {
      route: 'community',
      desc: 'Overwatch',
      avatar: 'avatar',
      params: { communityId: 'overwatch' },
    },
    {
      route: 'community',
      desc: 'Adme',
      avatar: 'avatar',
      params: { communityId: 'adme' },
    },
  ];

  // for development only
  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  registerHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SIGNUP);
  };

  loginHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_LOGIN);
  };

  renderUserBlock = () => {
    const { loggedUserId, changeMenuStateHandler } = this.props;

    if (!loggedUserId) {
      return null;
    }

    return (
      <Link route="profile" params={{ userId: loggedUserId }} passHref>
        <UserLink onClick={changeMenuStateHandler}>
          <AvatarStyled userId={loggedUserId} />
          {loggedUserId}
        </UserLink>
      </Link>
    );
  };

  renderLoginBlock() {
    const { loggedUserId, isUnsafeAuthorized } = this.props;

    if (loggedUserId && isUnsafeAuthorized) {
      return null;
    }

    if (loggedUserId) {
      return (
        <AuthButtonsWrapper>
          <LogoutButton name="sidebar__logout" onClick={this.logoutHandler}>
            Logout
          </LogoutButton>
        </AuthButtonsWrapper>
      );
    }

    return (
      <AuthButtonsWrapper>
        <RegisterButton name="sidebar__register" onClick={this.registerHandler}>
          Sign up
        </RegisterButton>
        <LoginButton name="sidebar__login" onClick={this.loginHandler}>
          Sign in
        </LoginButton>
      </AuthButtonsWrapper>
    );
  }

  renderContent() {
    const { isDesktop, changeMenuStateHandler } = this.props;

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
            section={this.getCommunities()}
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
        {this.renderLoginBlock()}
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
