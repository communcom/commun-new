import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

export const Items = styled.ul``;

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 6px 0;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.blue};
`;

export const ItemBodyWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-height: 68px;
  margin-left: 16px;
`;

export const ItemBody = styled.div``;

export const ItemValues = styled.div`
  margin-left: 16px;
`;

export const ItemLine = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isValue')`
    text-align: right;
  `};

  &:first-child {
    margin-top: 0;
    font-size: 17px;
    font-weight: bold;
    color: #000;
  }
`;

export const Currency = styled.span`
  ${up.tablet} {
    &::after {
      content: ' points';
    }
  }
`;

export const Value = styled.span`
  ${is('isNegative')`
    color: ${({ theme }) => theme.colors.gray};
  `};
`;

export const ItemLink = styled.a`
  color: inherit;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
    transition: color 0.15s;
  }
`;
