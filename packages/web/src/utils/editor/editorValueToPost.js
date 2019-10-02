/* eslint-disable import/prefer-default-export,no-plusplus */

import { map } from './utils';

function mapContent(nodes, callback, ctx) {
  const results = map(nodes, callback, ctx);

  if (Array.isArray(results) && results.length === 1 && results[0].type === 'text') {
    return results[0].content;
  }

  return results;
}

function processEditorNode(node, ctx) {
  switch (node.object) {
    case 'text':
      if (node.leaves) {
        return map(node.leaves, leaf => ({
          id: ++ctx.lastId,
          type: 'text',
          content: leaf.text,
        }));
      }

      return {
        id: ++ctx.lastId,
        type: 'text',
        content: node.text,
      };

    case 'inline':
      switch (node.type) {
        case 'link':
          return {
            id: ++ctx.lastId,
            type: 'link',
            content: mapContent(node.nodes, processEditorNode, ctx),
            attributes: {
              url: node.data.href,
            },
          };
        default:
      }
      break;

    default:
  }

  return null;
}

export function convertEditorValueToPost(value, attachments, postType) {
  const { nodes } = value.document;
  const content = [];
  let title;

  const ctx = { lastId: 1 };

  // TODO: Remove
  // eslint-disable-next-line no-console
  console.log('nodes', nodes);

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];

    if (node.type === 'heading1' && i === 0) {
      const inner = node.nodes[0];

      if (inner.leaves) {
        title = inner.leaves[0].text;
      } else {
        title = inner.text;
      }
    } else {
      switch (node.type) {
        case 'paragraph':
          content.push({
            id: ++ctx.lastId,
            type: 'paragraph',
            content: map(node.nodes, processEditorNode, ctx),
          });
          break;
        default:
      }
    }
  }

  if (attachments && attachments.length) {
    content.push({
      id: ++ctx.lastId,
      type: 'attachments',
      content: attachments.map(attach => ({ ...attach, id: ++ctx.lastId })),
    });
  }

  return {
    id: 1,
    type: 'post',
    attributes: {
      version: '1.0',
      title,
      type: postType,
    },
    content,
  };
}
