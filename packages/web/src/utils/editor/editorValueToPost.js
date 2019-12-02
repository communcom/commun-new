/* eslint-disable import/prefer-default-export,no-plusplus */

import { EDITOR_VERSION } from 'shared/constants';

import { map } from './utils';

function sanitizeEmbed(embed) {
  // eslint-disable-next-line no-undef-init
  let attributes = undefined;

  if (embed.type === 'image' && embed.attributes && embed.attributes.description) {
    attributes = {
      description: embed.attributes.description,
    };
  }

  return {
    ...embed,
    attributes,
  };
}

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
              case 'tag': {
                const tag = text.replace(/^#/, '');

                ctx.tags.add(tag);

                return {
                  id: ++ctx.lastId,
                  type: 'tag',
                  content: tag,
                };
              }
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

export function convertEditorValueToDocument(value, attachments, documentType) {
  const content = [];
  let title;

  const ctx = { lastId: 1, tags: new Set() };

  const nodes = value?.document?.nodes;

  if (nodes) {
    for (let i = 0; i < nodes.size; i += 1) {
      const block = nodes.get(i);

      if (documentType === 'article' && block.type === 'heading1' && i === 0) {
        title = block.text;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (documentType === 'article') {
        switch (block.type) {
          case 'paragraph':
            content.push({
              id: ++ctx.lastId,
              type: 'paragraph',
              content: map(block.nodes, processEditorNode, ctx),
            });
            break;

          case 'embed': {
            const { embed } = block.data.toJSON();

            content.push({
              id: ++ctx.lastId,
              type: embed.type,
              content: embed.content,
            });
            break;
          }

          case 'image': {
            // eslint-disable-next-line no-undef-init
            let attributes = undefined;

            // eslint-disable-next-line prefer-const
            let { alt, src } = block.data.toJSON();

            if (alt) {
              alt = alt.trim();
            }

            if (alt) {
              attributes = {
                description: alt,
              };
            }

            content.push({
              id: ++ctx.lastId,
              type: 'image',
              content: src,
              attributes,
            });
            break;
          }

          default:
            // eslint-disable-next-line no-console
            console.warn('Invalid block type:', block);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (block.type === 'paragraph') {
          content.push({
            id: ++ctx.lastId,
            type: 'paragraph',
            content: map(block.nodes, processEditorNode, ctx),
          });
        }
      }
    }
  }

  if (
    (documentType === 'basic' || documentType === 'comment') &&
    attachments &&
    attachments.length
  ) {
    content.push({
      id: ++ctx.lastId,
      type: 'attachments',
      content: attachments.map(attach => sanitizeEmbed({ ...attach, id: ++ctx.lastId })),
    });
  }

  removeEmptyParagraphs(content);

  return {
    document: {
      id: 1,
      type: 'post',
      attributes: {
        version: EDITOR_VERSION,
        title,
        type: documentType,
      },
      content,
    },
    tags: [...ctx.tags.keys()],
  };
}
