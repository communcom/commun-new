import { useState, useCallback } from 'react';

export default function useCommentInputState() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const openEdit = useCallback(() => setIsEditOpen(true), []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);

  const openReply = useCallback(() => setIsReplyOpen(true), []);
  const closeReply = useCallback(() => setIsReplyOpen(false), []);

  return {
    isEditOpen,
    openEdit,
    closeEdit,
    isReplyOpen,
    openReply,
    closeReply,
  };
}
