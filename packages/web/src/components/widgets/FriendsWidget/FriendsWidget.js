import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { WidgetCard, WidgetHeader } from 'components/widgets/common';
import Avatar from 'components/common/Avatar';

const FriendsRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 4px;
`;

const AvatarStyled = styled(Avatar)`
  width: 34px;
  height: 34px;
  border: 2px solid #ffffff;

  margin-right: -8px;
`;

const FriendsWidget = ({ items }) => (
  <WidgetCard>
    <WidgetHeader
      title="Friends"
      count={items.length}
      right={
        <FriendsRow>
          {items.map(userId => (
            <AvatarStyled key={userId} userId={userId} useLink />
          ))}
        </FriendsRow>
      }
    />
  </WidgetCard>
);

FriendsWidget.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()),
};

FriendsWidget.defaultProps = {
  items: [],
};

export default FriendsWidget;
