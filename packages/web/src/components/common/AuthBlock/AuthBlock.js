import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { ToggleFeature } from '@flopflip/react-redux';
import ContentLoader from 'react-content-loader';
import { Link } from 'shared/routes';

import { FEATURE_NOTIFICATIONS_BUTTON } from 'shared/featureFlags';

import { Button, Loader, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import ActionButton from 'components/common/ActionButton';
import DropDownMenu from 'components/common/DropDownMenu';

import NotificationCounter from '../NotificationCounter';

const DropDownMenuStyled = styled(DropDownMenu)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;

  & > div {
    width: 100%;
    margin-top: 5px;
  }
`;

const AccountInfoBlock = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 176px;
  height: 100%;
  user-select: none;
  cursor: pointer;
`;

const AccountMenuWrapper = styled.a`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const AccountText = styled.div`
  margin: 0 0 0 12px;
  flex: 1;
`;

const AccountName = styled.div`
  max-width: 120px;
  font-weight: 600;
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray};
`;

const IconDropdownBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const IconDropdown = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${is(`isOpen`)`
    transform: rotate(180deg);
  `}
`;

const Balance = styled.div`
  margin-top: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
`;

// const ButtonBuy = styled(Button)`
//   margin-right: 13px;
// `;

const NotificationsButton = styled(ActionButton)`
  display: none;

  ${up.tablet} {
    display: flex;
    position: relative;
  }
`;

const AuthButtons = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 100%;
  padding: 10px 15px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-decoration: none;
  color: #000;
  min-width: 64px;
  transition: background-color 0.15s;
  cursor: pointer;

  ${is('logout')`
    color: ${({ theme }) => theme.colors.lightRed};
  `};
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.blue};
`;

export default class AuthBlock extends PureComponent {
  static propTypes = {
    refId: PropTypes.string,
    currentUser: PropTypes.shape({}),
    balance: PropTypes.number.isRequired,
    isBalanceUpdated: PropTypes.bool.isRequired,
    // isDesktop: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    openSignUpModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    refId: null,
    currentUser: null,
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
    const { currentUser, balance, isBalanceUpdated } = this.props;
    const { userId, username, unsafe } = currentUser;

    if (unsafe) {
      return <LoaderStyled />;
    }

    return (
      <>
        {/* {isDesktop ? <ButtonBuy small>Buy Commun</ButtonBuy> : null} */}
        <AccountInfoBlock>
          <AvatarStyled userId={userId} useLink onClick={this.onAvatarClick} />
          <DropDownMenuStyled
            openAt="bottom"
            handler={({ onClick, isOpen }) => (
              <AccountMenuWrapper onClick={onClick}>
                <AccountText>
                  <AccountName>{username || userId}</AccountName>
                  <Balance>
                    {!isBalanceUpdated ? (
                      <ContentLoader width="100" height="5" />
                    ) : (
                      <>{balance} Commun</>
                    )}
                  </Balance>
                </AccountText>
                <IconDropdownBlock>
                  <IconDropdown isOpen={isOpen} />
                </IconDropdownBlock>
              </AccountMenuWrapper>
            )}
            items={() => (
              <>
                <ProfileLink user={currentUser} allowEmpty>
                  <MenuLink className="js-header__dropdown-profile">My Profile</MenuLink>
                </ProfileLink>{' '}
                <Link route="wallet">
                  <MenuLink className="js-header__dropdown-wallet">Wallet</MenuLink>
                </Link>
                <Link route="settings">
                  <MenuLink className="js-header__dropdown-settings">Settings</MenuLink>
                </Link>
                <Divider />
                <MenuLink logout onClick={this.logoutHandler}>
                  Logout
                </MenuLink>
              </>
            )}
          />
        </AccountInfoBlock>
      </>
    );
  };

  render() {
    const { currentUser, refId } = this.props;

    if (currentUser) {
      return (
        <>
          <ToggleFeature flag={FEATURE_NOTIFICATIONS_BUTTON}>
            <NotificationCounter iconComponent={NotificationsButton} />
          </ToggleFeature>
          {this.renderUserBlock()}
        </>
      );
    }

    return (
      <AuthButtons>
        <Button name="header__login" small onClick={this.loginHandler}>
          Sign in
        </Button>
        {refId ? (
          <Button name="header__register" small primary onClick={this.registerHandler}>
            Sign up
          </Button>
        ) : null}
      </AuthButtons>
    );
  }
}
