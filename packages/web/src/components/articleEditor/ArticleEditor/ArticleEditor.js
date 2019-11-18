import React from 'react';
import styled from 'styled-components';

import PostEditor from 'components/editor/PostEditor';

const PostEditorStyled = styled(PostEditor)`
  flex-grow: 1;
`;

export default function ArticleEditor() {
  return <PostEditorStyled isArticle />;
}
