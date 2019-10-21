import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PostList from 'components/common/PostList';
import WhatsNewOpener from 'components/common/WhatsNew';
import FeedFiltersPanel from 'components/common/FeedFiltersPanel';
import InlineEditorSlot from 'components/common/InlineEditorSlot';

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
    const { queryParams } = this.props;

    return (
      <Wrapper>
        <InlineEditorSlot />
        <WhatsNewOpener />
        <FeedFiltersPanel params={queryParams} />
        <PostList {...this.props} />
      </Wrapper>
    );
  }
}
