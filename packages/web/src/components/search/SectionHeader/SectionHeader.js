import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { Link } from 'shared/routes';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 5px;
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

export default function SectionHeader({ title, type, q, className }) {
  return (
    <Wrapper className={className}>
      <SectionTitle>{title}</SectionTitle>
      {type ? (
        <Link route="search" params={{ q, type }} passHref>
          <SeeAll>see all</SeeAll>
        </Link>
      ) : null}
    </Wrapper>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  q: PropTypes.string,
};

SectionHeader.defaultProps = {
  type: null,
  q: null,
};
