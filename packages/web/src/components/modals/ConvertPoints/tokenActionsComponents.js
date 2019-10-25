import styled from 'styled-components';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 16px;
  background-color: #fff;

  ${up.mobileLandscape} {
    flex-basis: 400px;
    width: auto;
    height: auto;
    max-width: 400px;
    padding: 56px 56px 40px 56px;
    border-radius: 4px;
  }
`;

export const Title = styled.h2`
  position: relative;
  padding-bottom: 8px;

  font-size: 28px;
  text-align: center;

  color: #000;

  ${up.mobileLandscape} {
    font-size: 32px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 0;
  display: flex;
  padding: 5px;

  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.contextBlue};
  }

  ${up.mobileLandscape} {
    display: none;
  }
`;

export const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 24px;
  height: 24px;
`;

export const Subtitle = styled.p`
  width: 100%;
  padding: 27px 0 12px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;
