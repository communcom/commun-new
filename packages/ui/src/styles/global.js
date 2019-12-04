import { createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';

import nprogress from './nprogress';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700,700i&display=swap&subset=cyrillic,cyrillic-ext');

  ${normalize}

  *, *::after, *::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    line-height: normal;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
  }

  html, body {
    height: 100vh;
  }

  body {
    position: relative;
    font-family: 'Open Sans', Arial, sans-serif;
    background: #f3f5fa;
    overflow-anchor: none;
  }


  button {
    border: 0;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    appearance: none;

    &:disabled {
      cursor: default;
      cursor: not-allowed;
    }
  }

  input,
  textarea {
    border: 0;
    outline: none;
    appearance: none;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    appearance: none;
  }

  input::-ms-clear {
    display: none;
  }

  a {
    text-decoration: none;
    outline: none;
  }

  ul {
    list-style-type: none;
  }

  /**
   * By default icon can be shrunk and crop part of image (ugly)
   */
  svg {
    flex-shrink: 0;
  }

  /* fixes zoom on mobile */
  div[contenteditable="true"] {
    font-size: 16px;
  }

  ${nprogress}
`;
