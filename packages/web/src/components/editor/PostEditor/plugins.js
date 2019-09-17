import Placeholder from 'rich-html-editor/lib/plugins/Placeholder';
import PasteLink from '../plugins/PasteLink';

const createPlugins = ({ handleLink }) => [
  Placeholder({
    placeholder: 'Title',
    when: (editor, node) => {
      if (editor.readOnly) return false;
      if (node.object !== 'block') return false;
      if (node.type !== 'heading1') return false;
      if (node.text !== '') return false;
      if (editor.value.document.nodes.first() !== node) return false;
      return true;
    },
  }),
  Placeholder({
    placeholder: 'Enter text...',
    when: (editor, node) => {
      if (editor.readOnly) return false;
      if (node.object !== 'block') return false;
      if (node.type !== 'paragraph') return false;
      if (node.text !== '') return false;
      if (editor.value.document.getDepth(node.key) !== 1) return false;
      return true;
    },
  }),
  PasteLink(handleLink),
];

export default createPlugins;
