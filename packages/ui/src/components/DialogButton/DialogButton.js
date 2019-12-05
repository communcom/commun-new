import styled from 'styled-components';

export default styled.button.attrs({ type: 'button' })`
  padding: 8px 16px;
  border-radius: 30px;
  white-space: nowrap;
  transition: color 0.15s, background-color 0.15s;
  height: 50px;
  line-height: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;

  ${({ theme, primary, warning, text }) => {
    if (primary) {
      return `
        color: #fff;
        background-color: ${theme.colors.blue};
      `;
    }

    if (warning) {
      return `
        color: #fff;
        background-color: ${theme.colors.lightRed};
      `;
    }

    if (text) {
      return `
        color: ${theme.colors.blue};
        background-color: transparent;

        &:hover,
        &:focus {
          color: ${theme.colors.blueHover};
        }
      `;
    }

    return `
      color: ${theme.colors.blue};
      background-color: ${theme.colors.lightGrayBlue};

      &:hover,
      &:focus {
        color: ${theme.colors.blueHover};
      }
    `;
  }}
`;
