import { connect } from 'react-redux';

import { getEmbed } from 'store/actions/gate';
import { isDarkThemeSelector } from 'store/selectors/settings';

import Editor from './Editor';

export default connect(
  state => ({
    isDark: isDarkThemeSelector(state),
  }),
  { getEmbed },
  null,
  {
    forwardRef: true,
  }
)(Editor);
