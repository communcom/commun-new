import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Link } from 'shared/routes';

const Wrapper = styled.nav`
  ${is('isPanel')`
    padding: 5px 0;
    border-radius: 6px;
    background-color: #fff;
  `};
`;

const List = styled.ul`
  ${is('isRow')`
    display: flex;
    padding-bottom: 9px;
    overflow: hidden;
    overflow-x: auto;
  `};
`;

const Item = styled.li`
  ${is('isRow')`
    &:not(:last-child) {
      margin-right: 5px;
    }
  `};
`;

const LineLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 15px;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  cursor: pointer;

  ${is('active')`
    color: ${({ theme }) => theme.colors.blue};

    &::after {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      width: 2px;
      height: 15px;
      margin-top: -7px;
      border-radius: 1px;
      background-color: ${({ theme }) => theme.colors.blue};
    }
  `};
`;

const TagLink = styled.a`
  display: block;
  height: 34px;
  line-height: 32px;
  padding: 0 15px;
  border-radius: 17px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  color: #000;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('active')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
  `};
`;

export default function SideBarNavigation({ className, currentId, items, isRow }) {
  const ItemComponent = isRow ? TagLink : LineLink;

  return (
    <Wrapper className={className} isPanel={!isRow}>
      <List isRow={isRow}>
        {items.map(({ id, title, route, params }) => (
          <Item key={title} isRow={isRow}>
            <Link route={route} params={params} passHref>
              <ItemComponent active={currentId && currentId === id}>{title}</ItemComponent>
            </Link>
          </Item>
        ))}
      </List>
    </Wrapper>
  );
}

SideBarNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      params: PropTypes.object,
    })
  ).isRequired,
  currentId: PropTypes.string,
  isRow: PropTypes.bool,
};

SideBarNavigation.defaultProps = {
  isRow: false,
  currentId: undefined,
};
