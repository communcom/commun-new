import styled from 'styled-components';
import is from 'styled-is';

export default styled.button.attrs({ type: 'button' })`
  height: 30px;
  padding: 0 17px;
  border-radius: 38px;
  line-height: 1;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.6px;
  white-space: nowrap;
  color: #fff;
  background: ${({ theme }) => theme.colors.contextBlue};

  ${is('gray')`
    background: ${({ theme }) => theme.colors.contextGrey};
  `};
`;
