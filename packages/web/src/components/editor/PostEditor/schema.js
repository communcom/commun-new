/* eslint-disable consistent-return,import/no-extraneous-dependencies */
import { clone } from 'ramda';
import { Block } from 'slate';
import { schema as originalSchema } from 'rich-html-editor';

const schema = clone(originalSchema);

// add rules to the schema to ensure the first node is a heading
schema.document.nodes.unshift({ match: { type: 'heading1' }, min: 1, max: 1 });
schema.document.normalize = (editor, { code, node, child, index }) => {
  switch (code) {
    case 'child_max_invalid': {
      const type = index === 0 ? 'heading1' : 'paragraph';
      return editor.setNodeByKey(child.key, type);
    }
    case 'child_min_invalid': {
      const missingTitle = index === 0;
      const firstNode = editor.value.document.nodes.get(0);
      if (!firstNode) {
        editor.insertNodeByKey(node.key, 0, Block.create('heading1'));
      } else {
        editor.setNodeByKey(firstNode.key, { type: 'heading1' });
      }

      const secondNode = editor.value.document.nodes.get(1);
      if (!secondNode) {
        editor.insertNodeByKey(node.key, 1, Block.create('paragraph'));
      } else {
        editor.setNodeByKey(secondNode.key, { type: 'paragraph' });
      }

      if (missingTitle) {
        setImmediate(() => editor.moveFocusToStartOfDocument());
      }

      return editor;
    }
    default:
  }
};

export default schema;
