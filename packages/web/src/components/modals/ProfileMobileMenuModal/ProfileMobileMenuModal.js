import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

import { profileType } from 'types';
import { withTranslation } from 'shared/i18n';
import { Router } from 'shared/routes';

import Avatar from 'components/common/Avatar';
import { CloseButtonStyled, DescriptionHeader, Wrapper } from '../common';

const WrapperStyled = styled(Wrapper)`
  flex-basis: 450px;
  height: auto;
  padding: 20px 15px;
  margin: auto 0 5px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 24px 24px 0 0;

  ${up.mobileLandscape} {
    margin: 0;
  }
`;

const DescriptionHeaderStyled = styled(DescriptionHeader)`
  justify-content: space-between;
`;

const CloseButton = styled(CloseButtonStyled)`
  display: flex;
  width: 30px;
  height: 30px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.gray};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &:focus {
    color: #fff;
  }
`;

const ContentWrapper = styled.section``;

const Header = styled.header`
  display: flex;
  padding-right: 30px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
`;

const Name = styled.p`
  margin-bottom: 3px;
  font-size: 15px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.black};
`;

const Username = styled.p`
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.blue};
`;

const Menu = styled.ul`
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }
`;

const MenuItem = styled.li``;

const MenuAction = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  font-size: 17px;
  line-height: 100%;

  ${is('isSettings')`
    margin-top: 15px;
    border-radius: 10px;
  `};

  ${is('isLogout')`
    justify-content: center;
    margin-top: 30px;
    color: #fff;
    background-color: ${({ theme }) => theme.colors.lightRed};
    border-radius: 10px;
  `};
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :first-child {
    margin-right: 10px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
  color: #fff;
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
`;

@withTranslation()
export default class ProfileMobileMenuModal extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool,

    close: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    sendPoints: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    editBio: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  onSettingsClick = () => {
    Router.push('/settings');
    this.onCloseClick();
  };

  onBlacklistClick = () => {
    Router.push('/blacklist');
    this.onCloseClick();
  };

  onLogoutClick = () => {
    const { logout } = this.props;
    logout();
    this.onCloseClick();
  };

  getMenuContent() {
    const { profile, isOwner, blockUser, unblockUser, sendPoints, editBio, t } = this.props;
    const { isBlocked } = profile;
    const menuList = [];

    if (!isOwner) {
      menuList.push(
        {
          id: 'block',
          icon: 'block',
          color: '#ed2c5b',
          desc: isBlocked ? t('common.unblock') : t('common.block'),
          onClick: isBlocked ? unblockUser : blockUser,
        },
        {
          id: 'send-points',
          icon: 'send-points',
          color: '#6a80f5',
          desc: t('modals.profile_mobile_menu.send_points'),
          onClick: sendPoints,
        }
      );
    }

    if (isOwner && profile?.personal?.biography) {
      menuList.push({
        id: 'edit',
        icon: 'edit',
        color: '#a5a7bd',
        desc: t('modals.profile_mobile_menu.edit_bio'),
        onClick: editBio,
      });
    }

    return menuList;
  }

  // eslint-disable-next-line class-methods-use-this
  renderActionItem({ icon, color, desc, onClick, isSettings, isLogout }) {
    return (
      <MenuAction isSettings={isSettings} isLogout={isLogout} onClick={onClick}>
        <LeftWrapper>
          {icon ? (
            <IconWrapper color={color}>
              <IconStyled name={icon} />
            </IconWrapper>
          ) : null}
          {desc}
        </LeftWrapper>
      </MenuAction>
    );
  }

  render() {
    const { profile, isOwner, t } = this.props;
    const { userId, username } = profile;

    return (
      <WrapperStyled role="dialog">
        <DescriptionHeaderStyled>
          <Header>
            <Avatar userId={userId} />
            <NameWrapper>
              <Name>{username}</Name>
              <Username>@{username}</Username>
            </NameWrapper>
          </Header>
          <CloseButton onClick={this.onCloseClick} />
        </DescriptionHeaderStyled>
        <ContentWrapper>
          <Menu>
            {this.getMenuContent().map(props => (
              <MenuItem key={props.id}>{this.renderActionItem(props)}</MenuItem>
            ))}
          </Menu>
          {isOwner ? (
            <>
              {this.renderActionItem({
                icon: 'block',
                color: '#ed2c5b',
                desc: t('components.blacklist.title'),
                onClick: this.onBlacklistClick,
                isSettings: true,
              })}
              {this.renderActionItem({
                icon: 'settings',
                color: '#aeb8d1',
                desc: t('components.auth_block.settings'),
                onClick: this.onSettingsClick,
                isSettings: true,
              })}
              {this.renderActionItem({
                color: '#aeb8d1',
                desc: t('components.auth_block.logout'),
                onClick: this.onLogoutClick,
                isLogout: true,
              })}
            </>
          ) : null}
        </ContentWrapper>
      </WrapperStyled>
    );
  }
}
