import React, { useEffect } from 'react';
import Sticky from 'react-stickynode';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CONTAINER_DESKTOP_PADDING, up } from '@commun/ui';

import { getScrollContainer } from 'utils/ui';

import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import { LAYOUT_TYPE_1PANE } from 'components/common/Layout';
import Content from 'components/pages/faq/Content';
import Header from 'components/pages/faq/Header';
import Sidebar from 'components/pages/faq/Sidebar';
import { SIDEBAR_MARGIN_RIGHT, SIDEBAR_WIDTH } from 'components/pages/faq/Sidebar/Sidebar';

const Wrapper = styled.div`
  flex: 1;

  ${up.tablet} {
    padding-top: 10px;
  }
`;

const LeftWrapper = styled.div`
  flex-shrink: 0;
  width: ${SIDEBAR_WIDTH + SIDEBAR_MARGIN_RIGHT}px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: -20px;

  padding: 20px 10px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 20px;

  ${up.tablet} {
    margin: 0 0 150px;
    padding: 40px 0 0;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 0;
  }
`;

export default function Faq({ isMobile }) {
  useEffect(() => {
    const { hash } = window.location;

    if (hash) {
      const decodedHash = decodeURI(hash).substr(1);
      const section = document.getElementById(decodedHash);

      if (section) {
        const offset = section.getBoundingClientRect().top + window.pageYOffset;

        getScrollContainer().scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  return (
    <Wrapper>
      <Header />
      <Main>
        {!isMobile ? (
          <LeftWrapper>
            <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
              <Sidebar />
            </Sticky>
          </LeftWrapper>
        ) : null}
        <Content />
      </Main>
    </Wrapper>
  );
}

Faq.getInitialProps = async () => ({
  namespacesRequired: ['page_faq'],
});

Faq.layout = LAYOUT_TYPE_1PANE;

Faq.propTypes = {
  isMobile: PropTypes.bool,
};

Faq.defaultProps = {
  isMobile: false,
};
