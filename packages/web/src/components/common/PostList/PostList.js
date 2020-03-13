/* eslint-disable react/no-did-update-set-state, no-shadow, class-methods-use-this */
// TODO: commented code probably will be used later
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
// import throttle from 'lodash.throttle';

import { fetchPosts } from 'store/actions/gate';
import { Card, Loader, up } from '@commun/ui';
import {
  FEED_TYPE_SUBSCRIPTIONS,
  FEED_TYPE_SUBSCRIPTIONS_HOT,
  FEED_TYPE_SUBSCRIPTIONS_POPULAR,
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_HOT,
  FEED_TYPE_NEW,
  FEED_TYPE_COMMUNITY,
  FEED_ONBOARDING_TOOLTIP_TYPE,
} from 'shared/constants';
import { displayError } from 'utils/toastsMessages';

import { TrendingCommunitiesWidget } from 'components/widgets';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import EmptyList from 'components/common/EmptyList';
import PostCard from '../PostCard';
import CTARegistration from '../CTA/CTARegistration';
import CTAReferralProgram from '../CTA/CTAReferralProgram';

const Block = styled.div`
  min-height: 200px;
  padding: 20px;
  background: #fff;
`;

const ErrorBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 16px;
  color: #f00;
`;

const ErrorMessage = styled.div``;

const EmptyBlock = styled(Card)`
  padding: 15px 15px 0;
  margin-bottom: 8px;
  min-height: 240px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Retry = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 14px 2px;
  margin-top: 8px;
  border-radius: 17px;
  color: #fff;
  background: ${({ theme }) => theme.colors.blue};
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const FEED_TYPE = {
  [FEED_TYPE_SUBSCRIPTIONS]: 'new',
  [FEED_TYPE_SUBSCRIPTIONS_HOT]: 'hot',
  [FEED_TYPE_SUBSCRIPTIONS_POPULAR]: 'popular',
  [FEED_TYPE_TOP_LIKES]: 'popular',
  [FEED_TYPE_HOT]: 'hot',
  [FEED_TYPE_NEW]: 'new',
  [FEED_TYPE_COMMUNITY]: 'new',
};

@withRouter
export default class PostList extends PureComponent {
  static async getInitialProps({ store, params }) {
    try {
      await store.dispatch(fetchPosts(params));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fetching posts failed:', err);
    }

    return {
      queryParams: params,
    };
  }

  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    nextOffset: PropTypes.number.isRequired,
    fetchError: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    isOneColumnMode: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isShowReports: PropTypes.bool,
    queryParams: PropTypes.object.isRequired,
    isOwner: PropTypes.bool,
    // isMobile: PropTypes.bool,
    // isAutoLogging: PropTypes.bool,
    // isOnboardingBannerClosed: PropTypes.bool,
    router: PropTypes.object.isRequired,
    loggedUserId: PropTypes.string,
    rewardsArr: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line react/no-unused-prop-types
    firstUserPostId: PropTypes.string,

    fetchPosts: PropTypes.func.isRequired,
    // openAppBannerModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: undefined,
    fetchError: null,
    rewardsArr: [],
    isShowReports: false,
    isOwner: false,
    // isMobile: false,
    // isAutoLogging: false,
    // isOnboardingBannerClosed: false,
    firstUserPostId: null,
  };

  state = {
    items: this.generateItemsList(),
    // pageYOffsetForOnboardingAppBanner: 0,
    // isOnboardingAppBannerShowed: false,
  };

  componentDidMount() {
    const { fetchError /* isMobile */ } = this.props;

    if (fetchError) {
      this.fetchPostsSafe();
    }

    // if (isMobile) {
    //   this.updatePageHeight();
    //   window.addEventListener('resize', this.updatePageHeight);
    //   window.addEventListener('scroll', this.checkPageYOffset);
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { order, rewardsArr, loggedUserId, isOneColumnMode } = this.props;

    if (
      order !== nextProps.order ||
      (rewardsArr !== nextProps.rewardsArr && rewardsArr.length !== nextProps.rewardsArr.length) ||
      loggedUserId !== nextProps.loggedUserId ||
      isOneColumnMode !== nextProps.isOneColumnMode
    ) {
      this.setState({
        items: this.generateItemsList(nextProps),
      });
    }
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updatePageHeight);
  //   window.removeEventListener('scroll', this.checkPageYOffset);

  //   this.updatePageHeight.cancel();
  //   this.checkPageYOffset.cancel();
  // }

  // updatePageHeight = throttle(() => {
  //   const { isMobile } = this.props;
  //   const { isOnboardingAppBannerShowed, pageYOffsetForOnboardingAppBanner } = this.state;

  //   if (isMobile && !isOnboardingAppBannerShowed) {
  //     const necessaryScrollStep = window.innerHeight * 2;

  //     if (!pageYOffsetForOnboardingAppBanner) {
  //       this.setState({
  //         pageYOffsetForOnboardingAppBanner: necessaryScrollStep,
  //       });
  //     }
  //   }
  // }, 200);

  // checkPageYOffset = throttle(() => {
  //   const {
  //     isMobile,
  //     openAppBannerModal,
  //     loggedUserId,
  //     isAutoLogging,
  //     isOnboardingBannerClosed,
  //     router,
  //   } = this.props;
  //   const { isOnboardingAppBannerShowed, pageYOffsetForOnboardingAppBanner } = this.state;

  //   const isHome = router.route === '/home' || router.route === '/feed';

  //   if (isHome && !isOnboardingBannerClosed) {
  //     return;
  //   }

  //   if (
  //     isMobile &&
  //     !loggedUserId &&
  //     !isAutoLogging &&
  //     !isOnboardingAppBannerShowed &&
  //     pageYOffsetForOnboardingAppBanner &&
  //     window.pageYOffset >= pageYOffsetForOnboardingAppBanner
  //   ) {
  //     this.setState(
  //       {
  //         isOnboardingAppBannerShowed: true,
  //       },
  //       openAppBannerModal
  //     );
  //   }
  // }, 200);

  checkLoadMore = () => {
    const { isAllowLoadMore, queryParams, nextOffset } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    this.fetchPostsSafe({
      ...queryParams,
      offset: nextOffset,
    });
  };

  onRetryClick = () => {
    this.fetchPostsSafe();
  };

  fetchPostsSafe(params) {
    const { queryParams, fetchPosts } = this.props;

    fetchPosts(params || queryParams).catch(err => {
      displayError(err);
    });
  }

  // this method need for generating feed's className for test
  getFeedClassName() {
    const { router } = this.props;
    const { query } = router;

    let feedType;
    let feedSubType;
    let feedSubTypeKey = 'feedSubType';

    switch (true) {
      case Boolean(query?.communityAlias): {
        feedSubTypeKey = 'subSection';
        feedType = 'community';
        break;
      }

      default: {
        feedType = 'my';

        if (query?.feedType) {
          ({ feedType } = query);
        }

        feedSubType = feedType === 'my' ? 'new' : 'hot';
        break;
      }
    }

    if (query?.[feedSubTypeKey]) {
      feedSubType = query[feedSubTypeKey];
    }

    if (!feedType || !feedSubType) {
      return null;
    }

    return `feed__${feedType}-${FEED_TYPE[feedSubType]}`;
  }

  getRewardTooltipPositions(order, rewardsArr) {
    const rewardTooltipPostions = [];

    if (!rewardsArr.length) {
      return [];
    }

    for (let i = 3; i < order.length; i++) {
      if (rewardsArr.includes(order[i])) {
        rewardTooltipPostions.push(i);
        i += 39;
      }
    }

    return rewardTooltipPostions;
  }

  getTooltipType(index, rewardTooltipPostions) {
    const commentTooltipPositions = [];
    const likeTooltipPositions = [];

    for (const item of rewardTooltipPostions) {
      const newItem = item + 7;

      commentTooltipPositions.push(newItem);
      likeTooltipPositions.push(newItem + 7);
    }

    switch (true) {
      case rewardTooltipPostions.includes(index):
        return FEED_ONBOARDING_TOOLTIP_TYPE.REWARD;

      case commentTooltipPositions.includes(index):
        return FEED_ONBOARDING_TOOLTIP_TYPE.COMMENTS;

      case likeTooltipPositions.includes(index):
        return FEED_ONBOARDING_TOOLTIP_TYPE.VOTE;

      default:
        break;
    }

    return null;
  }

  generateItemsList(props = this.props) {
    const {
      order,
      rewardsArr,
      firstUserPostId,
      // isOneColumnMode
    } = props;

    const items = [];
    const rewardTooltipPostions = this.getRewardTooltipPositions(order, rewardsArr);

    for (let i = 0; i < order.length; i += 1) {
      const id = order[i];

      // if ((i + 3) % 5 === 0) {
      //   items.push({
      //     key: `${id}:ref`,
      //     type: 'ref',
      //   });
      // }
      //
      // if ((i + 2) % 7 === 0) {
      //   items.push({
      //     key: `${id}:reg`,
      //     type: 'reg',
      //   });
      // }
      //
      // if (isOneColumnMode && (i + 1) % 6 === 0) {
      //   items.push({
      //     key: `${id}:trend`,
      //     type: 'trend',
      //   });
      // }

      items.push({
        key: id,
        type: 'post',
        id,
        tooltipType: this.getTooltipType(i, rewardTooltipPostions),
        isAllowToShowShareTooltip: firstUserPostId === id,
      });
    }

    return items;
  }

  renderEmpty() {
    const { isOwner } = this.props;

    if (isOwner) {
      return <EmptyList headerText="No posts" subText="You haven't made any posts yet" />;
    }

    return <EmptyList headerText="No posts" />;
  }

  render() {
    const { loggedUserId, fetchError, isLoading, isAllowLoadMore, isShowReports } = this.props;
    const { items } = this.state;

    if (items.length === 0) {
      if (fetchError) {
        return (
          <ErrorBlock>
            <ErrorMessage>{fetchError.message}</ErrorMessage>
            {isAllowLoadMore ? <Retry onClick={this.onRetryClick}>Retry</Retry> : null}
          </ErrorBlock>
        );
      }

      return <EmptyBlock>{this.renderEmpty()}</EmptyBlock>;
    }

    const components = items.map(({ key, type, id, tooltipType, isAllowToShowShareTooltip }) => {
      switch (type) {
        case 'ref':
          return <CTAReferralProgram key={key} />;
        case 'reg':
          return <CTARegistration key={key} />;
        case 'trend':
          return <TrendingCommunitiesWidget key={key} />;
        case 'post':
          return id ? (
            <PostCard
              key={key}
              postId={id}
              loggedUserId={loggedUserId}
              isShowReports={isShowReports}
              tooltipType={tooltipType}
              isAllowToShowShareTooltip={isAllowToShowShareTooltip}
            />
          ) : null;
        default:
          throw new Error('Invariant');
      }
    });

    return (
      <InfinityScrollHelper
        disabled={!isAllowLoadMore}
        onNeedLoadMore={this.checkLoadMore}
        className={this.getFeedClassName()}
      >
        {components}
        {isLoading ? <LoaderStyled /> : null}
      </InfinityScrollHelper>
    );
  }
}
