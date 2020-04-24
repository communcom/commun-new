import styled from 'styled-components';

export default styled.input`
  padding: 18px 16px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  color: ${({ theme }) => theme.colors.black};
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.lightGray};
    background-color: ${({ theme }) => theme.colors.white};
  }
`;
