import React from 'react';
import { connect } from 'react-redux';

import { isWebViewSelector } from 'store/selectors/common';
import { isDarkThemeSelector } from 'store/selectors/settings';

import CookiesPermission from './CookiesPermission';

export default connect(state => ({
  isDark: isDarkThemeSelector(state),
  isWebView: isWebViewSelector(state),
}))(({ isWebView, ...props }) => (isWebView ? null : <CookiesPermission {...props} />));
