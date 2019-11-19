/* eslint-disable class-methods-use-this,react/no-unused-state,react/prop-types,import/no-extraneous-dependencies */

import { Component } from 'react';
import throttle from 'lodash.throttle';
import { Value } from 'slate';

import { validateAndUpload } from 'utils/uploadImage';
import { displayError } from 'utils/toastsMessages';
import {
  convertDocumentToEditorValue,
  convertEditorValueToDocument,
  loadDraft,
  saveDraft,
  convertToArticle,
  removeDraft,
} from 'utils/editor';
import { formatContentId } from 'store/schemas/gate';

// eslint-disable-next-line react/require-render-return
export default class EditorForm extends Component {
  saveDraft = throttle(() => {
    const { contentId, parentCommentId, parentPostId } = this.props;
    const { body, attachments } = this.state;

    const parentId = contentId || parentCommentId || parentPostId;
    const parentLink = parentId ? formatContentId(parentId) : null;

    const draftKey = this.getDraftKey();

    saveDraft(
      {
        parentLink,
        body,
        attachments,
      },
      draftKey
    );
  }, 3000);

  componentWillUnmount() {
    this.saveDraft.flush();
  }

  getInitialValue(entity, defaultValue) {
    const { isEdit } = this.props;

    // try load draft
    const draftInitialValue = this.tryLoadDraftInitialValue();

    if (draftInitialValue) {
      return draftInitialValue;
    }

    // if isEdit and exists entity
    if (isEdit && entity) {
      const data = convertDocumentToEditorValue(entity);

      return {
        initialValue: data.body,
        attachments: data.attachments,
        body: data.body,
      };
    }

    // if exists defaultValue
    if (defaultValue) {
      const data = convertDocumentToEditorValue(defaultValue);

      return {
        initialValue: data.body,
        attachments: data.attachments,
        body: data.body,
      };
    }

    return {
      initialValue: null,
      attachments: [],
    };
  }

  getDraftKey() {
    return this.constructor.DRAFT_KEY;
  }

  handleLinkFound = newAttach => {
    const { attachments } = this.state;

    // В текущей версии можно добавить только 1 аттач.
    if (attachments.length >= 1) {
      return;
    }

    let lastId = 0;

    for (const attach of attachments) {
      if (attach.content === newAttach.content) {
        return;
      }

      if (lastId < attach.id) {
        lastId = attach.id;
      }
    }

    this.setState(
      {
        attachments: attachments.concat({
          ...newAttach,
          id: lastId + 1,
        }),
      },
      this.saveDraft
    );
  };

  handleChange = body => {
    this.setState({ body }, this.saveDraft);
  };

  handleResourceRemove = id => {
    const { attachments } = this.state;

    this.setState(
      {
        attachments: attachments.filter(attach => attach.id !== id),
      },
      this.saveDraft
    );
  };

  handleTakeFile = async e => {
    const file = e.target && e.target.files[0];

    if (!file) {
      return;
    }

    const { isArticle } = this.props;

    if (isArticle) {
      this.postEditorRef.current.insertImageFile(file);
      return;
    }

    try {
      this.setState({ isImageLoading: true });
      const url = await validateAndUpload(file);
      if (url) {
        this.handleLinkFound({
          type: 'image',
          content: url,
        });
      }
      this.setState({ isImageLoading: false });
    } catch (err) {
      displayError('Image uploading failed:', err);
      this.setState({ isImageLoading: false });
    }

    this.fileInputRef.current.value = null;
  };

  post = () => {
    const { body, attachments } = this.state;

    const data = convertEditorValueToDocument(body, attachments, this.getEditorMode());

    return this.handleSubmit(data);
  };

  tryLoadDraftInitialValue() {
    try {
      const draft = loadDraft(this.getDraftKey());

      if (draft) {
        const { contentId, parentPostId, parentCommentId } = this.props;

        const parentContentId = parentCommentId || parentPostId;

        // Если это комментарий, то проверяем, от этого ли родителя у нас черновик.
        if (
          (!contentId || formatContentId(contentId) === draft.parentLink) &&
          (!parentContentId || formatContentId(parentContentId) === draft.parentLink)
        ) {
          return {
            initialValue: draft.body,
            attachments: draft.attachments,
            body: Value.fromJSON(draft.body),
          };
        }
      }
    } catch (err) {
      displayError('Draft loading failed', err);
    }

    return null;
  }

  removeDraft(key) {
    removeDraft(key || this.getDraftKey());
  }

  saveCurrentAsArticleDraft(articleDraftKey) {
    const { body, attachments } = this.state;

    const article = convertToArticle({ body, attachments });

    if (!article) {
      removeDraft(articleDraftKey);
      return;
    }

    saveDraft(
      {
        body: article,
      },
      articleDraftKey
    );
  }

  // Component don't have render method, because it's abstract Form, for further inherit.
  render() {
    throw new Error('Abstract method');
  }
}
