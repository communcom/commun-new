import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_DESCRIPTION_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';

import Description from './Description';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    // TODO: should be removed when backend will be ready
    const MOCK_DESCRIPTION = `Cyclone Althea was a severe tropical cyclone that devastated parts of North Queensland just before Christmas during the 1971–72 Australian region cyclone season. The fourth system and second severe tropical cyclone of the season, Althea was one of the strongest storms ever to affect the Townsville area. After forming near the Solomon Islands on 19 December and heading southwest across the Coral Sea, the storm reached Category 4 on the Australian cyclone scale, peaking with 10-minute average maximum sustained winds of 165 km/h (105 mph). At 09:00 AEST on Christmas Eve, Althea struck the coast of Queensland near Rollingstone, about 50 km (30 mi) north of Townsville. While moving ashore, Althea generated wind gusts as high as 215 km/h (134 mph) that damaged thousands of homes and destroyed many. On nearby Magnetic Island almost all of the buildings were affected. Three people were killed, and damage totalled A$120 million.`;

    return {
      description: community?.description || MOCK_DESCRIPTION,
    };
  },
  {
    openRuleEditModal: ({ communityId, description }) =>
      openModal(SHOW_MODAL_DESCRIPTION_EDIT, { communityId, description }),
  }
)(Description);
