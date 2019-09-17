import React from 'react';
import styled from 'styled-components';

const List = styled.ul`
  margin: 0;
  width: 100%;
`;

const ListComponent = ({ className, children }) => <List className={className}>{children}</List>;

export default ListComponent;
