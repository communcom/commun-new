import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.a`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};
`;

export default forwardRef((props, ref) => (
  <Wrapper {...props} ref={ref}>
    see all
  </Wrapper>
));
