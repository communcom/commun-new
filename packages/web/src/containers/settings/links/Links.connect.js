import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';

import SocialsPage from '../common/SocialsPage';

export default connect(
  createSelector([(state, props) => entitySelector('profiles', props.userId)(state)], profile => ({
    profile,
  }))
)(SocialsPage);
