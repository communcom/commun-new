import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Placeholder from 'rich-html-editor/lib/components/Placeholder';

import Editor from '../Editor';

import schema from './schema';
import createPlugins from './plugins';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EditorStyled = styled(Editor)`
  color: #000;
  margin-bottom: 10px;

  h1 {
    margin-top: 13px;
    margin-bottom: 24px;
    font-weight: 600;
    line-height: 26px;
    font-size: 20px;
    letter-spacing: -0.41px;
  }

  p {
    font-size: 15px;
    letter-spacing: -0.41px;

    ${Placeholder} {
      visibility: hidden;
    }
  }

  p:nth-child(2):last-child {
    ${Placeholder} {
      visibility: visible;
    }
  }
`;

export default class PostEditor extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.string,
    onChange: PropTypes.func,
    onLinkFound: PropTypes.func,
    getEmbed: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValue: '',
    onChange: null,
    onLinkFound: null,
  };

  postEditorRef = createRef();

  constructor(props) {
    super(props);

    const { initialValue } = this.props;

    this.plugins = createPlugins({
      handleLink: this.handleLink,
    });

    this.state = {
      editorValue: initialValue,
    };
  }

  componentDidMount() {
    const { editorValue } = this.state;
    if (editorValue === '') {
      setImmediate(this.focusAtStart);
    }
  }

  focusAtStart = () => {
    if (this.postEditorRef) this.postEditorRef.current.focusAtStart();
  };

  focusAtEnd = () => {
    if (this.postEditorRef) this.postEditorRef.current.focusAtEnd();
  };

  onChange = getEditorText => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const text = getEditorText();
    const titleEndIndex = text.indexOf('</h1>');

    const title = text.substring(4 /* <h1> */, titleEndIndex);
    const body = text.substring(titleEndIndex + 5 /* </h1> */, text.length);

    onChange(title, body);
  };

  handleLink = async node => {
    const { onLinkFound, getEmbed } = this.props;

    if (!onLinkFound) {
      return;
    }

    try {
      const url = node.data.get('href');
      const result = await getEmbed({ url });
      onLinkFound(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Handle link fetch error :', err);
    }
  };

  render() {
    const { className } = this.props;
    const { editorValue } = this.state;

    return (
      <Wrapper>
        <EditorStyled
          ref={this.postEditorRef}
          defaultValue={editorValue}
          hideBlockInsert
          hideToolbar
          autoFocus
          plugins={this.plugins}
          schema={schema}
          className={className}
          onChange={this.onChange}
        />
      </Wrapper>
    );
  }
}
