import styled from 'styled-components';
import is from 'styled-is';

import { CloseButton, Button, Glyph, Input } from '@commun/ui';

export const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  width: 30px;
  height: 30px;

  ${props => (props.right ? 'right' : 'left')}: 15px;

  ${is('isBack')`
    color: ${({ theme, isBlack }) => (isBlack ? '#000' : theme.colors.white)};
    background: none;

    & svg {
      width: 30px;
      height: 30px;
    }

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.lightGray};
    }
  `};

  ${is('isWhiteBackground')`
    background: #fff;
  `}
`;

export const InputStyled = styled(Input)`
  & > span {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }

  width: 100%;
  line-height: 19px;
  font-size: 14px;

  border-color: ${({ theme }) => theme.colors.lightGray};
`;

export const HeaderCommunLogo = styled(Glyph).attrs({ icon: 'commun', size: 'large' })`
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

export const CommunLogo = styled(Glyph).attrs({ icon: 'commun' })``;
CommunLogo.defaultProps = {
  size: 'medium',
};

export const ButtonStyled = styled(Button)`
  height: 50px;
  margin-top: 10px;

  font-weight: bold;
  font-size: 15px;

  ${is('fluid')`
    width: 100%;
  `}
`;

export const RateInfo = styled.div`
  margin: 10px 0 5px;
  font-size: 12px;
  font-weight: 600;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  width: 100%;
`;

export const AmountGroup = styled.div`
  display: flex;

  margin-bottom: 20px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export const Error = styled.div`
  margin-top: 5px;
  padding-left: 15px;

  width: 100%;

  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.red};
`;
