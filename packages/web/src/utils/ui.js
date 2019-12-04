/* eslint-disable import/prefer-default-export,func-names */

export const getScrollbarWidth = (function() {
  let scrollElement = null;

  return function() {
    if (scrollElement === null) {
      const containerDiv = document.createElement('div');

      containerDiv.innerHTML = `
        <div style="position: absolute; top: -200px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;"></div>
      `;

      scrollElement = containerDiv.firstElementChild;
      document.body.appendChild(scrollElement);
    }

    return scrollElement.offsetWidth - scrollElement.clientWidth;
  };
})();

export function setScrollRestoration(type) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = type;
  }
}

export function getScrollContainer(element) {
  if (element && element.closest) {
    const container = element.closest('.scroll-container');

    if (container) {
      return container;
    }
  }

  if (document.scrollingElement) {
    return document.scrollingElement;
  }

  return window;
}

export function scrollTo(element) {
  if (element.scrollIntoViewIfNeeded) {
    element.scrollIntoViewIfNeeded();
  }

  element.scrollIntoView();
}
