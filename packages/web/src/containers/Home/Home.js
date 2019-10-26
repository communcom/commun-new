import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { statusSelector } from 'store/selectors/common';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import Content from 'components/common/Content';
import PostList from 'components/common/PostList';
import { TrendingCommunitiesWidget } from 'components/widgets';
import Footer from 'components/common/Footer';
import FeedFiltersPanel from 'components/common/FeedFiltersPanel';
import InlineEditorSlot from 'components/common/InlineEditorSlot';
import WhatsNewOpener from 'components/common/WhatsNew';
// import Advertisement, { HOME_PAGE_ADV_ID } from 'components/common/Advertisement';

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

const FooterStyled = styled(Footer)`
  padding-bottom: 20px;
`;

export default class Home extends Component {
  static async getInitialProps(params) {
    const { store } = params;
    const { filter } = statusSelector('feed')(store.getState());

    const [postListProps] = await Promise.all([
      PostList.getInitialProps({
        store,
        params: filter,
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
        <WhatsNewOpener />
        <FeedFiltersPanel params={postListProps.queryParams} />
        <PostList {...postListProps} />
      </Content>
    );
  }
}
