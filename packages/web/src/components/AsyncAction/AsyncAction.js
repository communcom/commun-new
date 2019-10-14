/* eslint-disable react/require-default-props */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Loader } from '@commun/ui';
import { displayError } from 'utils/toastsMessages';

const Wrapper = styled.div`
  position: relative;
`;

const InnerWrapper = styled.div`
  & > * {
    cursor: default;
  }

  ${is('onClick')`
    cursor: pointer;

    & > * {
      cursor: pointer;
    }
  `};

  ${is('isHidden')`
    visibility: hidden;
  `};
`;

const LoaderStyled = styled(Loader)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class AsyncAction extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  };

  state = {
    isProcessing: false,
  };

  onClick = async e => {
    const { onClick } = this.props;

    this.setState({
      isProcessing: true,
    });

    try {
      await onClick(e);
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isProcessing: false,
    });
  };

  render() {
    const { className, children, onClick } = this.props;
    const { isProcessing } = this.state;

    return (
      <Wrapper className={className}>
        <InnerWrapper
          isHidden={isProcessing}
          onClick={onClick && !isProcessing ? this.onClick : null}
        >
          {children}
        </InnerWrapper>
        {isProcessing ? <LoaderStyled /> : null}
      </Wrapper>
    );
  }
}
