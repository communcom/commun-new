import styled from 'styled-components';

export default styled.button.attrs({ type: 'button' })`
  height: 30px;
  padding: 0 17px;
  border-radius: 38px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.6px;
  white-space: nowrap;
  color: #fff;
  background: ${({ theme }) => theme.colors.contextBlue};
`;
