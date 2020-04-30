import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import { up } from '@commun/ui';
import Section from 'components/faq/Section';
import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  flex: 1;

  ${up.tablet} {
    max-width: 650px;
  }
`;

function renderSections(sections, isChildren = false, idOpened = null, setIdOpened) {
  return sections.map(section => (
    <Fragment key={section.id}>
      <Section
        section={section}
        idOpened={idOpened}
        setIdOpened={setIdOpened}
        isChildren={isChildren}
      >
        {section.children ? renderSections(section.children, true, idOpened, setIdOpened) : null}
      </Section>
    </Fragment>
  ));
}

export default function Content() {
  const [idOpened, setIdOpened] = useState(null);
  const { t } = useTranslation(['page_faq']);
  const sections = t('faq.sections', { returnObjects: true });

  return <Wrapper>{renderSections(sections, false, idOpened, setIdOpened)}</Wrapper>;
}
