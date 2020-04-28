import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';

import DonateTooltip from './DonateTooltip';

export default connect(null, { openModal })(DonateTooltip);
