export default function PasteLink(handleLink) {
  return {
    normalizeNode(node, editor, next) {
      if (
        !handleLink ||
        node.type === 'block' ||
        node.type !== 'link' ||
        node.text !== node.data.get('href')
      ) {
        return next();
      }

      handleLink(node);
      return next();
    },
  };
}
