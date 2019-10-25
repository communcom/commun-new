import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Editor from '../Editor';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

const EditorStyled = styled(Editor)`
  flex-grow: 1;
  max-width: 100%;
  min-height: 35px;
  padding: 8px 16px;

  line-height: 18px;
  font-size: 13px;
  color: #000;
  overflow: hidden;

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
  }

  h2 {
    margin-bottom: 24px;
    font-weight: 600;
    line-height: 26px;
    font-size: 17px;
  }

  p {
    font-size: 15px;
  }

  ${is('inPost')`
    min-height: 48px;
    padding: 14px 16px;
  `};
`;

export default class CommentEditor extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    initialValue: PropTypes.shape(),
    inPost: PropTypes.bool,

    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any }),
    ]),
    onLinkFound: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    initialValue: null,
    inPost: false,
    forwardedRef: null,
    onChange: null,
    onKeyDown: null,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    editorValue: this.props.initialValue,
  };

  render() {
    const { id, className, inPost, forwardedRef, onKeyDown, onChange, onLinkFound } = this.props;
    const { editorValue } = this.state;

    return (
      <Wrapper className={className}>
        <EditorStyled
          type="comment"
          ref={forwardedRef}
          id={id}
          hideBlockInsert
          hideToolbar
          spellCheck
          defaultValue={editorValue}
          inPost={inPost}
          placeholder="Add a comment..."
          onLinkFound={onLinkFound}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </Wrapper>
    );
  }
}
