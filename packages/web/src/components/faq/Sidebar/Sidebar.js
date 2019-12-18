import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { Button } from '@commun/ui';

export const SIDEBAR_WIDTH = 198;
export const SIDEBAR_MARGIN_RIGHT = 24;

const Wrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  margin: 10px ${SIDEBAR_MARGIN_RIGHT}px 0 0;
`;

const Link = styled.a`
  display: block;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray};

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

// const ButtonStyled = styled(Button)`
//   width: 100%;
//   margin-top: 25px;
// `;

function renderSections(sections) {
  return sections.map(section => (
    <Fragment key={section.id}>
      <Link href={`#${section.title}`}>{section.title}</Link>
      {section.children ? renderSections(section.children) : null}
    </Fragment>
  ));
}

export default function Sidebar({ sections }) {
  return (
    <Wrapper>
      {renderSections(sections)}
      {/* TODO: wait for link */}
      {/* <ButtonStyled primary big> */}
      {/*  Go to Help Center */}
      {/* </ButtonStyled> */}
    </Wrapper>
  );
}

Sidebar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
};
