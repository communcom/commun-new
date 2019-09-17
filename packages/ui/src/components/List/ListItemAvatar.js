import React from 'react';
import styled from 'styled-components';

const AvatarWrapper = styled.div`
  display: flex;
  margin-right: 16px;
`;

const ListItemAvatar = ({ className, children }) => (
  <AvatarWrapper className={className}>{children}</AvatarWrapper>
);

export default ListItemAvatar;
