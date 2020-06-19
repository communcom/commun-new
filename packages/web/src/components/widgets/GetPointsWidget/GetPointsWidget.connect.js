import React from 'react';
import { connect } from 'react-redux';

import { checkAuth } from 'store/actions/complex';
import { openModalConvertPoint } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';
import { userPointSelector } from 'store/selectors/wallet';

import GetPointsMobile from './GetPointsMobile';
import GetPointsWidget from './GetPointsWidget';

export default connect(
  (state, { communityId }) => {
    const community = entitySelector('communities', communityId)(state);
    const { balance } = userPointSelector(communityId)(state) || {};

    return {
      isDesktop: screenTypeUp.desktop(state),
      communityName: community.name,
      symbol: community.id,
      balance: balance || '0',
    };
  },
  {
    checkAuth,
    openModalConvertPoint,
  }
)(({ isDesktop, ...props }) =>
  !isDesktop ? <GetPointsMobile {...props} /> : <GetPointsWidget {...props} />
);
