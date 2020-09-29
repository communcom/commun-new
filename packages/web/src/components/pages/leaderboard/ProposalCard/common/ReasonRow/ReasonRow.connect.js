import { connect } from 'react-redux';

import { isDarkThemeSelector } from 'store/selectors/settings';

import ReasonRow from './ReasonRow';

export default connect(state => ({
  isDark: isDarkThemeSelector(state),
}))(ReasonRow);
