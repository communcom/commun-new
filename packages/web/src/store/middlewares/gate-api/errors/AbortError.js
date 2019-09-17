export default class AbortError extends Error {
  constructor(message) {
    super(message || 'AbortError');

    // Возвращаем флаг enumerable обратно в true, чтобы JSON.stringify не отбрасывал это поле
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: this.message,
    });
  }
}
