/* eslint-disable class-methods-use-this,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InvisibleText } from '@commun/ui';

import { communityType } from 'types';
import Avatar from 'components/common/Avatar';
import { CommunityLink } from 'components/links';
import SeeAll from 'components/common/SeeAll';
import { getCommunityMembersWidget } from 'store/actions/gate';

import { WidgetCard, WidgetHeader } from '../common';

const ITEMS_LIMIT = 5;

const MembersList = styled.ul`
  display: flex;
  align-items: center;
  min-height: 60px;
  padding: 0 16px;
  overflow: hidden;
`;

const MembersItem = styled.li`
  &:not(:last-child) {
    margin-right: 12px;
  }
`;

const AvatarStyled = styled(Avatar)`
  display: block;
`;

export default class MembersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    community: communityType.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getCommunityMembersWidget: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const { communityId } = parentInitialProps;

    try {
      await store.dispatch(getCommunityMembersWidget({ communityId, limit: ITEMS_LIMIT }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('getCommunityMembers failed:', err);
    }
  }

  componentDidMount() {
    const { communityId, isLoaded, isLoading, getCommunityMembersWidget } = this.props;

    if (!isLoaded && !isLoading) {
      getCommunityMembersWidget({
        communityId,
        limit: ITEMS_LIMIT,
      });
    }
  }

  render() {
    const { items, community } = this.props;

    return (
      <WidgetCard>
        <WidgetHeader
          title="Members"
          count={items.length}
          link={
            <CommunityLink community={community} section="members">
              <SeeAll />
            </CommunityLink>
          }
        />
        <MembersList>
          {items.map(({ userId, username }) => (
            <MembersItem key={userId}>
              <AvatarStyled userId={userId} useLink />
              <InvisibleText>{username}</InvisibleText>
            </MembersItem>
          ))}
        </MembersList>
      </WidgetCard>
    );
  }
}
