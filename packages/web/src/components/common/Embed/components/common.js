import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: min-content;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;

  &:not(:last-child) {
    padding-bottom: 10px;
  }

  ${is('isCompact')`
    flex-direction: row;
    border-radius: 8px;
    max-height: 250px;
  `}

  ${is('isCompact', 'isInForm')`
     border: none;
  `}

  ${is('isDark')`
    border: none;
    background: ${({ theme }) => theme.colors.lightGrayBlue};
  `};
`;

export const ThumbnailLink = styled.a.attrs(({ thumbnailUrl }) => ({
  target: '_blank',
  style: {
    backgroundImage: `url("${thumbnailUrl}")`,
  },
}))`
  display: flex;
  height: 260px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;

  ${is('isCompact')`
    height: auto;
    width: 132px;
  `}
`;

export const InfoWrapper = styled.div`
  padding: 16px;

  ${is('isCompact')`
    flex: 1;
  `};
`;

export const Info = styled.div`
  position: relative;
  padding-right: 40px;
`;

export const TitleLink = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  margin-bottom: 8px;

  font-weight: 600;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.black};
`;

export const LinkStyled = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  font-size: 15px;

  color: ${({ theme }) => theme.colors.gray};
`;

export const CrossButton = styled.button`
  position: absolute;
  display: flex;

  align-items: center;
  justify-content: center;
  top: 5px;
  right: 5px;

  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
`;

export const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 14px;
  height: 14px;
`;
