import styled from 'styled-components';

export default styled.button.attrs({ type: 'button' })`
  height: 28px;
  padding: 0 10px;
  font-size: 15px;
  letter-spacing: -0.41px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;
