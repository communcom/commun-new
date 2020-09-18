import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToggleFeature } from '@flopflip/react-redux';
import Router from 'next/router';
import styled from 'styled-components';

import {
  FEED_TYPES,
  FEED_TYPES_MOBILE,
  POSTS_FETCH_MOBILE_LIMIT,
  TIMEFRAME_DAY,
} from 'shared/constants';
import { FEATURE_AIRDROP_WIDGET } from 'shared/featureFlags';
import {
  currentUnsafeUserIdSelector,
  defaultHomeFeedSelector,
  isUnsafeAuthorizedSelector,
} from 'store/selectors/auth';
import { statusSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';

import Content, { StickyAside } from 'components/common/Content';
import FeedFiltersPanel from 'components/common/filters/FeedFiltersPanel';
import Footer from 'components/common/Footer';
// import InviteWidget from 'components/widgets/InviteWidget';
import MobileAppsLinksBlock from 'components/common/MobileAppsLinksBlock';
import PostList from 'components/common/PostList';
import WhatsNewOpener from 'components/common/WhatsNew';
import FeedHeaderMobile from 'components/mobile/FeedHeaderMobile';
import {
  AirdropWidget,
  FaqWidget,
  TechnicalWorksWidget,
  TrendingCommunitiesWidget,
  TrendingTagsWidget,
} from 'components/widgets';
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
    const isMobile = screenTypeDown.mobileLandscape(store.getState());
    const feedFilters = isMobile ? FEED_TYPES_MOBILE[feedType] : FEED_TYPES[feedType];

    if (isMobile) {
      postListParams.limit = POSTS_FETCH_MOBILE_LIMIT;
    }

    if (!feedFilters) {
      return {
        postListProps: {
          queryParams: {},
        },
        namespacesRequired: [],
      };
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

  state = {
    isHideSidebarTechnicalWorks: true,
  };

  handleChangeVisibilityTechnicalWorks = visibility => {
    this.setState({
      isHideSidebarTechnicalWorks: visibility,
    });
  };

  render() {
    const { postListProps, isDesktop, isMobile, isMaintenance, currentUserId } = this.props;
    const { isHideSidebarTechnicalWorks } = this.state;

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
              {isMaintenance ? <TechnicalWorksWidget isHide={isHideSidebarTechnicalWorks} /> : null}
              <TrendingTagsWidget />
              <TrendingCommunitiesWidget />
              {/* <Advertisement advId={HOME_PAGE_ADV_ID} /> */}
              <MobileAppsLinksBlock />
              <FooterStyled />
            </StickyAside>
          )}
        >
          {isMaintenance ? (
            <TechnicalWorksWidget
              isBig={!isMobile}
              onChangeVisibility={this.handleChangeVisibilityTechnicalWorks}
            />
          ) : null}
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
