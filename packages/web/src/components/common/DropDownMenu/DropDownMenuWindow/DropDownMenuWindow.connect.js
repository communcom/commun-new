import { connect } from 'react-redux';

import { isDarkThemeSelector } from 'store/selectors/settings';

import DropDownMenuWindow from './DropDownMenuWindow';

export default connect(state => ({ isDark: isDarkThemeSelector(state) }))(DropDownMenuWindow);
