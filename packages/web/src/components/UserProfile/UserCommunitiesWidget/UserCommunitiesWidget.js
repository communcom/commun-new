import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { Link } from 'shared/routes';
import { ProfileLink } from 'components/links';
import Avatar from 'components/Avatar';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import { userType } from 'types';

const DISP_COM_QUANTITY = 3;

const Wrapper = styled.section`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 16px;
  background-color: #fff;

  ${up('tablet')} {
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-radius: 4px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

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
    items: PropTypes.arrayOf(
      PropTypes.shape({
        communityId: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  };

  static defaultProps = {
    items: [],
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
      <Wrapper>
        <Header>
          <Title>Communities</Title>
          <ProfileLink user={user} section="communities">
            <CommunitiesQuantity>{followingQuantity} communities</CommunitiesQuantity>
          </ProfileLink>
        </Header>
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </Wrapper>
    );
  }
}
