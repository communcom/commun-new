import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

import { MainContainer } from '@commun/ui';
import Header from 'components/common/Header';
import SideBar from 'components/common/SideBar';
import ScrollFix from 'components/common/ScrollFix';

export const LAYOUT_TYPE_1PANE = '1pane';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme, type }) => {
      if (type === LAYOUT_TYPE_1PANE) {
        return '#ffffff';
      }

      return theme.colors.lightGrayBlue;
    }};
  }
`;

const Wrapper = styled.div``;

const ScrollFixStyled = styled(ScrollFix)`
  display: flex;

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const MainContainerStyled = styled(MainContainer)`
  flex-direction: row;
`;

export default function Layout({ pageProps, type, children }) {
  return (
    <>
      <GlobalStyles type={type} />
      <Wrapper>
        <Header communityId={pageProps.communityId} noShadow={type === LAYOUT_TYPE_1PANE} />
        <ScrollFixStyled>
          <MainContainerStyled noVerticalPadding={type === LAYOUT_TYPE_1PANE}>
            {type !== LAYOUT_TYPE_1PANE ? <SideBar /> : null}
            {children}
          </MainContainerStyled>
        </ScrollFixStyled>
      </Wrapper>
    </>
  );
}

Layout.propTypes = {
  pageProps: PropTypes.object.isRequired,
  type: PropTypes.string,
};

Layout.defaultProps = {
  type: undefined,
};
