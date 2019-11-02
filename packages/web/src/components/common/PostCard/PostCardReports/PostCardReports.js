import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType } from 'types';

import CardFooterDecision from 'components/leaderBoard/CardFooterDecision';
import AsyncButton from 'components/common/AsyncButton';
import ReportList from 'components/common/ReportList';

const Wrapper = styled.div``;

export default class PostCardReports extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,

    voteBan: PropTypes.func.isRequired,
  };

  onAcceptClick = async () => {
    const { post, voteBan } = this.props;

    await voteBan({
      communityId: post.community.communityId,
      contentId: post.contentId,
    });
  };

  render() {
    const { post } = this.props;

    return (
      <Wrapper>
        <ReportList post={post} />
        <CardFooterDecision
          title="Reports"
          text={`${post.reports?.reportsCount || 0}`}
          actions={() => (
            <>
              <AsyncButton onClick={this.onAcceptClick}>Ban</AsyncButton>
            </>
          )}
        />
      </Wrapper>
    );
  }
}
