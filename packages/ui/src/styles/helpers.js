import { css } from 'styled-components';

export const breakWord = css`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
`;

export const overflowEllipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const withBottomTooltip = css`
  &::before {
    content: attr(aria-label);
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    z-index: 6;
    display: block;
    width: max-content;
    max-width: 200px;
    padding: 5px;
    font-size: 12px;
    line-height: 16px;
    background-color: #24242c;
    color: #fff;
    border-radius: 6px;
    transform: translateX(-50%);
    ${breakWord};
  }

  &::after {
    position: absolute;
    top: calc(100% + 6px);
    left: calc(50% - 6px);
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: #24242c;
    transform: rotate(-45deg);
  }
`;

export const withTopRightTooltip = css`
  &::before {
    content: attr(aria-label);
    position: absolute;
    bottom: 42px;
    right: 0;
    z-index: 6;
    display: block;
    width: max-content;
    max-width: 200px;
    padding: 5px;
    font-size: 12px;
    line-height: 16px;
    background-color: #24242c;
    color: #fff;
    border-radius: 6px;
    ${breakWord};
  }

  &::after {
    position: absolute;
    top: -4px;
    right: 7px;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: #24242c;
    transform: rotate(-45deg);
  }
`;
