import styled from 'styled-components';

import { Card, Search, up } from '@commun/ui';

export const Wrapper = styled(Card)`
  padding: 12px 10px 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    padding: 0 15px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px 10px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  & > :not(:last-child) {
    margin-right: 9px;
  }

  ${up.tablet} {
    padding: 0;
    margin-bottom: 0;
    background-color: unset;
    border-radius: 0;
  }
`;

export const Items = styled.ul`
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }

  ${up.tablet} {
    padding-top: 20px;
    border-radius: 0;

    & > :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

export const SearchStyled = styled(Search)`
  flex-grow: 1;

  & input {
    &,
    &::placeholder {
      font-size: 15px;
      line-height: 20px;
    }
  }
`;
