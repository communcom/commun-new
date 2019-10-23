/* eslint-disable import/prefer-default-export,no-continue */
import { map, mapObjIndexed } from 'ramda';

/**
 * @param {Object} baseEntities
 * @param {Object} newEntities
 * @param {Function} [transform] - Функция для трансформации объекта перед попаданием в merge, вызывает даже если merge не объявлен.
 * @param {true|Function<new,old>} [merge] - Если передать true вместо функции, то будет использован shallow merge.
 * @returns {Object}
 */
export function mergeEntities(baseEntities, newEntities, { transform, merge } = {}) {
  let newItems = newEntities;

  if (transform) {
    newItems = map(transform, newItems);
  }

  if (merge) {
    newItems = mapObjIndexed((newItem, id) => {
      const cachedItem = baseEntities[id];

      if (cachedItem) {
        // Если передать true вместо функции, то будет использован shallow merge
        if (merge === true) {
          const updated = {
            ...cachedItem,
          };
          let isUpdated = false;

          for (const [key, value] of Object.entries(newItem)) {
            // Пропускаем поля со значением undefined
            if (value === undefined) {
              continue;
            }

            updated[key] = value;
            isUpdated = true;
          }

          if (!isUpdated) {
            return cachedItem;
          }

          return updated;
        }

        return merge(newItem, cachedItem);
      }

      return newItem;
    }, newItems);
  }

  return { ...baseEntities, ...newItems };
}
