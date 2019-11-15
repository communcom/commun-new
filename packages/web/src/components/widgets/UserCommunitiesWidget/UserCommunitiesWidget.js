import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Link } from 'shared/routes';
import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import { userType, communityType } from 'types';

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

export default class UserCommunitiesWidget extends Component {
  static propTypes = {
    user: userType.isRequired,
    items: PropTypes.arrayOf(communityType).isRequired,
  };

  renderCommunities() {
    const { items } = this.props;
    const displayingCommunities = items.slice(0, DISP_COM_QUANTITY);

    return displayingCommunities.map(({ communityId, alias, name, followersQuantity }) => (
      <CommunitiesItem key={communityId}>
        <Avatar communityId={communityId} useLink />
        <CommunityInfo>
          <Link route="community" params={{ communityAlias: alias }} passHref>
            <CommunityName>{name}</CommunityName>
          </Link>
          <CommunityFollowers>{parseLargeNumber(followersQuantity)} followers</CommunityFollowers>
        </CommunityInfo>
      </CommunitiesItem>
    ));
  }

  render() {
    const { items, user } = this.props;
    const followingQuantity = items.length;

    if (followingQuantity === 0) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title="Communities"
          right={
            <ProfileLink user={user} section="communities">
              <CommunitiesQuantity>{followingQuantity} communities</CommunitiesQuantity>
            </ProfileLink>
          }
        />
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </WidgetCard>
    );
  }
}
