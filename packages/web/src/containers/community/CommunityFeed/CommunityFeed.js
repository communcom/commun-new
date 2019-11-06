import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PostList from 'components/common/PostList';
import WhatsNewOpener from 'components/common/WhatsNew';
// import FeedFiltersPanel from 'components/common/FeedFiltersPanel';

const Wrapper = styled.div``;

export default class CommunityFeed extends PureComponent {
  static propTypes = {
    queryParams: PropTypes.shape({
      type: PropTypes.string.isRequired,
      communityAlias: PropTypes.string.isRequired,
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
    // TODO: currently doesn't support filtering in this feed
    // const { queryParams } = this.props;

    return (
      <Wrapper>
        <WhatsNewOpener />
        {/* <FeedFiltersPanel params={queryParams} /> */}
        <PostList {...this.props} />
      </Wrapper>
    );
  }
}
