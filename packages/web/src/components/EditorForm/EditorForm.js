/* eslint-disable class-methods-use-this,react/no-unused-state,react/prop-types */

import { Component } from 'react';
import throttle from 'lodash.throttle';

import { validateAndUpload } from 'utils/uploadImage';
import { displayError } from 'utils/toastsMessages';
import {
  EMPTY_VALUE,
  convertPostToEditorValue,
  convertEditorValueToPost,
  loadDraft,
  saveDraft,
  removeDraft,
} from 'utils/editor';
import { formatContentId } from 'store/schemas/gate';

export default class EditorForm extends Component {
  saveDraft = throttle(() => {
    const { contentId } = this.props;
    const { body, attachments } = this.state;

    saveDraft(
      {
        permlink: contentId ? formatContentId(contentId) : null,
        body,
        attachments,
      },
      this.constructor.DRAFT_KEY
    );
  }, 3000);

  componentWillUnmount() {
    this.saveDraft.flush();
  }

  getInitialValue(entity) {
    const { isEdit } = this.props;

    if (isEdit && entity) {
      const data = convertPostToEditorValue(entity);

      return {
        initialValue: data.body,
        attachments: data.attachments,
      };
    }

    try {
      const draft = loadDraft(this.constructor.DRAFT_KEY);

      if (draft) {
        const { contentId } = this.props;

        // Если это комментарий, то проверяем, от этого ли родителя у нас черновик.
        if (!contentId || formatContentId(contentId) === draft.permlink) {
          return {
            initialValue: draft.body,
            attachments: draft.attachments,
          };
        }
      }
    } catch (err) {
      displayError('Draft loading failed', err);
    }

    return {
      initialValue: EMPTY_VALUE,
      attachments: [],
    };
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

    if (file) {
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
    }
  };

  post = () => {
    const { body, attachments, editorMode } = this.state;

    const data = convertEditorValueToPost(body.toJSON(), attachments, editorMode);

    this.handleSubmit(data);
  };

  removeDraft() {
    removeDraft(this.constructor.DRAFT_KEY);
  }
}
