import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Editor from '../Editor';

import { simpleSchema } from './schema';
import createPlugins from './plugins';

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
    letter-spacing: -0.41px;
  }

  p {
    font-size: 15px;
    letter-spacing: -0.41px;
  }
`;

export default class PostEditor extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.shape({}),
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
      placeholder: "What's new?",
    });

    this.state = {
      editorValue: initialValue,
    };
  }

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

  handleLink = async node => {
    if (!this.mounted) {
      // Игнорируем нахождение ссылок сразу после открытия редактора,
      // потому что в начале находятся ссылки которые уже были в тексте.
      return;
    }

    const { onLinkFound, getEmbed } = this.props;

    if (!onLinkFound) {
      return;
    }

    try {
      const url = node.data.get('href');
      const info = await getEmbed({ url });

      onLinkFound({
        type: info.type === 'link' ? 'website' : info.type,
        content: url,
        attributes: info,
      });
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
          autoFocus
          plugins={this.plugins}
          schema={simpleSchema}
          className={className}
          onChange={this.onChange}
        />
      </Wrapper>
    );
  }
}
