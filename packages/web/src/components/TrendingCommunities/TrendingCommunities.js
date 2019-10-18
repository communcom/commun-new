import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import { isNil } from 'ramda';

import { Button } from '@commun/ui';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import Avatar from 'components/Avatar';
import AsyncAction from 'components/AsyncAction';

const ITEMS_LIMIT = 5;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 16px;
  background-color: #fff;
  border-radius: 6px;

  ${up('tablet')} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextGreySecond};
`;

const CommunitiesList = styled.ul`
  margin: 14px 0 10px;
`;

const CommunitiesItem = styled.li`
  display: flex;
  min-height: 44px;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 13px;
  }
`;

const CommunityInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
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

const SeeAll = styled.a`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const JoinButton = styled(Button)`
  min-width: 67px;
  text-align: center;
`;

export default class TrendingCommunities extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isCommunity: PropTypes.bool,
    fetchCommunitiesIfEmpty: PropTypes.func.isRequired,
    joinCommunity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCommunity: false,
  };

  componentDidMount() {
    const { fetchCommunitiesIfEmpty } = this.props;
    fetchCommunitiesIfEmpty();
  }

  onSubscribeClick = async communityId => {
    const { joinCommunity } = this.props;
    await joinCommunity(communityId);
  };

  renderCommunities() {
    const { items, isCommunity } = this.props;

    return items
      .slice(0, ITEMS_LIMIT)
      .map(({ communityId, alias, name, subscribersCount, isSubscribed }) => (
        <CommunitiesItem key={communityId}>
          <Avatar communityId={communityId} useLink />
          <CommunityInfo>
            <Link route="community" params={{ communityAlias: alias }} passHref>
              <CommunityName community={isCommunity}>{name}</CommunityName>
            </Link>
            {isNil(subscribersCount) ? null : (
              <CommunityFollowers>
                {parseLargeNumber(subscribersCount)} followers
              </CommunityFollowers>
            )}
          </CommunityInfo>
          {isSubscribed ? null : (
            <AsyncAction onClick={() => this.onSubscribeClick(communityId)}>
              <JoinButton className="trending-communities__subscribe">Join</JoinButton>
            </AsyncAction>
          )}
        </CommunitiesItem>
      ));
  }

  render() {
    const { items } = this.props;

    if (items.length === 0) {
      return null;
    }

    return (
      <Wrapper>
        <Header>
          <Title>Trending communities</Title>
          <Link route="communities" passHref>
            <SeeAll>see all</SeeAll>
          </Link>
        </Header>
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </Wrapper>
    );
  }
}
