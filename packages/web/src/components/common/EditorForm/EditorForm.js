/* eslint-disable class-methods-use-this,react/no-unused-state,react/prop-types,import/no-extraneous-dependencies,no-underscore-dangle */

import { Component } from 'react';
import throttle from 'lodash.throttle';
import { Value } from 'slate';

import { validateAndUpload } from 'utils/images/upload';
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
    if (this.isStopDraftsSaving) {
      return;
    }

    const { contentId, isEdit, isArticle } = this.props;
    const { body, attachments, communityId } = this.state;

    const parentLink = this.getParentCommentId();

    const draftKey = this.getDraftKey();

    if (!isArticle && body?.document?.text?.trim() === '' && attachments.length === 0) {
      removeDraft(draftKey);
      return;
    }

    const draft = {
      communityId,
      parentLink,
      body,
      attachments: attachments || undefined,
    };

    if (isEdit) {
      draft.contentLink = formatContentId(contentId);
    }

    saveDraft(draftKey, draft);
  }, 3000);

  componentWillUnmount() {
    this.saveDraft.flush();
  }

  getParentCommentId() {
    const { parentPostId, visuallyParentCommentId, parentCommentId } = this.props;
    const contentId = visuallyParentCommentId || parentCommentId || parentPostId;

    if (!contentId) {
      return undefined;
    }

    return formatContentId(contentId);
  }

  getInitialValue(document, defaultValue) {
    const { body, attachments, communityId } = this._getInitialValue(document, defaultValue);

    const parsedBody = body ? Value.fromJSON(body) : null;

    return {
      body: parsedBody,
      initialValue: parsedBody,
      attachments,
      communityId: communityId || undefined,
    };
  }

  // eslint-disable-next-line react/sort-comp
  _getInitialValue(document, defaultValue) {
    const { isEdit, isArticle } = this.props;

    // try load draft
    const draftValue = this.tryLoadDraftInitialValue();

    if (draftValue) {
      return draftValue;
    }

    // if isEdit and document exists
    if (isEdit && document) {
      const data = convertDocumentToEditorValue(document);

      return {
        body: data.body,
        attachments: isArticle ? null : data.attachments || [],
      };
    }

    // if exists defaultValue
    if (defaultValue) {
      const data = convertDocumentToEditorValue(defaultValue);

      return {
        body: data.body,
        attachments: isArticle ? null : data.attachments || [],
      };
    }

    return {
      body: null,
      attachments: isArticle ? null : [],
    };
  }

  getDraftKey() {
    const { isEdit } = this.props;
    return `${this.constructor.DRAFT_KEY}${isEdit ? 'Edit' : ''}`;
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

  handleAttachRemove = id => {
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

    const { document, tags } = convertEditorValueToDocument(
      body,
      attachments,
      this.getEditorMode()
    );

    return this.handleSubmit({ document, tags });
  };

  tryLoadDraftInitialValue() {
    try {
      const draft = loadDraft(this.getDraftKey());

      if (draft) {
        const { community, contentId, isArticle } = this.props;

        if (community && draft.communityId && community.communityId !== draft.communityId) {
          return null;
        }

        if (contentId && formatContentId(contentId) !== draft.contentLink) {
          return null;
        }

        const parentLink = this.getParentCommentId();

        // Если это комментарий, то проверяем, от этого ли родителя у нас черновик.
        if (parentLink && parentLink !== draft.parentLink) {
          return null;
        }

        return {
          communityId: draft.communityId || null,
          body: draft.body,
          attachments: isArticle ? null : draft.attachments || [],
        };
      }
    } catch (err) {
      displayError('Draft loading failed', err);
    }

    return null;
  }

  removeDraft(key) {
    removeDraft(key || this.getDraftKey());
  }

  removeDraftAndStopSaving(key) {
    this.removeDraft(key);
    this.isStopDraftsSaving = true;
  }

  saveCurrentAsArticleDraft(articleDraftKey) {
    const { communityId, body, attachments } = this.state;

    const article = convertToArticle({ body, attachments });

    if (!article) {
      removeDraft(articleDraftKey);
      return;
    }

    saveDraft(
      {
        communityId,
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
