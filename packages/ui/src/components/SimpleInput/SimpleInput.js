import styled from 'styled-components';

export default styled.input`
  padding: 18px 16px;
  border: 1px solid ${({ theme }) => theme.colors.contextWhite};
  background-color: ${({ theme }) => theme.colors.contextWhite};
  border-radius: 8px;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.contextLightGrey};
    background-color: #fff;
  }
`;
