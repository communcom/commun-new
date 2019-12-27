/* eslint-disable react/require-default-props,react/destructuring-assignment */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { animations } from '@commun/ui';
import { Icon } from '@commun/icons';

import { displayError } from 'utils/toastsMessages';

const Wrapper = styled.div`
  position: relative;
`;

const InnerWrapper = styled.div`
  display: flex;

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

const LoaderWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: ${animations.fadeIn} 0.25s;
  overflow: hidden;
`;

export const LoaderIcon = styled(Icon)`
  display: block;
  width: 22px;
  height: 22px;
  animation: ${animations.rotate} 1s linear infinite;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`;

LoaderIcon.defaultProps = {
  name: 'circle-loader',
};

export default class AsyncAction extends PureComponent {
  static propTypes = {
    onClickHandler: PropTypes.func,
    isProcessing: PropTypes.bool,
  };

  static defaultProps = {
    isProcessing: undefined,
  };

  state = {
    isProcessing: this.props.isProcessing,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isProcessing !== this.state.isProcessing) {
      this.setState({
        isProcessing: nextProps.isProcessing,
      });
    }
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  onClick = async e => {
    const { onClickHandler } = this.props;

    this.setState({
      isProcessing: true,
    });

    try {
      await onClickHandler(e);
    } catch (err) {
      displayError(err);
    }

    if (!this.unmount) {
      this.setState({
        isProcessing: false,
      });
    }
  };

  render() {
    const { className, children, onClickHandler } = this.props;
    const { isProcessing } = this.state;

    return (
      <Wrapper className={className}>
        <InnerWrapper
          isHidden={isProcessing}
          onClick={onClickHandler && !isProcessing ? this.onClick : null}
        >
          {children}
        </InnerWrapper>
        {isProcessing ? (
          <LoaderWrapper>
            <LoaderIcon name="circle-loader" />
          </LoaderWrapper>
        ) : null}
      </Wrapper>
    );
  }
}
