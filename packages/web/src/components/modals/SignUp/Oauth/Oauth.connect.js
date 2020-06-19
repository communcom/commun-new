import { connect } from 'react-redux';

import { setScreenId } from 'store/actions/local/registration';
import { dataSelector } from 'store/selectors/common';

import Oauth from './Oauth';

export default connect(
  state => {
    const unauthState = dataSelector('unauth')(state);
    const referralId = dataSelector(['auth', 'refId'])(state);

    return {
      unauthState,
      referralId,
    };
  },
  {
    setScreenId,
  }
)(Oauth);
