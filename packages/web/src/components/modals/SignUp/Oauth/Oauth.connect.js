import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { setScreenId } from 'store/actions/local/registration';

import Oauth from './Oauth';

export default connect(
  state => {
    const pendingCommunities = dataSelector(['unauth', 'communities'])(state);

    return {
      pendingCommunities,
    };
  },
  {
    setScreenId,
  }
)(Oauth);
