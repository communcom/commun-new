import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const Wrapper = styled.span`
  display: inline-block;
`;

const ContentLoaderStyled = styled(ContentLoader)`
  display: block;
`;

export default function Skeleton({ className, ...props }) {
  const { width, height } = props;

  return (
    <Wrapper
      className={className}
      style={{
        width: Number(width),
        height: Number(height),
      }}
    >
      <ContentLoaderStyled {...props} />
    </Wrapper>
  );
}

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Skeleton.defaultProps = {
  width: 100,
  height: 4,
};
