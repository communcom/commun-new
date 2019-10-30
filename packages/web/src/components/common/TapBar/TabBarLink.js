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

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const MenuLink = activeLink(MenuItem);

export default function TabBarLink({ route, icon, desc, params }) {
  return (
    <MenuLink route={route} params={params}>
      <IconStyled name={icon} />
      <InvisibleText>{desc}</InvisibleText>
    </MenuLink>
  );
}

TabBarLink.propTypes = {
  route: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
};

TabBarLink.defaultProps = {
  params: {},
};
