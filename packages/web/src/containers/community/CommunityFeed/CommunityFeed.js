import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PostList from 'components/PostList';
import WhatsNewOpener from 'components/WhatsNew';
import FeedFiltersPanel from 'components/FeedFiltersPanel';

const Wrapper = styled.div``;

export default class CommunityFeed extends PureComponent {
  static propTypes = {
    queryParams: PropTypes.shape({
      type: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  static async getInitialProps({ query, store }) {
    const props = await PostList.getInitialProps({
      store,
      params: {
        type: 'community',
        communityAlias: query.communityAlias,
      },
    });

    return {
      ...props,
      namespacesRequired: [],
    };
  }

  render() {
    const { queryParams } = this.props;

    return (
      <Wrapper>
        <WhatsNewOpener isCommunity />
        <FeedFiltersPanel params={queryParams} isCommunity />
        <PostList {...this.props} />
      </Wrapper>
    );
  }
}
