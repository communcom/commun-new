import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { embedRecheck } from 'utils/embeds';

const Wrapper = styled.div`
  max-width: 100%;
  border-radius: 10px;
  overflow: hidden;

  & > * {
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  .twitter-tweet {
    width: 1px !important; /* https://github.com/communcom/commun/issues/2461 */
  }

  .instagram-media {
    border: none !important;
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
