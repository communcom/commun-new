import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { formatContentId } from 'store/schemas/gate';
import { fetchEntityReports } from 'store/actions/gate';
import { statusSelector } from 'store/selectors/common';

import ReportList from './ReportList';

export default connect(
  createSelector(
    [(state, props) => statusSelector(['reports', formatContentId(props.post.contentId)])(state)],
    statusReports => ({
      order: statusReports?.order || [],
      isLoading: statusReports?.isLoading || false,
      isEnd: statusReports?.isEnd || false,
    })
  ),
  {
    fetchEntityReports,
  }
)(ReportList);
