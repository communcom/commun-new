import React, { Fragment } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

export const SIDEBAR_WIDTH = 198;
export const SIDEBAR_MARGIN_RIGHT = 24;

const Wrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  margin-right: ${SIDEBAR_MARGIN_RIGHT}px;
  padding: 10px 0 50px 0;

  border-left: 1px solid #e2e6e8;
`;

const Link = styled.a`
  position: relative;
  display: block;
  padding-left: 20px;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray};

  &:not(:last-of-type) {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
  }

  &::before {
    position: absolute;
    content: '';
    left: -2px;
    width: 3px;
    background-color: ${({ theme }) => theme.colors.blue};
    opacity: 0;
    transition: opacity 0.1s, top 25s, bottom 25s;
  }

  &.active {
    &::before {
      opacity: 1;
      top: 0;
      bottom: 0;
    }
  }
`;

function renderSections(sections) {
  return sections.map(section => (
    <Fragment key={section.id}>
      <Link href={`#section-${section.id}`}>{section.title}</Link>
      {/* {section.children ? renderSections(section.children) : null} */}
    </Fragment>
  ));
}

export default function Sidebar() {
  const { t } = useTranslation(['page_faq']);
  const sections = t('faq.sections', { returnObjects: true });

  return <Wrapper className="sidebar">{renderSections(sections)}</Wrapper>;
}
