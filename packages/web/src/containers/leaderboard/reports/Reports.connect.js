import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { compose } from 'redux';

import { ReportsSubTab } from 'shared/constants';
import { fetchReportsList } from 'store/actions/gate';
import { compareSelectedCommunities } from 'store/actions/select';
import { statusLeaderBoardSelector, uiSelector } from 'store/selectors/common';

import Reports from './Reports';

export default compose(
  withRouter,
  connect(
    (state, props) => {
      const {
        query: { subSection },
      } = props.router;
      const isComments = subSection && subSection === ReportsSubTab.COMMENTS;
      const { order, isLoading, isEnd } = statusLeaderBoardSelector(
        isComments ? 'commentsReports' : 'reports'
      )(state);
      const selectedCommunities = uiSelector(['leaderBoard', 'selectedCommunities'])(state);

      return {
        order,
        isLoading,
        isEnd,
        isComments,
        selectedCommunities,
      };
    },
    {
      fetchReportsList,
      compareSelectedCommunities,
    }
  )
)(Reports);
