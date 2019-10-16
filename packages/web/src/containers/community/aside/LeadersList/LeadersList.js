/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card } from '@commun/ui';
import UsersList from 'containers/community/UsersList';
import { fetchLeaders } from 'store/actions/gate';
import CardHeader from '../CardHeader';

const Wrapper = styled(Card)``;

const Main = styled.main`
  margin-top: 25px;
`;

export default class LeadersList extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    leaders: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    fetchLeaders: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static async getInitialProps({ query, store }) {
    await store.dispatch(
      fetchLeaders({
        communityId: query.communityId,
      })
    );

    return { communityId: query.communityId };
  }

  onNeedMore = () => {
    const { communityId, isLoading, isEnd, sequenceKey, fetchLeaders } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    fetchLeaders({ communityId, sequenceKey });
  };

  render() {
    const { leaders, isEnd, isLoading } = this.props;

    if (!leaders.length) {
      return null;
    }

    return (
      <Wrapper>
        <CardHeader headerText={`${leaders.length} leaders`} />
        <Main>
          <UsersList items={leaders.slice(0, 3)} isEnd={isEnd} isLoading={isLoading} />
        </Main>
      </Wrapper>
    );
  }
}
