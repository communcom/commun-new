import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';

import { Button } from '@commun/ui';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import Avatar from 'components/common/Avatar';
import AsyncAction from 'components/common/AsyncAction';
import SeeAll from 'components/common/SeeAll';
import Widget, { Header, Title } from 'components/common/Widget';

const ITEMS_LIMIT = 5;

const CommunitiesList = styled.ul`
  margin: 14px 0 10px;
`;

const CommunitiesItem = styled.li`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;

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
      .filter(item => !item.isSubscribed)
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
            <AsyncAction onClickHandler={() => this.onSubscribeClick(communityId)}>
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
      <Widget>
        <Header>
          <Title>Trending communities</Title>
          <Link route="communities" passHref>
            <SeeAll />
          </Link>
        </Header>
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </Widget>
    );
  }
}
