import { connect } from 'react-redux';

import { fetchRegFirstStepEmail } from 'store/actions/gate/registration';
import { setScreenId } from 'store/actions/local/registration';
import { dataSelector } from 'store/selectors/common';

import Email from './Email';

export default connect(
  state => {
    const referralId = dataSelector(['auth', 'refId'])(state);

    return {
      referralId,
    };
  },
  {
    setScreenId,
    fetchRegFirstStepEmail,
  }
)(Email);
