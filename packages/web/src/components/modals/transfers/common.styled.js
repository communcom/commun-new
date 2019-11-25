import styled from 'styled-components';
import is from 'styled-is';

import { CloseButton, Button, Glyph, up, Input } from '@commun/ui';

export const CloseButtonStyled = styled(CloseButton)`
  ${is('isBack')`
    width: 13px;
    height: 20px;
    color: ${({ theme }) => theme.colors.white};
    background: none;

    & svg {
      width: 13px;
      height: 20px;
    }

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.lightGray};
    }
  `};
`;

export const InputStyled = styled(Input)`
  width: 168px;

  ${up.mobileLandscape} {
    width: 155px;

    ${is('fluid')`
      width: 100%;
    `}
  }

  ${is('fluid')`
    width: 100%;
  `}

  &::after {
    border-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const HeaderCommunLogo = styled(Glyph).attrs({ icon: 'commun', size: 'large' })`
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

export const CommunLogo = styled(Glyph).attrs({ icon: 'commun', size: 'medium' })``;

export const ButtonStyled = styled(Button)`
  height: 50px;

  font-size: 15px;
  font-weight: 600;

  ${is('fluid')`
    width: 100%;
  `}
`;

export const RateInfo = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
`;

export const AmountGroup = styled.div`
  display: flex;

  margin-bottom: 20px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;
