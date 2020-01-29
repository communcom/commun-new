import { connect } from 'react-redux';

import { screenTypeUp } from 'store/selectors/ui';
import { extendedSearch } from 'store/actions/gate';

import SearchPage from './SearchPage';

export default connect(
  state => ({
    isDesktop: screenTypeUp.desktop(state),
  }),
  {
    extendedSearch,
  }
)(SearchPage);
