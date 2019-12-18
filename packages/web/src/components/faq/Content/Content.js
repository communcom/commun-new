import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import Section from 'components/faq/Section';

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
      />
      {section.children ? renderSections(section.children, true, idOpened, setIdOpened) : null}
    </Fragment>
  ));
}

export default function Content({ sections }) {
  const [idOpened, setIdOpened] = useState(null);

  return <Wrapper>{renderSections(sections, false, idOpened, setIdOpened)}</Wrapper>;
}

Content.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
};
