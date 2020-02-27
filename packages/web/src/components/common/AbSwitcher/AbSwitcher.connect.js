import { connect } from 'react-redux';

import { checkAb } from 'utils/abTesting';

import AbSwitcher from './AbSwitcher';

export default connect((state, props) => {
  const { clientId } = state.ui.abTesting;

  return {
    abValue: checkAb(props.test, clientId),
  };
})(AbSwitcher);
