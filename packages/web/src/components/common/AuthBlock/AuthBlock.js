import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { ToggleFeature } from '@flopflip/react-redux';

import {
  FEATURE_WALLET,
  FEATURE_DISCOVER,
  FEATURE_NOTIFICATIONS_BUTTON,
} from 'shared/featureFlags';
import activeLink from 'utils/hocs/activeLink';

import { Loader, TextButton, up } from '@commun/ui';
import { userType } from 'types';
import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import ActionButton from 'components/common/ActionButton';

import NotificationCounter from '../NotificationCounter';

const NotificationsButton = styled(ActionButton)`
  position: relative;
`;

const NavLinksWrapper = styled.div`
  display: flex;

  ${up.tablet} {
    padding-right: 24px;
  }
`;

const NavLink = activeLink(styled(ActionButton).attrs({ as: 'a' })`
  position: static;
  appearance: none;
  padding: 20px 20px 17px;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 3px solid transparent;
  transition: border-bottom 0.15s, color 0.15s;

  ${is('active')`
    border-bottom: 3px solid ${({ theme }) => theme.colors.contextBlue};
  `};
`);

const AuthButtons = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const AuthButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 8px;
  font-size: 15px;
  letter-spacing: -0.41px;
  border: none;
  border-radius: 4px;
  white-space: nowrap;
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

const UserLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 100%;
  padding: 20px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  color: #000;

  ${up.desktop} {
    min-width: 64px;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 24px;
  height: 24px;
`;

const LoaderStyled = styled(Loader)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.contextBlue} !important;
`;

export default class AuthBlock extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.shape({}),
    user: userType,
    logout: PropTypes.func.isRequired,
    openSignUpModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUser: null,
    user: null,
  };

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  registerHandler = () => {
    const { openSignUpModal } = this.props;
    openSignUpModal();
  };

  loginHandler = () => {
    const { openLoginModal } = this.props;
    openLoginModal();
  };

  renderUserBlock = () => {
    const { currentUser, user } = this.props;
    const { userId, unsafe } = currentUser;

    if (unsafe) {
      return (
        <UserLink>
          <LoaderStyled />
        </UserLink>
      );
    }

    return (
      <ProfileLink user={user} allowEmpty>
        <UserLink>
          <AvatarStyled userId={userId} isBlack />
        </UserLink>
      </ProfileLink>
    );
  };

  render() {
    const { currentUser } = this.props;

    if (currentUser) {
      return (
        <>
          <NavLinksWrapper>
            <ToggleFeature flag={FEATURE_WALLET}>
              <NavLink route="wallet">Wallet</NavLink>
            </ToggleFeature>
            <ToggleFeature flag={FEATURE_DISCOVER}>
              <NavLink route="communities">Discover</NavLink>
            </ToggleFeature>
          </NavLinksWrapper>
          <ToggleFeature flag={FEATURE_NOTIFICATIONS_BUTTON}>
            <NotificationCounter iconComponent={NotificationsButton} />
          </ToggleFeature>
          {this.renderUserBlock()}
          {currentUser.unsafe ? null : (
            <AuthButtons>
              <TextButton name="header__logout" onClick={this.logoutHandler}>
                Logout
              </TextButton>
            </AuthButtons>
          )}
        </>
      );
    }

    return (
      <AuthButtons>
        <LoginButton name="header__login" onClick={this.loginHandler}>
          Sign in
        </LoginButton>
        <RegisterButton name="header__register" onClick={this.registerHandler}>
          Sign up
        </RegisterButton>
      </AuthButtons>
    );
  }
}
