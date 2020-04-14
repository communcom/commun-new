import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { profileType } from 'types';
import { Router } from 'shared/routes';
import { withTranslation } from 'shared/i18n';

import Avatar from 'components/common/Avatar';
import { Wrapper, CloseButtonStyled, DescriptionHeader } from '../common';

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
  background-color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  font-size: 17px;
  line-height: 100%;

  ${is('isSettings')`
    margin-top: 15px;
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
export default class MobileMenuModal extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool,

    close: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    sendPoints: PropTypes.func.isRequired,
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

  getMenuContent() {
    const { profile, isOwner, blockUser, unblockUser, sendPoints, editBio, t } = this.props;
    const { isBlocked } = profile;
    const menuList = [];

    if (!isOwner) {
      menuList.push(
        {
          id: 'block',
          desc: isBlocked ? t('common.unblock') : t('common.block'),
          handler: isBlocked ? unblockUser : blockUser,
          color: '#ed2c5b',
        },
        {
          id: 'send-points',
          desc: t('modals.profile_mobile_menu.send_points'),
          handler: sendPoints,
          color: '#6a80f5',
        }
      );
    }

    if (isOwner && profile?.personal?.biography) {
      menuList.push({
        id: 'edit',
        desc: t('modals.profile_mobile_menu.edit_bio'),
        handler: editBio,
        color: '#a5a7bd',
      });
    }

    return menuList;
  }

  // eslint-disable-next-line class-methods-use-this
  renderActionItem(id, desc, handler, isSettings, color) {
    return (
      <MenuAction isSettings={isSettings} onClick={handler}>
        <LeftWrapper>
          <IconWrapper color={color}>
            <IconStyled name={id} />
          </IconWrapper>
          {desc}
        </LeftWrapper>
      </MenuAction>
    );
  }

  render() {
    const { profile, isOwner } = this.props;
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
            {this.getMenuContent().map(({ id, desc, handler, color }) => (
              <MenuItem key={id}>{this.renderActionItem(id, desc, handler, false, color)}</MenuItem>
            ))}
          </Menu>
          {isOwner ? (
            <>
              {this.renderActionItem('block', 'Blacklist', this.onBlacklistClick, true, '#ed2c5b')}
              {this.renderActionItem('settings', 'Settings', this.onSettingsClick, true, '#aeb8d1')}
            </>
          ) : null}
        </ContentWrapper>
      </WrapperStyled>
    );
  }
}
