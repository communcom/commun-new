import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { clearRegErrors } from 'store/actions/registration/registration';
import { regDataSelector } from 'store/selectors/registration';

import ConfirmPassword from './ConfirmPassword';

export default connect(
  createSelector([regDataSelector], ({ wishPassword }) => ({
    wishPassword,
  })),
  {
    clearRegErrors,
  }
)(ConfirmPassword);
