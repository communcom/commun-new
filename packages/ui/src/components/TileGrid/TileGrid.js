import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.ul`
  display: flex;

  list-style: 'none';
`;

const TileList = ({ className, children }) => <Wrapper className={className}>{children}</Wrapper>;

export default TileList;
