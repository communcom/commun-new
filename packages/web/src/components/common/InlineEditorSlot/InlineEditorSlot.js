import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import CreatePostInline from 'components/common/CreatePostInline';

export default function InlineEditorSlot({
  isInlineEditorOpen,
  withPhoto,
  closeInFeedEditor,
  setInFeedEditorSlotStatus,
}) {
  useEffect(() => {
    setInFeedEditorSlotStatus(true);

    return () => {
      setInFeedEditorSlotStatus(false);
    };
  }, []);

  if (isInlineEditorOpen) {
    return <CreatePostInline withPhoto={withPhoto} onClose={closeInFeedEditor} />;
  }

  return null;
}

InlineEditorSlot.propTypes = {
  isInlineEditorOpen: PropTypes.bool.isRequired,
  withPhoto: PropTypes.bool.isRequired,
  closeInFeedEditor: PropTypes.func.isRequired,
  setInFeedEditorSlotStatus: PropTypes.func.isRequired,
};
