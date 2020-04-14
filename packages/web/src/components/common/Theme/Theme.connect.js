import { connect } from 'react-redux';

import { isDarkThemeSelector } from 'store/selectors/settings';

import Theme from './Theme';

export default connect(state => ({
  isDark: isDarkThemeSelector(state),
}))(Theme);
