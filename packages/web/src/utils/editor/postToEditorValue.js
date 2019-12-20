/* eslint-disable import/prefer-default-export */

import { map } from './utils';

function processNode(node) {
  switch (node.type) {
    case 'text':
      return {
        object: 'text',
        text: node.content,
      };
    case 'mention':
      return {
        object: 'text',
        text: `@${node.content}`,
        marks: [
          {
            object: 'mark',
            type: 'mention',
          },
        ],
      };
    case 'tag':
      return {
        object: 'text',
        text: `#${node.content}`,
        marks: [
          {
            object: 'mark',
            type: 'tag',
          },
        ],
      };
    case 'link':
      return {
        object: 'inline',
        type: 'link',
        data: {
          href: node.attributes.url,
        },
        nodes: [
          {
            object: 'text',
            text: node.content,
          },
        ],
      };
    default:
      return null;
  }
}

export function convertDocumentToEditorValue(doc) {
  const title = doc?.attributes?.title;

  const nodes = [];
  let attachments = null;

  if (title) {
    nodes.push({
      object: 'block',
      type: 'heading1',
      nodes: [
        {
          object: 'text',
          text: title,
        },
      ],
    });
  }

  for (const node of doc.content) {
    switch (node.type) {
      case 'paragraph':
        nodes.push({
          object: 'block',
          type: 'paragraph',
          nodes: map(node.content, processNode),
        });
        break;

      case 'image':
        nodes.push({
          object: 'block',
          type: 'image',
          data: {
            src: node.content,
            alt: node.attributes.description || '',
            loading: false,
          },
          nodes: [],
        });
        break;

      case 'website':
      case 'video':
        nodes.push({
          object: 'block',
          type: 'embed',
          data: {
            embed: node,
          },
          nodes: [],
        });
        break;

      case 'attachments':
        attachments = node.content;
        break;

      default:
    }
  }

  return {
    body: {
      document: {
        nodes,
      },
    },
    attachments,
  };
}
