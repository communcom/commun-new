import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { FEED_TYPE_NEW, FEED_TYPE_SUBSCRIPTIONS, RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { statusSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector, isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import Content from 'components/common/Content';
import PostList from 'components/common/PostList';
import { TrendingCommunitiesWidget } from 'components/widgets';
import Footer from 'components/common/Footer';
import FeedFiltersPanel from 'components/common/FeedFiltersPanel';
import InlineEditorSlot from 'components/common/InlineEditorSlot';
// import Advertisement, { HOME_PAGE_ADV_ID } from 'components/common/Advertisement';

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

const FooterStyled = styled(Footer)`
  padding-bottom: 20px;
`;

export default class Home extends Component {
  static async getInitialProps(params) {
    const { store, query } = params;

    const { filter } = statusSelector('feed')(store.getState());
    const postListParams = { ...filter };

    let type = query.feedSubType || query.feedType;

    if (!type) {
      if (isUnsafeAuthorizedSelector(store.getState())) {
        type = FEED_TYPE_SUBSCRIPTIONS;
        postListParams.userId = currentUnsafeUserIdSelector(store.getState());
      } else {
        type = FEED_TYPE_NEW;
      }
    }

    postListParams.type = type;

    const [postListProps] = await Promise.all([
      PostList.getInitialProps({
        store,
        params: postListParams,
      }),
      TrendingCommunitiesWidget.getInitialProps(params),
    ]);

    return {
      postListProps,
      namespacesRequired: [],
    };
  }

  static propTypes = {
    postListProps: PropTypes.shape({}).isRequired,
  };

  render() {
    const { postListProps } = this.props;

    return (
      <Content
        aside={() => (
          <RightWrapper>
            <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
              <TrendingCommunitiesWidget />
              {/* <Advertisement advId={HOME_PAGE_ADV_ID} /> */}
              <FooterStyled />
            </Sticky>
          </RightWrapper>
        )}
      >
        <InlineEditorSlot />
        <FeedFiltersPanel params={postListProps.queryParams} />
        <PostList {...postListProps} />
      </Content>
    );
  }
}
