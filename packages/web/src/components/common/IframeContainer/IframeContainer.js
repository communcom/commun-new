import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { embedRecheck } from 'utils/embeds';

const Wrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;

  & > * {
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }
`;

export default function IframeContainer({ html, provider }) {
  useEffect(() => {
    embedRecheck(provider);
  }, [html, provider]);

  return <Wrapper dangerouslySetInnerHTML={{ __html: html }} />;
}

IframeContainer.propTypes = {
  html: PropTypes.string.isRequired,
  provider: PropTypes.string,
};

IframeContainer.defaultProps = {
  provider: undefined,
};