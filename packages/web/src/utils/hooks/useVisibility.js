/* eslint-disable consistent-return */
import { useRef, useState, useEffect } from 'react';

/**
 * Visibility hook for functional components
 *
 * @export
 * @param {DOMNode reference} ref
 * @param {Object} [options={}]
 * @param {boolean} [once]
 * @returns {boolean} isIntersecting
 */
export default function useVisibility(ref, options = { rootMargin: '0px' }, once) {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new window.IntersectionObserver(([entry]) => {
      // Update our state when observer callback fires
      setIntersecting(entry.isIntersecting);

      if (entry.target && entry.isIntersecting && once) {
        observerRef.current.unobserve(entry.target);
      }
    }, options);

    const nodeRef = ref.current;

    if (nodeRef) {
      observerRef.current.observe(nodeRef);

      // nodeRef should exist for unobserve function
      return () => {
        observerRef.current.unobserve(nodeRef);
      };
    }
  }, [ref, options, once]); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}
