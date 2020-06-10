import React, { Fragment } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

export const SIDEBAR_WIDTH = 198;
export const SIDEBAR_MARGIN_RIGHT = 24;

const Wrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  margin-right: ${SIDEBAR_MARGIN_RIGHT}px;
  padding: 10px 0 50px 0;
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

function renderSections(sections) {
  return sections.map(section => (
    <Fragment key={section.id}>
      <Link href={`#${section.id}`}>{section.title}</Link>
      {/* {section.children ? renderSections(section.children) : null} */}
    </Fragment>
  ));
}

export default function Sidebar() {
  const { t } = useTranslation(['page_faq']);
  const sections = t('faq.sections', { returnObjects: true });

  return <Wrapper>{renderSections(sections)}</Wrapper>;
}
