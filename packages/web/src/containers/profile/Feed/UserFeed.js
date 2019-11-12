import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FEED_TYPE_USER } from 'shared/constants';
import PostList from 'components/common/PostList';
import WhatsNewOpener from 'components/common/WhatsNew';
// import FeedFiltersPanel from 'components/common/FeedFiltersPanel';

const Wrapper = styled.div``;

export default class UserFeed extends PureComponent {
  static propTypes = {
    queryParams: PropTypes.shape({
      type: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
  };

  static async getInitialProps({ query, store }) {
    const props = await PostList.getInitialProps({
      store,
      params: {
        type: FEED_TYPE_USER,
        username: query.username,
      },
    });

    return {
      ...props,
      namespacesRequired: [],
    };
  }

  render() {
    // TODO: currently doesn't support filtering in this feed
    const { /* queryParams, */ isOwner } = this.props;

    return (
      <Wrapper>
        {isOwner ? <WhatsNewOpener /> : null}
        {/* <FeedFiltersPanel params={queryParams} /> */}
        <PostList {...this.props} />
      </Wrapper>
    );
  }
}
