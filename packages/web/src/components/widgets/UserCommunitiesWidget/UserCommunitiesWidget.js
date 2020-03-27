import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { userType, communityType } from 'types';
import { Link } from 'shared/routes';
import { withTranslation } from 'shared/i18n';
import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import { parseLargeNumber } from 'utils/parseLargeNumber';

import { WidgetCard, WidgetHeader } from '../common';

const DISP_COM_QUANTITY = 3;

const CommunitiesQuantity = styled.a`
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.blue};

    &:hover,
    &:focus {
      color: ${theme.colors.blueHover};
    }
  `};
`;

const CommunitiesList = styled.ul``;

const CommunitiesItem = styled.li`
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 15px;
`;

const CommunityInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 16px;
`;

const CommunityName = styled.a`
  display: block;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-transform: capitalize;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.black};

    &:hover,
    &:focus {
      color: ${theme.colors.blue};
    }
  `};
`;

const CommunityFollowers = styled.p`
  margin-top: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

@withTranslation()
export default class UserCommunitiesWidget extends Component {
  static propTypes = {
    user: userType.isRequired,
    items: PropTypes.arrayOf(communityType).isRequired,
  };

  renderCommunities() {
    const { items, t } = this.props;
    const displayingCommunities = items.slice(0, DISP_COM_QUANTITY);

    return displayingCommunities.map(({ communityId, alias, name, followersQuantity }) => (
      <CommunitiesItem key={communityId}>
        <Avatar communityId={communityId} useLink />
        <CommunityInfo>
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <CommunityName>{name}</CommunityName>
          </Link>
          <CommunityFollowers>
            {parseLargeNumber(followersQuantity)}{' '}
            {t('common.counters.follower', { count: followersQuantity })}
          </CommunityFollowers>
        </CommunityInfo>
      </CommunitiesItem>
    ));
  }

  render() {
    const { items, user, t } = this.props;
    const followingQuantity = items.length;

    if (followingQuantity === 0) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title={t('widgets.user_communities.title', { count: followingQuantity })}
          right={
            <ProfileLink user={user} section="communities">
              <CommunitiesQuantity>
                {followingQuantity} {t('common.counters.community')}
              </CommunitiesQuantity>
            </ProfileLink>
          }
        />
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </WidgetCard>
    );
  }
}
