import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { setScreenId } from 'store/actions/local/registration';

import Oauth from './Oauth';

export default connect(
  state => {
    const unauthState = dataSelector('unauth')(state);

    return {
      unauthState,
    };
  },
  {
    setScreenId,
  }
)(Oauth);
