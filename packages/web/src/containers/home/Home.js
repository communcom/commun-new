import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import Router from 'next/router';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { FEED_TYPES, RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { statusSelector } from 'store/selectors/common';
import {
  currentUnsafeUserIdSelector,
  defaultHomeFeedSelector,
  isUnsafeAuthorizedSelector,
} from 'store/selectors/auth';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import Content from 'components/common/Content';
import PostList from 'components/common/PostList';
import { TrendingCommunitiesWidget } from 'components/widgets';
import Footer from 'components/common/Footer';
import FeedFiltersPanel from 'components/common/filters/FeedFiltersPanel';
import WhatsNewOpener from 'components/common/WhatsNew';
import FeedHeaderMobile from 'components/mobile/FeedHeaderMobile';
// import Advertisement, { HOME_PAGE_ADV_ID } from 'components/common/Advertisement';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

const FooterStyled = styled(Footer)`
  padding-bottom: 20px;
`;

export default class Home extends Component {
  static async getInitialProps(params) {
    const { store, query, res } = params;
    const { filter } = statusSelector('feed')(store.getState());

    const postListParams = { ...filter };

    const defaultFeedType = defaultHomeFeedSelector(store.getState());
    const feedType = query.feedType || defaultFeedType;
    const feedFilters = FEED_TYPES[feedType];

    if (!feedFilters) {
      return null;
    }

    const feedSubType = query.feedSubType || feedFilters[0].type;
    const feedFilter = feedFilters.find(value => value.type === feedSubType);

    if (feedFilter) {
      postListParams.type = feedSubType;

      if (feedFilter.needUserId) {
        if (!isUnsafeAuthorizedSelector(store.getState())) {
          if (res) {
            res.writeHead(302, {
              Location: '/',
            });
            res.end();
          } else {
            Router.push('/');
          }
        }

        postListParams.userId = currentUnsafeUserIdSelector(store.getState());
      }
    }

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
      <Wrapper>
        <FeedHeaderMobile />
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
          <WhatsNewOpener />
          <FeedFiltersPanel params={postListProps.queryParams} />
          <PostList {...postListProps} />
        </Content>
      </Wrapper>
    );
  }
}
