import { useRef, useState, useEffect } from 'react';

/**
 * Visibility hook for functional components
 *
 * @export
 * @param {DOMNode reference} ref
 * @param {Object} [options={}]
 * @returns {boolean} isIntersecting
 */
export default function useVisibility(ref, options = { rootMargin: '0px' }) {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new window.IntersectionObserver(([entry]) => {
      // Update our state when observer callback fires
      setIntersecting(entry.isIntersecting);
    }, options);

    const nodeRef = ref.current;

    if (nodeRef) {
      observerRef.current.observe(nodeRef);
    }

    return () => {
      observerRef.current.unobserve(nodeRef);
    };
  }, [ref, options]); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}
