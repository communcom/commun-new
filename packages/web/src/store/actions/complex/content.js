/* eslint-disable no-param-reassign */
import { createmssg, updatemssg, deletemssg } from 'store/actions/commun/publish';

export const createPost = ({ permlink, title, body, resources }) => {
  const data = {
    message_id: {
      permlink,
    },
    headermssg: title,
    bodymssg: body,
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      embeds: resources,
    });
  }

  return createmssg(data);
};

export const updatePost = ({ contentId, title, body, resources }) => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: title,
    bodymssg: body,
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      embeds: resources,
    });
  }

  return updatemssg(data);
};

export const createComment = ({ contentId, body, resources }) => {
  const data = {
    message_id: {
      permlink: `re-${contentId.permlink}-${Date.now()}`,
    },
    parent_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    bodymssg: body,
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      embeds: resources,
    });
  }

  return createmssg(data);
};

export const updateComment = ({ contentId, body, resources }) => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: '',
    bodymssg: body,
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      embeds: resources,
    });
  }

  return updatemssg(data);
};

export const deleteComment = (contentId, postContentId) => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return deletemssg(data, postContentId);
};
