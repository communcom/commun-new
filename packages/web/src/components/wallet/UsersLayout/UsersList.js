import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@commun/ui';

const Wrapper = styled(List)`
  margin-bottom: 8px;
  padding: 15px 0;
`;

const PointsItem = styled(ListItem)`
  margin-bottom: 2px;

  font-size: 14px;

  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:first-child {
    border-radius: 10px 10px 0 0;
  }
`;

const UsersList = ({ className, items, itemClickHandler }) => (
  <Wrapper className={className}>
    {items.map(({ userId, username, avatarUrl }) => (
      <PointsItem key={userId} onItemClick={() => itemClickHandler(userId)}>
        <ListItemAvatar>
          <Avatar size="medium" avatarUrl={avatarUrl} name={username} />
        </ListItemAvatar>
        <ListItemText primary={username} primaryBold />
      </PointsItem>
    ))}
  </Wrapper>
);

UsersList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  itemClickHandler: PropTypes.func,
};

UsersList.defaultProps = {
  items: [],
  itemClickHandler: undefined,
};

export default UsersList;
