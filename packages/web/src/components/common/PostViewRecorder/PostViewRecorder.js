import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { contentIdType } from 'types';
import { useVisibility } from 'utils/hooks';
import { recordPostView } from 'store/actions/gate';

const THRESHOLD_SIZE = 0.25;
const THRESHOLD_TIME = 3000;

export default function PostViewRecorder({ viewportRef, contentId, onChange }) {
  const dispatch = useDispatch();
  const isVisible = useVisibility(viewportRef, { threshold: THRESHOLD_SIZE });
  const recordTimeoutRef = useRef(null);

  function clear() {
    clearTimeout(recordTimeoutRef.current);
    recordTimeoutRef.current = null;
  }

  // memoized dispatch of recordPostView
  const recordPost = useCallback(() => {
    try {
      dispatch(recordPostView(contentId));
      onChange(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }, [contentId, dispatch, onChange]);

  // clear on unmount
  useEffect(
    () => () => {
      clear();
    },
    []
  );

  // check timeout
  useEffect(() => {
    // if visible but hasn't timeout
    if (isVisible && !recordTimeoutRef.current) {
      recordTimeoutRef.current = setTimeout(recordPost, THRESHOLD_TIME);
    }

    // if invisible but has timeout
    if (!isVisible && recordTimeoutRef.current) {
      clear();
    }
  }, [isVisible, recordTimeoutRef, recordPost]);

  return null;
}

PostViewRecorder.propTypes = {
  viewportRef: PropTypes.shape({ current: PropTypes.any }),
  contentId: contentIdType.isRequired,
  onChange: PropTypes.func.isRequired,
};
