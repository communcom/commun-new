import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchSetUser } from 'store/actions/gate/registration';
import { clearRegErrors, setWishUsername } from 'store/actions/local/registration';
import { statusSelector } from 'store/selectors/common';
import { regDataSelector } from 'store/selectors/registration';
import { retinaSuffixSelector } from 'store/selectors/ui';

import CreateUsername from './CreateUsername';

export default connect(
  createSelector(
    [statusSelector('registration'), regDataSelector, retinaSuffixSelector],
    ({ isLoadingSetUser, sendUserError }, { wishUsername }, retinaSuffix) => ({
      wishUsername,
      isLoadingSetUser,
      sendUserError,
      retinaSuffix,
    })
  ),
  {
    setWishUsername,
    fetchSetUser,
    clearRegErrors,
  }
)(CreateUsername);
