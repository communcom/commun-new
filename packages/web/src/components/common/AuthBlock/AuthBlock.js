import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { injectFeatureToggles, ToggleFeature } from '@flopflip/react-redux';
import ContentLoader from 'react-content-loader';
import debounce from 'lodash.debounce';

import { Button, Loader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';
import {
  FEATURE_SIGN_UP,
  FEATURE_NOTIFICATIONS_BUTTON,
  FEATURE_EXCHANGE_COMMON,
} from 'shared/featureFlags';
import { formatNumber } from 'utils/format';

import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import DropDownMenu from 'components/common/DropDownMenu';
import NotificationCounter from 'components/common/NotificationCounter';

const DropDownMenuStyled = styled(DropDownMenu)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  width: 180px;

  & > div {
    width: 180px;
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
  padding-bottom: 4px;
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
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
`;

const ButtonBuy = styled(Button)`
  margin-right: 13px;
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
  min-width: 100%;
  min-height: 100%;
  padding: 10px 15px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-decoration: none;
  color: #000;
  transition: background-color 0.15s;
  cursor: pointer;

  ${is('logout')`
    color: ${({ theme }) => theme.colors.lightRed};
  `};
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  margin: 2px 0;
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

@injectFeatureToggles([FEATURE_SIGN_UP, FEATURE_EXCHANGE_COMMON])
export default class AuthBlock extends PureComponent {
  static propTypes = {
    refId: PropTypes.string,
    currentUser: PropTypes.object,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isBalanceUpdated: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    openSignUpModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
    openModalExchangeCommun: PropTypes.func.isRequired,
    featureToggles: PropTypes.object.isRequired,
  };

  static defaultProps = {
    balance: 0,
    refId: null,
    currentUser: null,
  };

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  registerHandler = debounce(
    () => {
      const { openSignUpModal } = this.props;
      openSignUpModal();
    },
    300,
    { leading: true }
  );

  loginHandler = debounce(
    () => {
      const { openLoginModal } = this.props;
      openLoginModal();
    },
    300,
    { leading: true }
  );

  buyPointsClick = () => {
    const { openModalExchangeCommun } = this.props;

    openModalExchangeCommun();
  };

  renderUserBlock = () => {
    const { currentUser, balance, isBalanceUpdated, isDesktop, featureToggles } = this.props;
    const { userId, username, unsafe } = currentUser;
    const formattedBalance = formatNumber(parseFloat(balance).toFixed(2));

    if (unsafe) {
      return <LoaderStyled />;
    }

    return (
      <>
        {isDesktop && featureToggles[FEATURE_EXCHANGE_COMMON] ? (
          <ButtonBuy small primary onClick={this.buyPointsClick}>
            Buy Commun
          </ButtonBuy>
        ) : null}
        <ToggleFeature flag={FEATURE_NOTIFICATIONS_BUTTON}>
          <NotificationCounter />
        </ToggleFeature>
        <AccountInfoBlock>
          <AvatarStyled userId={userId} useLink />
          <DropDownMenuStyled
            openAt="bottom"
            align="right"
            handler={({ onClick, isOpen }) => (
              <AccountMenuWrapper onClick={onClick}>
                <AccountText>
                  <AccountName>{username || userId}</AccountName>
                  <Balance>
                    {!isBalanceUpdated ? (
                      <ContentLoader width="100" height="5" />
                    ) : (
                      <>{formattedBalance} Commun</>
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
                <Link route="blacklist">
                  <MenuLink className="js-header__dropdown-blacklist">Blacklist</MenuLink>
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
    const { currentUser, refId, featureToggles } = this.props;

    if (currentUser) {
      return this.renderUserBlock();
    }

    return (
      <AuthButtons>
        <Button name="header__login" small onClick={this.loginHandler}>
          Sign in
        </Button>
        {refId || featureToggles[FEATURE_SIGN_UP] ? (
          <Button
            name="header__register"
            id="gtm-sign-up-general"
            small
            primary
            onClick={this.registerHandler}
          >
            Sign up
          </Button>
        ) : null}
      </AuthButtons>
    );
  }
}
