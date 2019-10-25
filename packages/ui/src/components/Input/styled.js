import styled, { css } from 'styled-components';
import is from 'styled-is';
import by from 'styled-by';
import { Icon } from '@commun/icons';

export const InnerWrapper = styled.span`
  display: inline-table;
  position: relative;
  width: 100%;
`;

export const Label = styled.span`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-size: ${({ theme }) => theme.fontSizeM};
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: scale(1) translateY(0);
  transform-origin: 0 100%;
  transition-duration: 200ms;
  transition-property: color, transform;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
`;

export const InputWrapper = styled.span`
  overflow: hidden;
  display: table-cell;
  position: relative;
  user-select: none;
  transition-duration: 250ms;
  transition-property: box-shadow, width;
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
`;

export const InputStyled = styled.input`
  display: inline-block;
  position: relative;
  width: 100%;

  /** Если использовать 'height: 100%' поле схлопывается в Safari v10.1.2. **/
  min-height: 100%;
  margin: 0;
  padding: 0;
  outline: none;
  font: inherit;
  font-weight: ${({ theme }) => theme.fontWeightNormal};
  line-height: inherit;
  background: none;
  border: none;
  border-radius: 0;
  appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &::-webkit-search-decoration {
    appearance: none;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }

  &::-webkit-input-placeholder {
    text-indent: 0;
  }

  &::-moz-placeholder {
    opacity: ${({ theme }) => theme.opacityActive};
  }

  &::-ms-clear {
    display: none;
  }

  &:invalid {
    box-shadow: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
    text-overflow: ellipsis;
    transition: opacity 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #000 !important;
    /* Hack from http://stackoverflow.com/a/29350537 */
    transition: background-color 999999s ease-in-out 0s;
  }

  color: #000;
`;

export const Info = styled.span`
  display: table-caption;
  caption-side: bottom;
  padding-top: 5px;
  padding-right: 12px;
  white-space: normal;
`;

export const Wrapper = styled.span`
  display: inline-block;

  &,
  * {
    box-sizing: border-box;
  }

  ${is('isFocused')`
    z-index: 1;

    ${InputStyled}::placeholder {
      opacity: 0;
    }
  `}

  ${is('hasLabel')`
    ${InputStyled}::placeholder {
      opacity: 0;
    }
  `}

  ${is('hasLabel', 'isFocused')`
    ${InputStyled}::placeholder {
      opacity: ${({ theme }) => theme.opacityActive};
    }
    /* IE fix for input with label and placeholder */
    ${InputStyled}:-ms-input-placeholder {
      opacity: 0;
    }
  `}

  ${by('width', {
    available: `
      width: 100%;
    `,
  })}

  ${by('type', {
    hidden: `
      display: none !important;
    `,
    password: `
      ${InputStyled} {
        text-overflow: clip;
      }
    `,
  })}

  /* reset for ios */
  ${InputStyled}:disabled {
    opacity: ${({ theme }) => theme.opacityActive};
  }

  ${by('view', {
    default: () => css`
      ${InputWrapper} {
        border-radius: 8px;
        border-style: solid;
        border-width: 1px;
        background-color: ${({ theme }) => theme.colors.contextWhite};
        border-color: transparent;

        ${is('isFocused')`
          background: transparent;
          border-color: ${({ theme }) => theme.colors.contextLightGrey};
        `}
      }

      ${InputStyled} {
        padding: 18px 16px;
        line-height: 20px;
        font-size: 17px;
        text-align: center;
      }
    `,
  })}
`;

export const IconStyled = styled(Icon)`
  position: absolute;
  right: 5%;
  top: 25%;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 5%;
  top: 25%;
  background: #a5a7bd;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  text-align: center;
`;

export const IconText = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
`;

export const HintContainer = styled.ul`
  position: absolute;
  z-index: 1;
  right: -12%;
  top: 95%;
  list-style: disc;
  width: 360px;
  height: 181px;
  background: #272a30;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px 0 25px;
`;

export const Hint = styled.li`
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  max-width: 330px;
  text-align: left;
`;

export const HintPoint = styled.div`
  position: absolute;
  top: -5%;
  right: 14%;
  width: 20px;
  height: 20px;
  background: #272a30;
  transform: rotate(45deg);
  border-radius: 2px;
`;
