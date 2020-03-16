import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { setWishPassword, clearRegErrors } from 'store/actions/registration';
import { regDataSelector } from 'store/selectors/registration';

import CreatePassword from './CreatePassword';

export default connect(
  createSelector([regDataSelector], ({ wishPassword }) => ({
    wishPassword,
  })),
  {
    setWishPassword,
    clearRegErrors,
  }
)(CreatePassword);
