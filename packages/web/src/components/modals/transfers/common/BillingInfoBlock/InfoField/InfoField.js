import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loader } from '@commun/ui';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 60px;
  padding: 0 15px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;

const Left = styled.div``;
const Right = styled.div``;

export default function InfoField({
  titleLeft,
  titleRight,
  textLeft,
  textRight,
  isLoading,
  className,
}) {
  return (
    <Wrapper className={className}>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <Title>
            <Left>{titleLeft}</Left>
            <Right>{titleRight}</Right>
          </Title>
          <Body>
            <Left>{textLeft}</Left>
            <Right>{textRight}</Right>
          </Body>
        </>
      )}
    </Wrapper>
  );
}

InfoField.propTypes = {
  titleLeft: PropTypes.string,
  titleRight: PropTypes.string,
  textLeft: PropTypes.string,
  textRight: PropTypes.string,
  isLoading: PropTypes.bool,
};

InfoField.defaultProps = {
  titleLeft: null,
  titleRight: null,
  textLeft: null,
  textRight: null,
  isLoading: false,
};
