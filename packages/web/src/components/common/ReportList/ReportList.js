import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType } from 'types';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ReportRow from 'components/common/ReportRow';

const Wrapper = styled.div`
  padding: 0 15px 10px;
`;

export default class ReportList extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,

    fetchEntityReports: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchData();
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { post, order, fetchEntityReports } = this.props;

    const params = {
      communityId: post.contentId.communityId,
      userId: post.contentId.userId,
      permlink: post.contentId.permlink,
    };

    if (isPaging) {
      params.offset = order.length;
    }

    try {
      await fetchEntityReports(params);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Reports fetching failed:', err);
    }
  }

  renderItems() {
    const { order } = this.props;

    return order.map(reportId => <ReportRow reportId={reportId} key={reportId} />);
  }

  render() {
    const { order, isLoading, isEnd } = this.props;

    if (!order) {
      return null;
    }

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
