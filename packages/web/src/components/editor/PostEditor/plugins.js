import Placeholder from 'commun-editor/lib/plugins/Placeholder';

import PasteLink from '../plugins/PasteLink';
import markify from '../plugins/markify';

export default function createPlugins({ handleLink, titlePlaceholder = null, placeholder = null }) {
  const plugins = [];

  plugins.push(markify);

  if (titlePlaceholder) {
    plugins.push(
      Placeholder({
        placeholder: titlePlaceholder,
        when: (editor, node) =>
          !editor.readOnly &&
          node.object === 'block' &&
          node.type === 'heading1' &&
          node.text === '' &&
          editor.value.document.nodes.first() === node,
      })
    );
  }

  if (placeholder) {
    plugins.push(
      Placeholder({
        placeholder,
        when: (editor, node) =>
          !editor.readOnly &&
          node.object === 'block' &&
          node.type === 'paragraph' &&
          node.text === '' &&
          editor.value.document.getBlocks().size <= 1,
      })
    );
  }

  plugins.push(PasteLink(handleLink));

  return plugins;
}
