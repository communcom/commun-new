import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_MEMBERS_WIDGET } from 'shared/featureFlags';
import { entitySelector, entityArraySelector, statusWidgetSelector } from 'store/selectors/common';
import { getCommunityMembersWidget } from 'store/actions/gate';

import MembersWidget from './MembersWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_MEMBERS_WIDGET }),
  connect(
    (state, props) => {
      const community = entitySelector('communities', props.communityId)(state);
      const { communityId, order, isLoading, isLoaded } = statusWidgetSelector('communityMembers')(
        state
      );

      if (props.communityId !== communityId) {
        return {
          community,
          items: [],
          isLoading: false,
          isLoaded: false,
        };
      }

      return {
        community,
        items: entityArraySelector('users', order)(state),
        isLoading,
        isLoaded,
      };
    },
    {
      getCommunityMembersWidget,
    }
  )
)(MembersWidget);
