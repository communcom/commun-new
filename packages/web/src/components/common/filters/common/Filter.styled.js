import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;

  ${up.mobileLandscape} {
    border-radius: 6px;
  }

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export const Description = styled.span`
  && {
    margin-right: 16px;
  }
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const Filter = styled.button`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 6px;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

export const ChevronIcon = styled(Icon).attrs({ name: 'triangle' })`
  width: 8px;
  height: 5px;
  margin-left: 7px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const MenuLink = styled.a`
  display: block;
  padding: 10px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  background-color: #fff;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }

  ${is('isActive')`
    color: ${({ theme, isCommunity }) =>
      isCommunity ? theme.colors.community : theme.colors.blue};

  `};
`;
