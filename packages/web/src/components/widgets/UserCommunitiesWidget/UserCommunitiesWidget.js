import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Link } from 'shared/routes';
import { ProfileLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import { userType, communityType } from 'types';

import { WidgetCard, WidgetHeader, WidgetTitle } from '../common';

const DISP_COM_QUANTITY = 3;

const CommunitiesQuantity = styled.a`
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.contextBlue};

    &:hover,
    &:focus {
      color: ${theme.colors.contextBlueHover};
    }
  `};
`;

const CommunitiesList = styled.ul``;

const CommunitiesItem = styled.li`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
`;

const CommunityInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 16px;
`;

const CommunityName = styled.a`
  display: block;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.41px;
  text-transform: capitalize;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.contextBlack};

    &:hover,
    &:focus {
      color: ${theme.colors.contextBlue};
    }
  `};
`;

const CommunityFollowers = styled.p`
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
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
        <WidgetHeader>
          <WidgetTitle>Communities</WidgetTitle>
          <ProfileLink user={user} section="communities">
            <CommunitiesQuantity>{followingQuantity} communities</CommunitiesQuantity>
          </ProfileLink>
        </WidgetHeader>
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </WidgetCard>
    );
  }
}
