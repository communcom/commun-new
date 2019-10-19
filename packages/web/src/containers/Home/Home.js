import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH, SIDE_BAR_MARGIN } from 'shared/constants';
import { HEADER_HEIGHT } from 'components/Header/constants';
import PostList from 'components/PostList';
import TrendingCommunities from 'components/TrendingCommunities';
import WhatsNewOpener from 'components/WhatsNew';
import Footer from 'components/Footer';
import FeedFiltersPanel from 'components/FeedFiltersPanel';
// import Advertisement, { HOME_PAGE_ADV_ID } from 'components/Advertisement';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const Left = styled.main`
  flex-grow: 1;
  min-width: 288px;
`;

const Right = styled.div`
  flex-shrink: 0;
  margin-left: ${SIDE_BAR_MARGIN}px;
`;

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

const Aside = styled.aside`
  display: block;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const FooterStyled = styled(Footer)`
  padding-bottom: 20px;
`;

export default class Home extends Component {
  static async getInitialProps({ store }) {
    const postListProps = await PostList.getInitialProps({
      store,
      params: {
        type: 'new',
      },
    });

    return {
      postListProps,
      namespacesRequired: [],
    };
  }

  static propTypes = {
    isOneColumnMode: PropTypes.bool.isRequired,
    postListProps: PropTypes.shape({}).isRequired,
  };

  render() {
    const { isOneColumnMode, postListProps } = this.props;

    return (
      <Wrapper>
        <Left>
          <WhatsNewOpener />
          <FeedFiltersPanel params={postListProps.queryParams} />
          <PostList {...postListProps} />
        </Left>
        {isOneColumnMode ? null : (
          <Right>
            <RightWrapper>
              <Sticky top={HEADER_HEIGHT + CONTAINER_DESKTOP_PADDING}>
                <Aside>
                  <TrendingCommunities />
                  {/* <Advertisement advId={HOME_PAGE_ADV_ID} /> */}
                  <FooterStyled />
                </Aside>
              </Sticky>
            </RightWrapper>
          </Right>
        )}
      </Wrapper>
    );
  }
}
