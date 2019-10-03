/* eslint-disable import/prefer-default-export,no-plusplus */

import { map } from './utils';

function processEditorNode(node, ctx) {
  switch (node.object) {
    case 'text':
      return map(node.leaves, leaf => {
        const { text } = leaf;

        if (!text) {
          return undefined;
        }

        if (leaf.marks.size) {
          for (const { type } of leaf.marks) {
            switch (type) {
              case 'mention':
                return {
                  id: ++ctx.lastId,
                  type: 'mention',
                  content: text.replace(/^@/, ''),
                };
              case 'tag':
                return {
                  id: ++ctx.lastId,
                  type: 'tag',
                  content: text.replace(/^#/, ''),
                };
              default:
            }
          }
        }

        // Если ни один из типов не был найден, значит это просто текст.
        return {
          id: ++ctx.lastId,
          type: 'text',
          content: text,
        };
      });

    case 'inline':
      switch (node.type) {
        case 'link':
          return {
            id: ++ctx.lastId,
            type: 'link',
            content: node.text,
            attributes: {
              url: node.data.get('href'),
            },
          };
        default:
      }
      break;

    default:
  }

  return null;
}

function removeEmptyParagraphs(content) {
  for (let i = 0; i < content.length; i++) {
    const node = content[i];

    if (node.type === 'attachments') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (node.type === 'paragraph' && node.content.length === 0) {
      content.splice(i, 1);
      i--;
    } else {
      break;
    }
  }

  // Удаляем пустые параграфы в конце тела.
  for (let i = content.length - 1; i >= 0; i--) {
    const node = content[i];

    if (node.type === 'attachments') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (node.type === 'paragraph' && node.content.length === 0) {
      content.splice(i, 1);
    } else {
      break;
    }
  }
}

export function convertEditorValueToPost(value, attachments, postType) {
  const { nodes } = value.document;
  const content = [];
  let title;

  const ctx = { lastId: 1 };

  for (let i = 0; i < nodes.size; i += 1) {
    const block = nodes.get(i);

    if (block.type === 'heading1' && i === 0) {
      title = block.text;
    } else {
      switch (block.type) {
        case 'paragraph':
          content.push({
            id: ++ctx.lastId,
            type: 'paragraph',
            content: map(block.nodes, processEditorNode, ctx),
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

  removeEmptyParagraphs(content);

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
