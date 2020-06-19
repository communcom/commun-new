import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

import EmptyList from 'components/common/EmptyList/EmptyList';

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

const UsersList = ({ className, items, itemClickHandler }) => {
  const { t } = useTranslation();

  return (
    <Wrapper className={className}>
      {!items.length ? (
        <EmptyList
          headerText={t('components.wallet.users_layout.no_found')}
          subText={t('components.wallet.users_layout.no_found_desc')}
        />
      ) : null}
      {items.map(user => (
        <PointsItem key={user.userId} onItemClick={() => itemClickHandler(user)}>
          <ListItemAvatar>
            <Avatar size="medium" avatarUrl={user.avatarUrl} name={user.username} />
          </ListItemAvatar>
          <ListItemText primary={user.username} primaryBold />
        </PointsItem>
      ))}
    </Wrapper>
  );
};

UsersList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  itemClickHandler: PropTypes.func,
};

UsersList.defaultProps = {
  items: [],
  itemClickHandler: undefined,
};

export default UsersList;
