// eslint-disable-next-line import/no-extraneous-dependencies
import Placeholder from 'slate-react-placeholder';
// import Placeholder from 'rich-html-editor/lib/plugins/Placeholder';
import PasteLink from '../plugins/PasteLink';

const createPlugins = ({ handleLink }) => [
  Placeholder({
    placeholder: 'Add a comment...',
    when: (editor, node) => {
      if (editor.readOnly) return false;
      if (node.object !== 'block') return false;
      if (node.type !== 'paragraph') return false;
      if (node.text !== '') return false;
      if (editor.value.document.getDepth(node.key) !== 1) return false;
      if (editor.value.document.getBlocks().size > 1) return false;
      return true;
    },
  }),
  PasteLink(handleLink),
];

export default createPlugins;
