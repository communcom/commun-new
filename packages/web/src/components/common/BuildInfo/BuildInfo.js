import React, { useState } from 'react';
import styled from 'styled-components';

import { up } from '@commun/ui';

import env from 'shared/env';

const Anchor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;

  ${up.desktop} {
    left: 15%;
  }
`;

const Wrapper = styled.div`
  padding: 2px 5px 3px;
  margin: 2px;
  font-size: 12px;
  color: #e2e400;
  background: rgba(50, 50, 50, 0.8);
  border-radius: 5px;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
`;

export default function BuildInfo() {
  const [closed, setClosed] = useState(false);

  if (closed || !env.WEB_COMMIT_HASH || env.WEB_HOST_ENV === 'production') {
    return null;
  }

  return (
    <Anchor id="js-build-info">
      <Wrapper>
        {env.WEB_BRANCH_NAME || 'unknown'}:{env.WEB_COMMIT_HASH.substr(0, 7)}
      </Wrapper>
      <CloseButton name="build_info_close" onClick={() => setClosed(true)} />
    </Anchor>
  );
}
