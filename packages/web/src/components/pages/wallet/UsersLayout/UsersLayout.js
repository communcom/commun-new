import React from 'react';
import PropTypes from 'prop-types';

import UsersGrid from './UsersGrid';
import UsersList from './UsersList';

const LAYOUTS = {
  grid: UsersGrid,
  list: UsersList,
};

const UsersLayout = ({ layoutType, ...rest }) => {
  const Layout = LAYOUTS[layoutType];

  return <Layout {...rest} />;
};

UsersLayout.propTypes = {
  layoutType: PropTypes.oneOf(Object.keys(LAYOUTS)),
};

UsersLayout.defaultProps = {
  layoutType: 'grid',
};

export default UsersLayout;
