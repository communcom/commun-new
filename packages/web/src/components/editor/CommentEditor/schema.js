/* eslint-disable consistent-return,import/no-extraneous-dependencies */
import { clone } from 'ramda';
import { Block } from 'slate';
import { schema as originalSchema } from 'commun-editor';

const schema = clone(originalSchema);

// add rules to the schema to ensure the first node is a heading
schema.document.normalize = (editor, { code, node, child, index }) => {
  if (code === 'child_type_invalid') {
    return editor.setNodeByKey(child.key, 'paragraph');
  }

  if (code === 'child_min_invalid') {
    const block = Block.create('paragraph');
    return editor.insertNodeByKey(node.key, index, block);
  }
};

export default schema;
