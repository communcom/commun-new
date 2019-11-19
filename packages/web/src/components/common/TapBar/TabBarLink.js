import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { InvisibleText } from '@commun/ui';

import activeLink from 'utils/hocs/activeLink';

const MenuItem = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.gray};

  ${is('active')`
    color: #000;
  `};
`;

const IconStyled = styled(Icon)``;

const MenuLink = activeLink(MenuItem);

export default function TabBarLink({ route, icon, desc, onClick, ...rest }) {
  if (!route) {
    return (
      <MenuItem onClick={onClick}>
        <IconStyled {...icon} />
        <InvisibleText>{desc}</InvisibleText>
      </MenuItem>
    );
  }

  return (
    <MenuLink route={route} {...rest}>
      <IconStyled {...icon} />
      <InvisibleText>{desc}</InvisibleText>
    </MenuLink>
  );
}

TabBarLink.propTypes = {
  route: PropTypes.string,
  params: PropTypes.shape({}),
  icon: PropTypes.shape({}).isRequired,
  desc: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

TabBarLink.defaultProps = {
  route: undefined,
  params: {},
  onClick: undefined,
};
