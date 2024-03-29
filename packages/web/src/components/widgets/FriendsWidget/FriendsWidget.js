import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

import Avatar from 'components/common/Avatar';
import { WidgetCard, WidgetHeader } from 'components/widgets/common';

const FriendsRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 4px;
`;

const AvatarStyled = styled(Avatar)`
  width: 34px;
  height: 34px;
  border: 2px solid ${({ theme }) => theme.colors.white};

  margin-right: -8px;
`;

const FriendsWidget = ({ items, friendsCount }) => {
  const { t } = useTranslation();

  if (!friendsCount || !items.length) {
    return null;
  }

  return (
    <WidgetCard role="banner">
      <WidgetHeader
        title={t('widgets.friends.title', { count: friendsCount })}
        count={friendsCount}
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
};

FriendsWidget.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  friendsCount: PropTypes.number.isRequired,
};

FriendsWidget.defaultProps = {
  items: [],
};

export default FriendsWidget;
