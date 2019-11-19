import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Embed from 'components/common/Embed';
import Editor from '../Editor';

const EditorStyled = styled(Editor)`
  color: #000;

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
    isArticle: PropTypes.bool,
    onChange: PropTypes.func,
    onLinkFound: PropTypes.func,
  };

  static defaultProps = {
    initialValue: null,
    isArticle: false,
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
  }

  focusAtStart = () => {
    if (this.postEditorRef.current) {
      this.postEditorRef.current.focusAtStart();
    }
  };

  focusAtEnd = () => {
    if (this.postEditorRef.current) {
      this.postEditorRef.current.focusAtEnd();
    }
  };

  onChange = value => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  };

  insertImageFile(file) {
    this.postEditorRef.current.insertImageFile(file);
  }

  render() {
    const { className, isArticle, onLinkFound } = this.props;
    const { editorValue } = this.state;

    const commonProps = {
      ref: this.postEditorRef,
      defaultValue: editorValue,
      autoFocus: true,
      className,
      onLinkFound,
      onChange: this.onChange,
    };

    if (isArticle) {
      return (
        <EditorStyled
          type="article"
          {...commonProps}
          enableToolbar
          titlePlaceholder="Title"
          placeholder="Tell your story..."
          embedRenderer={({ embed, onRemove }) => <Embed data={embed} onRemove={onRemove} />}
        />
      );
    }

    return <EditorStyled type="basic" {...commonProps} placeholder="What's new?" />;
  }
}
