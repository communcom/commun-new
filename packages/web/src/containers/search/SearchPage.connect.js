import { connect } from 'react-redux';

import { extendedSearch } from 'store/actions/gate';
import { screenTypeUp } from 'store/selectors/ui';

import SearchPage from './SearchPage';

export default connect(
  state => ({
    isDesktop: screenTypeUp.desktop(state),
    isMobile: !screenTypeUp.tablet(state),
  }),
  {
    extendedSearch,
  }
)(SearchPage);
