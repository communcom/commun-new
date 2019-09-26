import React, { Component, Element } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import schema from './schema';

import Editor from '../Editor';
import createPlugins from './plugins';

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
  letter-spacing: -0.41px;
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
    letter-spacing: -0.41px;
  }

  p {
    font-size: 15px;
    letter-spacing: -0.41px;
  }

  ${is('inPost')`
    min-height: 48px;
    padding: 14px 16px;
  `};
`;

export default class CommentEditor extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    inPost: PropTypes.bool,

    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    onLinkFound: PropTypes.func.isRequired,
    getEmbed: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    initialValue: '',
    inPost: false,
    forwardedRef: null,
    onChange: null,
    onKeyDown: null,
  };

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

  onChange = getText => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(getText());
    }
  };

  handleLink = async node => {
    const { onLinkFound, getEmbed } = this.props;

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
    const { id, className, inPost, forwardedRef, onKeyDown } = this.props;
    const { editorValue } = this.state;

    return (
      <Wrapper className={className}>
        <EditorStyled
          ref={forwardedRef}
          id={id}
          hideBlockInsert
          hideToolbar
          spellCheck
          defaultValue={editorValue}
          inPost={inPost}
          schema={schema}
          placeholder="Add a comment..."
          plugins={this.plugins}
          onChange={this.onChange}
          onKeyDown={onKeyDown}
        />
      </Wrapper>
    );
  }
}
