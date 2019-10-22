import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';
import { closeInFeedEditor, setInFeedEditorSlotStatus } from 'store/actions/ui';

import InlineEditorSlot from './InlineEditorSlot';

export default connect(
  state => {
    const { isInlineEditorOpen, withPhoto } = uiSelector('editor')(state);

    return {
      isInlineEditorOpen,
      withPhoto,
    };
  },
  {
    setInFeedEditorSlotStatus,
    closeInFeedEditor,
  }
)(InlineEditorSlot);
