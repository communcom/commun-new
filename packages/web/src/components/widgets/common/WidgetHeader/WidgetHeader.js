import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNil } from 'ramda';

import { WidgetTitle } from 'components/widgets/common';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 15px;
`;

const Count = styled.div`
  display: inline-block;
  margin-left: 5px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default function WidgetHeader({ title, count, link }) {
  return (
    <Wrapper>
      <WidgetTitle>
        {title}
        {!isNil(count) ? (
          <>
            :<Count>{count}</Count>
          </>
        ) : null}
      </WidgetTitle>
      {link}
    </Wrapper>
  );
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.string,
  link: PropTypes.node,
};

WidgetHeader.defaultProps = {
  count: null,
  link: null,
};
