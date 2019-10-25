import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Editor from '../Editor';

const Wrapper = styled.div`
  flex-grow: 1;
`;

const EditorStyled = styled(Editor)`
  color: #000;
  margin-bottom: 10px;

  & > :first-child {
    min-height: 80px;
    padding: 10px 0 5px;
  }

  h1 {
    margin-top: 13px;
    margin-bottom: 24px;
    font-weight: 600;
    line-height: 26px;
    font-size: 20px;
  }

  p {
    font-size: 15px;
  }
`;

export default class PostEditor extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.shape({}),
    onChange: PropTypes.func,
    onLinkFound: PropTypes.func,
  };

  static defaultProps = {
    initialValue: '',
    onChange: null,
    onLinkFound: null,
  };

  postEditorRef = createRef();

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    editorValue: this.props.initialValue,
  };

  componentDidMount() {
    const { editorValue } = this.state;
    if (!editorValue) {
      setImmediate(this.focusAtStart);
    }

    this.mounted = true;
  }

  focusAtStart = () => {
    if (this.postEditorRef) {
      this.postEditorRef.current.focusAtStart();
    }
  };

  focusAtEnd = () => {
    if (this.postEditorRef) {
      this.postEditorRef.current.focusAtEnd();
    }
  };

  onChange = value => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { className, onLinkFound } = this.props;
    const { editorValue } = this.state;

    return (
      <Wrapper>
        <EditorStyled
          type="basic"
          ref={this.postEditorRef}
          defaultValue={editorValue}
          autoFocus
          className={className}
          placeholder="What's new?"
          onLinkFound={onLinkFound}
          onChange={this.onChange}
        />
      </Wrapper>
    );
  }
}
