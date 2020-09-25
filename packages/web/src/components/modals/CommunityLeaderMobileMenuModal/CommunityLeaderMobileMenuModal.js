import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

import { communityType } from 'types';
import { FEATURE_COMMUNITY_MANAGE } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

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
  font-weight: 600;
  font-size: 17px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.black};
`;

const Info = styled.p`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Menu = styled.ul`
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }
`;

const MenuItem = styled.li``;

const MenuAction = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  font-weight: 500;
  font-size: 17px;
  line-height: 100%;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.white};
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

const SettingsItem = styled.div`
  border-radius: 10px;
`;

@injectFeatureToggles([FEATURE_COMMUNITY_MANAGE])
@withTranslation()
export default class CommunityLeaderMobileMenuModal extends PureComponent {
  static propTypes = {
    community: communityType.isRequired,

    featureToggles: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  };

  getMenuContent() {
    const { featureToggles, t } = this.props;
    const menuList = [
      {
        id: 'reports',
        icon: 'attention',
        color: '#f2c94c',
        desc: t('modals.community_leader_mobile_menu.reports'),
        params: communityAlias => ({ communityAlias, section: 'reports' }),
      },
      {
        id: 'proposals',
        icon: 'warning',
        color: '#4edbb0',
        desc: t('modals.community_leader_mobile_menu.proposals'),
        params: communityAlias => ({ communityAlias, section: 'proposals' }),
      },
    ];

    if (featureToggles[FEATURE_COMMUNITY_MANAGE]) {
      menuList.push(
        {
          id: 'members',
          icon: 'user',
          color: '#6a80f5',
          desc: t('modals.community_leader_mobile_menu.members'),
          params: communityAlias => ({ communityAlias, section: 'members' }),
        },
        {
          id: 'ban',
          icon: 'block',
          color: '#ed2c5b',
          desc: t('modals.community_leader_mobile_menu.ban'),
          params: communityAlias => ({ communityAlias, section: 'members', subSection: 'banned' }),
        }
      );
    }

    return menuList;
  }

  handleCloseClick = () => {
    const { close } = this.props;
    close();
  };

  // eslint-disable-next-line class-methods-use-this
  renderActionItem({ icon, color, desc, params }) {
    const { community } = this.props;

    return (
      <Link route="leaderboard" params={params(community.alias)}>
        <MenuAction>
          <LeftWrapper>
            {icon ? (
              <IconWrapper color={color}>
                <IconStyled name={icon} />
              </IconWrapper>
            ) : null}
            {desc}
          </LeftWrapper>
        </MenuAction>
      </Link>
    );
  }

  render() {
    const { community, featureToggles, t } = this.props;
    const { communityId, name, subscribersCount, postsCount } = community;

    return (
      <WrapperStyled role="dialog">
        <DescriptionHeaderStyled>
          <Header>
            <Avatar communityId={communityId} />
            <NameWrapper>
              <Name>{name}</Name>
              <Info>
                {subscribersCount} {t('common.counters.follower', { count: subscribersCount })}
                {` \u2022 `}
                {postsCount} {t('common.counters.post', { count: postsCount })}
              </Info>
            </NameWrapper>
          </Header>
          <CloseButton onClick={this.handleCloseClick} />
        </DescriptionHeaderStyled>
        <ContentWrapper>
          <Menu>
            {this.getMenuContent().map(props => (
              <MenuItem key={props.id}>{this.renderActionItem(props)}</MenuItem>
            ))}
          </Menu>
          {featureToggles[FEATURE_COMMUNITY_MANAGE] ? (
            <SettingsItem>
              {this.renderActionItem({
                icon: 'gear',
                color: '#aeb8d1',
                desc: t('modals.community_leader_mobile_menu.settings'),
                params: communityAlias => ({
                  communityAlias,
                  section: 'members',
                  subSection: 'settings',
                }),
              })}
            </SettingsItem>
          ) : null}
        </ContentWrapper>
      </WrapperStyled>
    );
  }
}
