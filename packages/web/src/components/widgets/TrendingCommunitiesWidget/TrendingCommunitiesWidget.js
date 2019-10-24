/* eslint-disable no-shadow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNil } from 'ramda';

import { Button } from '@commun/ui';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import Avatar from 'components/common/Avatar';
import AsyncAction from 'components/common/AsyncAction';
import SeeAll from 'components/common/SeeAll';
import { getTrendingCommunitiesIfEmpty } from 'store/actions/complex';

import { displayError } from 'utils/toastsMessages';
import { WidgetCard, WidgetHeader } from '../common';

const ITEMS_LIMIT = 5;

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
  flex-grow: 1;
  margin-left: 10px;
`;

const CommunityName = styled.a`
  display: block;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-transform: capitalize;
  transition: color 0.15s;

  ${({ theme }) => `
    color: ${theme.colors.contextBlack};

    &:focus {
      color: ${theme.colors.contextBlue};
    }
  `};
`;

const CommunityFollowers = styled.p`
  margin-top: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const JoinButton = styled(Button)`
  min-width: 67px;
  text-align: center;
`;

export default class TrendingCommunitiesWidget extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    joinCommunity: PropTypes.func.isRequired,
    getTrendingCommunitiesIfEmpty: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store }) {
    try {
      await store.dispatch(getTrendingCommunitiesIfEmpty());
    } catch (err) {
      // В случае ошибки ничего не делаем.
      // eslint-disable-next-line no-console
      console.error('fetchCommunitiesIfEmpty failed:', err);
    }
  }

  componentDidMount() {
    const { getTrendingCommunitiesIfEmpty } = this.props;

    // getInitialProps может не сработать или вообще может быть не вызван,
    // на всякий случай вызываем ещё раз проверку данных на стороне клиента.
    getTrendingCommunitiesIfEmpty().catch(err =>
      // eslint-disable-next-line no-console
      console.error(err)
    );
  }

  onSubscribeClick = async communityId => {
    const { joinCommunity } = this.props;
    try {
      await joinCommunity(communityId);
    } catch (err) {
      displayError(err);
    }
  };

  renderCommunities() {
    const { items } = this.props;

    return items
      .filter(item => !item.isSubscribed)
      .slice(0, ITEMS_LIMIT)
      .map(({ communityId, alias, name, subscribersCount, isSubscribed }) => (
        <CommunitiesItem key={communityId}>
          <Avatar communityId={communityId} useLink />
          <CommunityInfo>
            <Link route="community" params={{ communityAlias: alias }} passHref>
              <CommunityName>{name}</CommunityName>
            </Link>
            {isNil(subscribersCount) ? null : (
              <CommunityFollowers>
                {parseLargeNumber(subscribersCount)} followers
              </CommunityFollowers>
            )}
          </CommunityInfo>
          {isSubscribed ? null : (
            <AsyncAction onClickHandler={() => this.onSubscribeClick(communityId)}>
              <JoinButton primary className="trending-communities__subscribe">
                Join
              </JoinButton>
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
      <WidgetCard>
        <WidgetHeader
          title="Trending communities"
          link={
            <Link route="communities" passHref>
              <SeeAll />
            </Link>
          }
        />
        <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
      </WidgetCard>
    );
  }
}
