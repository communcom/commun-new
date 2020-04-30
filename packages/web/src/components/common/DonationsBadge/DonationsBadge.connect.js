import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import DonationsBadge from './DonationsBadge';

export default connect((state, props) => ({
  donations: entitySelector('donations', props.postId)(state) || {},
}))(DonationsBadge);
