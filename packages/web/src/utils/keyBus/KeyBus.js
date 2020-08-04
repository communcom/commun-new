import last from 'ramda/src/last';

const layers = [];

export default class KeyBus {
  callbacks = [];

  constructor() {
    layers.push(this);
  }

  on = callback => {
    this.callbacks.push(callback);
  };

  off = callback => {
    const callbackIndex = this.callbacks.lastIndexOf(callback);

    if (callbackIndex !== -1) {
      this.callbacks.splice(callbackIndex, 1);
    }
  };

  emit(e) {
    for (const callback of this.callbacks) {
      callback(e);

      if (e.isDefaultPrevented) {
        break;
      }
    }
  }

  destroy() {
    const layerIndex = layers.indexOf(this);

    if (layerIndex !== -1) {
      layers.splice(layerIndex, 1);
    }
  }
}

if (process.browser) {
  window.addEventListener('keydown', e => {
    const topLayer = last(layers);

    if (topLayer) {
      topLayer.emit(e);
    }
  });
}
