import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { withTranslation } from 'shared/i18n';

import Editor from '../Editor';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

const EditorStyled = styled(Editor)`
  flex-grow: 1;
  max-width: 100%;
  min-height: 35px;
  padding: 8px 15px;

  line-height: 18px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black};
  overflow: hidden;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }

  h2 {
    margin-bottom: 24px;
    font-weight: 600;
    line-height: 26px;
    font-size: 17px;
  }

  p {
    line-height: 18px;
    font-size: 13px;
  }

  & .editor__placeholder {
    font-family: 'Open Sans', Arial, sans-serif;
    line-height: 18px;
    font-size: 13px;
    letter-spacing: -0.41px;
    color: ${({ theme }) => theme.colors.gray};
  }

  ${is('inPost')`
    min-height: 48px;
    padding: 14px 16px;
  `};
`;

@withTranslation()
export default class CommentEditor extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    initialValue: PropTypes.shape(),
    isMobile: PropTypes.bool.isRequired,
    inPost: PropTypes.bool,
    autoFocus: PropTypes.bool,

    editorRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.object }),
    ]),
    onLinkFound: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    initialValue: null,
    inPost: false,
    autoFocus: false,
    editorRef: null,
    onChange: null,
    onKeyDown: null,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    editorValue: this.props.initialValue,
  };

  render() {
    const {
      id,
      className,
      inPost,
      isMobile,
      autoFocus,
      editorRef,
      onKeyDown,
      onChange,
      onLinkFound,
      t,
      ...props
    } = this.props;
    const { editorValue } = this.state;

    return (
      <Wrapper className={className}>
        <EditorStyled
          type="comment"
          ref={editorRef}
          id={id}
          hideBlockInsert
          hideToolbar
          autoFocus={autoFocus}
          spellCheck
          defaultValue={editorValue}
          inPost={inPost}
          placeholder={
            isMobile
              ? t('components.editor.comment_editor.placeholder-mobile')
              : t('components.editor.comment_editor.placeholder')
          }
          {...props}
          onLinkFound={onLinkFound}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </Wrapper>
    );
  }
}
