import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { animations, up } from '@commun/ui';

export const Control = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  cursor: pointer;
  user-select: none;

  ${is('disabled')`
    cursor: default;
  `};
`;

export const Stub = styled(Icon).attrs({ name: 'outline-dashed' })`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -1px;
`;

export const Name = styled.span`
  flex-grow: 1;
  margin: -1px 0 1px 10px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const OpenButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.gray};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

export const CloseButton = styled(OpenButton)`
  margin: 0 15px;

  ${up.mobileLandscape} {
    margin: 0 15px;
  }
`;

export const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  pointer-events: none;

  ${is('isDown')`
    transform: rotate(0.5turn);
  `};
`;

export const DropDownWrapper = styled.div`
  position: fixed;
  top: ${({ mobileTopOffset }) => mobileTopOffset}px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.white};
  animation: ${animations.fadeIn} 0.1s forwards;
  overflow: hidden;

  ${up.mobileLandscape} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: unset;
    border-radius: 10px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
`;

export const SearchBlock = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

export const SearchIcon = styled(Icon).attrs({ name: 'search' })`
  width: 20px;
  height: 20px;
  margin: 0 16px 0 19px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  margin: -1px 0 1px;
  line-height: 1;
  font-size: 14px;
  background: transparent;
  caret-color: ${({ theme }) => theme.colors.blue};

  &::placeholder {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

export const ListContainer = styled.div`
  padding-bottom: 10px;
`;

export const DropDownList = styled.ul`
  display: block;
  max-height: calc(100vh - 100px); /* 44px header, 44px chooser, 12px padding-bottom */
  overflow: auto;
  overflow-x: hidden;

  ${up.mobileLandscape} {
    max-height: 172px;
  }
`;

export const DropDownItem = styled.li``;

export const DropDownItemButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 15px;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;

  ${is('isActive')`
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

export const EmptyBlock = styled.div`
  margin: 8px 15px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  text-align: center;
`;
