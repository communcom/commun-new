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

    {items.map(({ userId, username, avatarUrl }) => (
      <TileLogo
        key={userId}
        text={username}
        size="medium"
        logo={<Avatar avatarUrl={avatarUrl} name={username} />}
        onItemClick={() => itemClickHandler(userId)}
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
