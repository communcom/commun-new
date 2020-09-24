import React from 'react';
import { connect } from 'react-redux';

import Members from '../../../common/Members';

export default connect()(props => <Members isLeaderboard {...props} />);
