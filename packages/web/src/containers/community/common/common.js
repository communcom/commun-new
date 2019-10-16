import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Card } from '@commun/ui';
import { Icon } from '@commun/icons';

import EditableTextOriginal from 'components/EditableText';

export const Wrapper = styled(Card)`
  min-height: 100%;
  padding-top: 2px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
`;

export const Title = styled.h2`
  display: inline-block;
  font-size: 22px;
  letter-spacing: -0.41px;
  line-height: 22px;
  vertical-align: baseline;
`;

export const TabHeaderWrapper = styled.div`
  display: block;
`;

export const MenuButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 12px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }

  ${up('tablet')} {
    display: none;
  }
`;

export const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

export const ActionsPanel = styled.ul`
  display: none;

  ${up('tablet')} {
    display: flex;
    margin-left: auto;
  }
`;

export const ActionsItem = styled.li``;

export const ActionButton = styled.button.attrs({ type: 'button' })`
  padding-left: 23px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

export const ButtonsBar = styled.div`
  margin: 0 -10px;
`;

export const Button = styled.button.attrs({ type: 'button' })`
  height: 28px;
  padding: 0 10px;
  font-size: 15px;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

export const EditableText = styled(EditableTextOriginal)`
  padding: 16px 0 0;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.3px;

  ${up('tablet')} {
    font-size: 17px;
    line-height: 26px;
    letter-spacing: -0.41px;
  }
`;
