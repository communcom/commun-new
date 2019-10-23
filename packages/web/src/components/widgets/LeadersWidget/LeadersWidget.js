/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { communityType } from 'types';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';
import Avatar from 'components/common/Avatar';
import { CommunityLink, ProfileLink } from 'components/links';
import SeeAll from 'components/common/SeeAll';

import { WidgetCard, WidgetHeader } from '../common';

const ITEMS_LIMIT = 5;

const LeadersList = styled.ul``;

const LeadersItem = styled.li`
  width: 100%;
  height: 55px;
`;

const LeaderName = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  padding: 0 0 2px;
  transition: color 0.15s;
`;

const LeaderLink = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
  color: #000;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const LeaderNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
`;

const LeaderTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class LeadersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string,
        avatarUrl: PropTypes.string,
        rating: PropTypes.string.isRequired,
      })
    ).isRequired,
    community: communityType.isRequired,
    fetchLeadersWidgetIfEmpty: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const { communityId } = parentInitialProps;

    try {
      await store.dispatch(fetchLeadersWidgetIfEmpty({ communityId, limit: ITEMS_LIMIT }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('fetchLeadersWidget failed:', err);
    }
  }

  componentDidMount() {
    const { communityId, fetchLeadersWidgetIfEmpty } = this.props;

    fetchLeadersWidgetIfEmpty({
      communityId,
      limit: ITEMS_LIMIT,
    });
  }

  render() {
    const { items, community } = this.props;

    return (
      <WidgetCard>
        <WidgetHeader
          title="Leaders"
          count={items.length}
          link={
            <CommunityLink community={community} section="leaders">
              <SeeAll />
            </CommunityLink>
          }
        />
        <LeadersList>
          {items.map(({ userId, username, rating }) => (
            <LeadersItem key={userId}>
              <ProfileLink user={username} allowEmpty>
                <LeaderLink>
                  <Avatar userId={userId} />
                  <LeaderNameWrapper>
                    <LeaderName>{username || `id: ${userId}`}</LeaderName>
                    <LeaderTitle>rating: {rating}</LeaderTitle>
                  </LeaderNameWrapper>
                </LeaderLink>
              </ProfileLink>
            </LeadersItem>
          ))}
        </LeadersList>
      </WidgetCard>
    );
  }
}
