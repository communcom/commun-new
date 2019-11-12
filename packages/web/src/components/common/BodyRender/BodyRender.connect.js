import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import BodyRender from './BodyRender';

export default connect((state, props) => {
  let { cutLimits } = props;

  if (props.mobileCutLimits) {
    const screenType = uiSelector(['mode', 'screenType'])(state);

    if (screenType === 'mobile' || screenType === 'mobileLandscape') {
      cutLimits = props.mobileCutLimits;
    }
  }

  return {
    cutLimits,
  };
})(BodyRender);
