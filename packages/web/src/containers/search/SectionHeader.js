import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { Link } from 'shared/routes';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 15px;
  background-color: #fff;
`;

const SectionTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const SeeAll = styled.a`
  display: block;
  padding: 8px;
  margin: -8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;

  ${up.desktop} {
    padding: 4px;
    margin: -4px;
  }
`;

export default function SectionHeader({ q, title, type }) {
  return (
    <Wrapper>
      <SectionTitle>{title}</SectionTitle>
      <Link route="search" params={{ q, type }} passHref>
        <SeeAll>see all</SeeAll>
      </Link>
    </Wrapper>
  );
}

SectionHeader.propTypes = {
  q: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

SectionHeader.defaultProps = {
  q: null,
};
