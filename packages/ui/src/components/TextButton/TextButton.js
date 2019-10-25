import styled from 'styled-components';

export default styled.button.attrs({ type: 'button' })`
  height: 28px;
  padding: 0 10px;
  font-size: 15px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;
