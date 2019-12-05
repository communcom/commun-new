import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { profileType } from 'types';
import { Router } from 'shared/routes';

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
  color: #000;
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

const MenuAction = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  background-color: #fff;
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
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;

  ${is('isRed')`
    background-color: ${({ theme }) => theme.colors.red};
  `};

  ${is('isGray')`
    background-color: #AEB8D1;
  `};
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
`;

export default class MobileMenuModal extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool,

    close: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
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

  getMenuContent() {
    const { profile, isOwner, blockUser, unblockUser } = this.props;
    const { isBlocked } = profile;
    const menuList = [];

    if (!isOwner) {
      menuList.push({
        id: 'block',
        desc: isBlocked ? 'Unblock' : 'Block',
        handler: isBlocked ? unblockUser : blockUser,
      });
    }

    return menuList;
  }

  // eslint-disable-next-line class-methods-use-this
  renderActionItem(id, desc, handler, isSettings) {
    return (
      <MenuAction isSettings={isSettings} onClick={handler}>
        <LeftWrapper>
          <IconWrapper isRed>
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
            {this.getMenuContent().map(({ id, desc, handler }) => (
              <MenuItem key={id}>{this.renderActionItem(id, desc, handler)}</MenuItem>
            ))}
          </Menu>
          {isOwner
            ? this.renderActionItem('settings', 'Settings', this.onSettingsClick, true)
            : null}
        </ContentWrapper>
      </WrapperStyled>
    );
  }
}
