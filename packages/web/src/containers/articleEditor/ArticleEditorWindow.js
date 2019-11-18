import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { userType } from 'types';
import { useWindowScrollLock } from 'utils/hooks';
import ScrollFix from 'components/common/ScrollFix';
import ArticleEditor from 'components/articleEditor/ArticleEditor';
import ArticleHeader from 'components/articleEditor/ArticleHeader';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  overflow: auto;
  overflow-x: hidden;
  z-index: 100;
`;

const ScrollFixStyled = styled(ScrollFix)`
  display: flex;
  justify-content: center;
  min-height: 100%;
`;

const ArticleHeaderStyled = styled(ArticleHeader)`
  flex-shrink: 0;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 670px;
`;

const CloseButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 30px;
  right: 30px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function ArticleEditorWindow({ user, onClose }) {
  useWindowScrollLock();

  return (
    <Wrapper>
      <ScrollFixStyled>
        <EditorContainer>
          <ArticleHeaderStyled user={user} />
          <ArticleEditor />
        </EditorContainer>
        <CloseButton title="Close" onClick={onClose}>
          <CrossIcon />
        </CloseButton>
      </ScrollFixStyled>
    </Wrapper>
  );
}

ArticleEditorWindow.propTypes = {
  user: userType.isRequired,
  onClose: PropTypes.func.isRequired,
};
