import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'components/Avatar';
import ListItem from './ListItem';
import ListItemAvatar from './ListItemAvatar';
import ListItemText from './ListItemText';

const CommunityItem = ({
  className,
  size,
  avatarUrl,
  primary,
  primaryBold,
  secondary,
  onItemClick,
}) => (
  <ListItem className={className} size={size} onItemClick={onItemClick}>
    <ListItemAvatar>
      <Avatar size={size} avatarUrl={avatarUrl} name={primary} />
    </ListItemAvatar>
    <ListItemText primaryBold={primaryBold} primary={primary} secondary={secondary} />
  </ListItem>
);

CommunityItem.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  avatarUrl: PropTypes.string,
  primaryBold: PropTypes.bool,
  primary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  secondary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onItemClick: PropTypes.func,
};

CommunityItem.defaultProps = {
  size: 'medium',
  avatarUrl: null,
  primaryBold: true,
  secondary: null,
  onItemClick: undefined,
};

export default CommunityItem;
