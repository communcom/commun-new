import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FEED_COMMUNITY_TYPES, TIMEFRAME_DAY } from 'shared/constants';
import WhatsNewOpener from 'components/common/WhatsNew';
import FeedCommunityFiltersPanel from 'components/common/filters/FeedCommunityFiltersPanel';
import PostList from 'components/common/PostList';

const Wrapper = styled.div``;

export default class CommunityFeed extends PureComponent {
  static propTypes = {
    queryParams: PropTypes.shape({
      type: PropTypes.string.isRequired,
      communityAlias: PropTypes.string.isRequired,
    }).isRequired,
  };

  static async getInitialProps(params) {
    const { store, query } = params;

    const postListParams = {
      communityAlias: query.communityAlias,
    };

    const feedSubSection = query.subSection || FEED_COMMUNITY_TYPES[0].type;
    const feedFilter = FEED_COMMUNITY_TYPES.find(value => value.type === feedSubSection);
    const feedSubFilter = query.subSubSection || TIMEFRAME_DAY;

    if (feedFilter) {
      postListParams.type = feedSubSection;
    }

    if (feedSubFilter) {
      postListParams.timeframe = feedSubFilter;
    }

    const props = await PostList.getInitialProps({
      store,
      params: postListParams,
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
        <WhatsNewOpener />
        <FeedCommunityFiltersPanel params={queryParams} />
        <PostList {...this.props} />
      </Wrapper>
    );
  }
}
