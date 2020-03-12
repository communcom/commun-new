import { connect } from 'react-redux';

import { setScreenId } from 'store/actions/registration';

import Oauth from './Oauth';

export default connect(null, {
  setScreenId,
})(Oauth);
