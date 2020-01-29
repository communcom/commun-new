import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import activeLink from 'utils/hocs/activeLink';

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
    padding-bottom: 5px;
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

const LineLink = activeLink(styled.a`
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
`);

const TagLink = activeLink(styled.a`
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
`);

export default function SideBarNavigation({ className, items, isRow }) {
  return (
    <Wrapper className={className} isPanel={!isRow}>
      <List isRow={isRow}>
        {items.map(({ title, route, params }) => (
          <Item key={title} isRow={isRow}>
            {isRow ? (
              <TagLink route={route} params={params}>
                {title}
              </TagLink>
            ) : (
              <LineLink route={route} params={params}>
                {title}
              </LineLink>
            )}
          </Item>
        ))}
      </List>
    </Wrapper>
  );
}

SideBarNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      params: PropTypes.object,
    })
  ).isRequired,
  isRow: PropTypes.bool,
};

SideBarNavigation.defaultProps = {
  isRow: false,
};
