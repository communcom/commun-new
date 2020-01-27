import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Link } from 'shared/routes';
import { BaseAvatar } from 'components/common/Avatar';

import { extractLinkFromItem } from './common';

const Item = styled.li`
  ${is('isSelected')`
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const ItemContent = styled.a`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #000;
  cursor: pointer;
`;

const AvatarStyled = styled(BaseAvatar)`
  margin-right: 10px;
`;

const ItemText = styled.span`
  margin-top: -4px;
  font-size: 14px;
  font-weight: 600;
`;

export default function AutocompleteItem({ item, isSelected, ...props }) {
  const results = extractLinkFromItem(item);

  if (!results) {
    return null;
  }

  const { text, route, params } = results;

  return (
    <Item isSelected={isSelected} {...props}>
      <Link route={route} params={params} passHref>
        <ItemContent>
          <AvatarStyled avatarUrl={item.avatarUrl} />
          <ItemText>{text}</ItemText>
        </ItemContent>
      </Link>
    </Item>
  );
}

AutocompleteItem.propTypes = {
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
