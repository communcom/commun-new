import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Router from 'next/router';
import { ToggleFeature } from '@flopflip/react-redux';

import { FEED_TYPES, TIMEFRAME_DAY } from 'shared/constants';
import { statusSelector } from 'store/selectors/common';
import {
  currentUnsafeUserIdSelector,
  defaultHomeFeedSelector,
  isUnsafeAuthorizedSelector,
} from 'store/selectors/auth';

import Content, { StickyAside } from 'components/common/Content';
import PostList from 'components/common/PostList';
import Footer from 'components/common/Footer';
import FeedFiltersPanel from 'components/common/filters/FeedFiltersPanel';
import WhatsNewOpener from 'components/common/WhatsNew';
import FeedHeaderMobile from 'components/mobile/FeedHeaderMobile';
import {
  TrendingCommunitiesWidget,
  TechnicalWorksWidget,
  FaqWidget,
  AirdropWidget,
} from 'components/widgets';
// import InviteWidget from 'components/widgets/InviteWidget';

import MobileAppsLinksBlock from 'components/common/MobileAppsLinksBlock';
import { FEATURE_AIRDROP_WIDGET } from 'shared/featureFlags';
// import Advertisement, { HOME_PAGE_ADV_ID } from 'components/common/Advertisement';

const Wrapper = styled.div`
  flex-basis: 100%;
  overflow: hidden;
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
    const feedSubSubType = query.feedSubSubType || TIMEFRAME_DAY;
    const feedFilter = feedFilters.find(value => value.type === feedSubType);

    if (feedFilter) {
      postListParams.type = feedSubType;

      if (feedSubSubType) {
        postListParams.timeframe = feedSubSubType;
      }

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
    postListProps: PropTypes.object.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isMaintenance: PropTypes.bool.isRequired,
    currentUserId: PropTypes.string,
  };

  static defaultProps = {
    currentUserId: null,
  };

  render() {
    const { postListProps, isDesktop, isMobile, isMaintenance, currentUserId } = this.props;

    return (
      <Wrapper>
        <FeedHeaderMobile params={postListProps.queryParams} />
        <Content
          aside={() => (
            <StickyAside>
              {/* <InviteWidget /> */}
              <ToggleFeature flag={FEATURE_AIRDROP_WIDGET}>
                {({ isFeatureEnabled }) => (isFeatureEnabled ? <AirdropWidget /> : <FaqWidget />)}
              </ToggleFeature>
              {isMaintenance ? <TechnicalWorksWidget /> : null}
              <TrendingCommunitiesWidget />
              {/* <Advertisement advId={HOME_PAGE_ADV_ID} /> */}
              <MobileAppsLinksBlock />
              <FooterStyled />
            </StickyAside>
          )}
        >
          {isMaintenance ? <TechnicalWorksWidget isBig={!isMobile} /> : null}
          {isDesktop ? null : (
            <>
              {/* <InviteWidget /> */}
              <ToggleFeature flag={FEATURE_AIRDROP_WIDGET}>
                {({ isFeatureEnabled }) => (isFeatureEnabled ? <AirdropWidget /> : <FaqWidget />)}
              </ToggleFeature>
            </>
          )}
          <WhatsNewOpener />
          {isMobile ? null : <FeedFiltersPanel params={postListProps.queryParams} />}
          {isDesktop && !currentUserId ? <FaqWidget isBig /> : null}
          <PostList {...postListProps} />
        </Content>
      </Wrapper>
    );
  }
}
