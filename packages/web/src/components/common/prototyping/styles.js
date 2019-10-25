/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 8px 10px;

  line-height: 20px;
  color: #000;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
  }
`;

export const Row = styled.div`
  display: flex;
`;

export const Button = styled.button`
  padding: 18px;
  margin-top: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.contextBlue};

  line-height: 20px;
  font-size: 17px;
  text-align: center;
  opacity: 1;

  color: #ffffff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextBlue};
    opacity: 0.8;
  }
`;
