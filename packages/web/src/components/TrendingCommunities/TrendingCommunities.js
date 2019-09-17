import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { Link } from 'shared/routes';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import Avatar from 'components/Avatar';
import { parseLargeNumber } from 'utils/parseLargeNumber';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;

  ${up('tablet')} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const CommunitiesList = styled.ul``;

const CommunitiesItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
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

    &:focus {
      color: ${theme.colors.contextBlue};
    }
  `};

  ${is('community')`
    &:focus {
      color: ${({ theme }) => theme.colors.communityColor};
    }
  `};
`;

const CommunityFollowers = styled.p`
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const SubscribeButton = styled.button.attrs({ type: 'button' })`
  display: block;
  height: 100%;
  margin-left: auto;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }

  ${is('community')`
    color: ${({ theme }) => theme.colors.communityColor};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.communityColorHover};
    }
  `};
`;

export default class TrendingCommunities extends Component {
  static propTypes = {
    trendingCommunities: PropTypes.arrayOf(PropTypes.object),
    isCommunity: PropTypes.bool,
  };

  static defaultProps = {
    trendingCommunities: [],
    isCommunity: false,
  };

  subscribeHandler = () => {
    // TODO: implement real subscribes
  };

  renderCommunities() {
    const { trendingCommunities, isCommunity } = this.props;

    return trendingCommunities.map(({ id, name, followersQuantity }) => (
      <CommunitiesItem key={id}>
        <Avatar communityId={id} useLink />
        <CommunityInfo>
          <Link route="community" params={{ communityId: id }} passHref>
            <CommunityName community={isCommunity}>{name}</CommunityName>
          </Link>
          <CommunityFollowers>{parseLargeNumber(followersQuantity)} followers</CommunityFollowers>
        </CommunityInfo>
        <SubscribeButton
          name="trending-communities__subscribe"
          community={isCommunity}
          onClick={this.subscribeHandler}
        >
          Subscribe
        </SubscribeButton>
      </CommunitiesItem>
    ));
  }

  render() {
    const { trendingCommunities } = this.props;

    if (trendingCommunities.length === 0) {
      return null;
    }

    return (
      <Wrapper>
        <Header>
          <Title>Trending communities</Title>
        </Header>
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </Wrapper>
    );
  }
}
