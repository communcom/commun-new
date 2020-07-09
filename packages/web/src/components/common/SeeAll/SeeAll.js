import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { withTranslation } from 'shared/i18n';

const Wrapper = styled.a`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-transform: lowercase;
  color: ${({ theme }) => theme.colors.blue};
`;

export default withTranslation(null, { withRef: true })(
  forwardRef((props, ref) => (
    <Wrapper {...props} ref={ref}>
      {props.t('common.see_all')}
    </Wrapper>
  ))
);
