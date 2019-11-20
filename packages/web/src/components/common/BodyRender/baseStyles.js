/* stylelint-disable no-descending-specificity */

import { css } from 'styled-components';

export default css`
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;

  p {
    margin: 10px 0;
    line-height: 1.5;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  li p {
    display: inline;
    margin: 0;
  }

  span {
    line-height: 1.5;
  }

  b,
  strong,
  .bold {
    font-weight: 600;
  }

  i,
  .italic {
    font-style: italic;
  }

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  ol,
  ul {
    margin: 0 0.1em;
    padding-left: 1em;

    ol,
    ul {
      margin: 0.1em;
    }
  }

  pre {
    overflow: hidden;
    white-space: pre-wrap;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};

    &:visited {
      color: #a0adf5;
    }
  }
`;
