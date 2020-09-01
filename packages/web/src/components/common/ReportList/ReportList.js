import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedCommentType, extendedPostType } from 'types';
import { captureException } from 'utils/errors';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ReportRow from 'components/common/ReportRow';

const Wrapper = styled.div`
  padding: 0 15px 10px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export default class ReportList extends Component {
  static propTypes = {
    entity: PropTypes.oneOfType([extendedPostType, extendedCommentType]).isRequired,
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
    const { entity, order, fetchEntityReports } = this.props;

    const params = {
      communityId: entity.contentId.communityId,
      userId: entity.contentId.userId,
      permlink: entity.contentId.permlink,
    };

    if (isPaging) {
      params.offset = order.length;
    }

    try {
      await fetchEntityReports(params);
    } catch (err) {
      captureException(err, 'Reports fetching failed:');
    }
  }

  renderItems() {
    const { order } = this.props;

    return order.map((reportId, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ReportRow reportId={reportId} key={`${reportId}-${index}`} />
    ));
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
