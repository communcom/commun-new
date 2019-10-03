/* eslint-disable no-cond-assign */

const MENTION_RX = /(?<=^|[,.\b\s])@[a-z0-9]+\b/g;
const TAG_RX = /(?<=^|[,.\b\s])#[a-z0-9]+\b/g;

export default {
  onChange: (editor, next) => {
    const { document } = editor.value;

    editor.value.texts.forEach(textNode => {
      const { text } = textNode;

      if (!text) {
        return;
      }

      if (textNode.getMarks().some(mark => mark.type === 'mention' || mark.type === 'tag')) {
        const range = document.createRange().moveToRangeOfNode(textNode);

        editor.removeMarkAtRange(range, 'mention');
        editor.removeMarkAtRange(range, 'tag');
      }

      let match;

      while ((match = MENTION_RX.exec(text))) {
        const range = document
          .createRange()
          .moveStartTo(textNode.key, match.index)
          .moveEndTo(textNode.key, match.index + match[0].length);

        editor.addMarkAtRange(range, 'mention');
      }

      while ((match = TAG_RX.exec(text))) {
        const range = document
          .createRange()
          .moveStartTo(textNode.key, match.index)
          .moveEndTo(textNode.key, match.index + match[0].length);

        editor.addMarkAtRange(range, 'tag');
      }
    });

    return next();
  },
};
