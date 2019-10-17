import styled from 'styled-components';

export default styled.button.attrs({ type: 'button' })`
  height: 38px;
  padding: 0 15px;
  border-radius: 38px;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
  color: #fff;
  background: ${({ theme }) => theme.colors.contextBlue};
`;
