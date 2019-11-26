import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, TileGrid, TileLogo, Glyph } from '@commun/ui';

const Wrapper = styled(TileGrid)`
  padding: 10px;

  overflow-x: scroll;
`;

const UsersGrid = ({ className, items, itemClickHandler }) => (
  <Wrapper className={className}>
    <TileLogo
      key="add-friend"
      text="Add friend"
      size="medium"
      logo={<Glyph icon="add" size="medium" />}
      onItemClick={() => itemClickHandler('add-friend')}
    />

    {items.map(user => (
      <TileLogo
        key={user.userId}
        text={user.username}
        size="medium"
        logo={<Avatar avatarUrl={user.avatarUrl} name={user.username} />}
        onItemClick={() => itemClickHandler(user)}
      />
    ))}
  </Wrapper>
);

UsersGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  itemClickHandler: PropTypes.func,
};

UsersGrid.defaultProps = {
  items: [],
  itemClickHandler: undefined,
};

export default UsersGrid;
