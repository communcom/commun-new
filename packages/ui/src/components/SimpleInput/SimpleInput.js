import styled from 'styled-components';

export default styled.input`
  padding: 18px 16px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.lightGray};
    background-color: #fff;
  }
`;
