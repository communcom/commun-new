/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { up } from '@commun/ui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.mobileLandscape} {
    width: 350px;
  }
`;

export const Content = styled.div`
  padding: 15px;
`;
