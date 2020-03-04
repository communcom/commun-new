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

export function fancyScrollTo(elem) {
  const scrollBox = getScrollContainer();

  const { top, height, bottom } = elem.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (top < 100 || bottom > windowHeight - 50) {
    const center = top + height / 2;
    const delta = Math.round(windowHeight / 2 - center);

    scrollBox.scrollTo({
      top: scrollBox.scrollTop - delta,
      behavior: 'smooth',
    });
  }
}
