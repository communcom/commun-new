import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNil } from 'ramda';

import { WidgetTitle } from 'components/widgets/common';

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 15px 0 20px;
`;

const Count = styled.div`
  display: inline-block;
  margin-left: 5px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function WidgetHeader({ title, count, right }) {
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
      {right}
    </Wrapper>
  );
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  right: PropTypes.node,
};

WidgetHeader.defaultProps = {
  count: null,
  right: null,
};
