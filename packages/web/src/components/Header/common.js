import styled from 'styled-components';
import { up } from 'styled-breakpoints';

// eslint-disable-next-line import/prefer-default-export
export const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100%;
  min-width: 56px;
  padding: 10px;
  color: #000;

  ${up('tablet')} {
    padding: 20px;
  }

  ${up('desktop')} {
    min-width: 64px;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;
