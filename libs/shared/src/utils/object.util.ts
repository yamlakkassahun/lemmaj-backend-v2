/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export class ObjectUtil {
  static transfromKeysAndValues(
    object: any,
    newKey: (key: string, value: any, keyList?: string[]) => string = (key) =>
      key,
    newValue: (
      key: string,
      value: any,
      keyList?: string[],
    ) => any | { key: string; value: any }[] = (key, value) => value,
    mergeKeyValue: (
      key: string,
      value: any,
      newKey: string,
      newValue: any,
      keyList?: string[],
    ) => { key: string; value: any; remove?: boolean } = (
      key,
      value,
      newKey,
      newValue,
    ) => ({
      key: newKey,
      value: newValue,
    }),
    keyList: string[] = [],
  ): any {
    if (
      !object ||
      typeof object !== 'object' ||
      Object.keys(object).length === 0
    ) {
      return object;
    }

    const acc = {};

    for (const key of Object.keys(object)) {
      let val = object[key];

      if (val && typeof val === 'object') {
        if (!Array.isArray(val)) {
          keyList.push(key);
          val = this.transfromKeysAndValues(
            val,
            newKey,
            newValue,
            mergeKeyValue,
            keyList,
          );
          keyList.pop();
        } else {
          const items: any[] = [];
          keyList.push(key);
          for (const item of val) {
            items.push(
              this.transfromKeysAndValues(
                item,
                newKey,
                newValue,
                mergeKeyValue,
                keyList,
              ),
            );
          }
          keyList.pop();
          val = items;
        }
      }

      const newKeyResult = newKey(key, val, keyList);
      const newValueResult = newValue(key, val, keyList);

      if (newKeyResult) {
        if (Object.keys(acc).includes(newKeyResult)) {
          const {
            key: resolvedKey,
            value: resolvedValue,
            remove,
          } = mergeKeyValue(
            key,
            acc[newKeyResult],
            newKeyResult,
            newValueResult,
            keyList,
          );
          if (remove) {
            delete acc[newKeyResult];
          }
          acc[resolvedKey] = resolvedValue;
        } else {
          acc[newKeyResult] = newValueResult;
        }
      } else if (Array.isArray(newValueResult)) {
        for (const newResult of newValueResult) {
          if (!newResult.key || !newResult.value) {
            continue;
          }
          if (Object.keys(acc).includes(newResult.key)) {
            const {
              key: resolvedKey,
              value: resolvedValue,
              remove,
            } = mergeKeyValue(
              key,
              acc[newResult.key],
              newResult.key,
              newResult.value,
              keyList,
            );
            if (remove) {
              delete acc[newResult.key];
            }
            acc[resolvedKey] = resolvedValue;
          } else {
            acc[newResult.key] = newResult.value;
          }
        }
      }
    }

    return acc;
  }

  static async transfromKeysAndValuesAsync(
    object: any,
    newKey: (
      key: string,
      value: any,
      keyList?: string[],
    ) => Promise<string> = async (key) => key,
    newValue: (
      key: string,
      value: any,
      keyList?: string[],
    ) => Promise<any | { key: string; value: any }[]> = async (key, value) =>
        value,
    mergeKeyValue: (
      key: string,
      value: any,
      newKey: string,
      newValue: any,
      keyList?: string[],
    ) => Promise<{ key: string; value: any; remove?: boolean }> = async (
      key,
      value,
      newKey,
      newValue,
    ) => ({
      key: newKey,
      value: newValue,
    }),
    keyList: string[] = [],
  ): Promise<any> {
    if (
      !object ||
      typeof object !== 'object' ||
      Object.keys(object).length === 0
    ) {
      return object;
    }

    const acc = {};

    for (const key of Object.keys(object)) {
      let val = object[key];

      if (val && typeof val === 'object') {
        if (!Array.isArray(val)) {
          keyList.push(key);
          val = await this.transfromKeysAndValuesAsync(
            val,
            newKey,
            newValue,
            mergeKeyValue,
            keyList,
          );
          keyList.pop();
        } else {
          const items: any[] = [];
          keyList.push(key);
          for (const item of val) {
            items.push(
              await this.transfromKeysAndValuesAsync(
                item,
                newKey,
                newValue,
                mergeKeyValue,
                keyList,
              ),
            );
          }
          keyList.pop();
          val = items;
        }
      }

      const newKeyResult = await newKey(key, val, keyList);
      const newValueResult = await newValue(key, val, keyList);

      if (newKeyResult) {
        if (Object.keys(acc).includes(newKeyResult)) {
          const {
            key: resolvedKey,
            value: resolvedValue,
            remove,
          } = await mergeKeyValue(
            key,
            acc[newKeyResult],
            newKeyResult,
            newValueResult,
            keyList,
          );
          if (remove) {
            delete acc[newKeyResult];
          }
          acc[resolvedKey] = resolvedValue;
        } else {
          acc[newKeyResult] = newValueResult;
        }
      } else if (Array.isArray(newValueResult)) {
        for (const newResult of newValueResult) {
          if (!newResult.key || !newResult.value) {
            continue;
          }
          if (Object.keys(acc).includes(newResult.key)) {
            const {
              key: resolvedKey,
              value: resolvedValue,
              remove,
            } = await mergeKeyValue(
              key,
              acc[newResult.key],
              newResult.key,
              newResult.value,
              keyList,
            );
            if (remove) {
              delete acc[newResult.key];
            }
            acc[resolvedKey] = resolvedValue;
          } else {
            acc[newResult.key] = newResult.value;
          }
        }
      }
    }

    return acc;
  }

  static nestedKeys(
    object: any,
    excludeKeys: string[] = [],
    onObject?: (key: string, value: any, keys: string[]) => void,
    onArray?: (key: string, value: any, keys: string[]) => void,
  ): string[] {
    if (
      !object ||
      typeof object !== 'object' ||
      Object.keys(object).length === 0
    ) {
      return [];
    }

    const keys: string[] = [];

    for (const [key, value] of Object.entries(object)) {
      if (!excludeKeys.includes(key)) {
        keys.push(key);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        keys.push(
          ...this.nestedKeys(value, excludeKeys, onObject)
            .filter((k) => !excludeKeys.includes(k))
            .map((k) => (!excludeKeys.includes(key) ? `${key}.${k}` : k)),
        );
        onObject?.(key, value, keys);
      } else if (value && Array.isArray(value)) {
        for (const subValue of value) {
          keys.push(
            ...this.nestedKeys(subValue, excludeKeys, onObject)
              .filter((k) => !excludeKeys.includes(k))
              .map((k) => (!excludeKeys.includes(key) ? `${key}.${k}` : k)),
          );
        }
        onArray?.(key, value, keys);
      }
    }

    return keys;
  }

  static duplicate<T>(object: any): T {
    return Object.assign(
      Object.create(Object.getPrototypeOf(object)),
      object,
    ) as T;
  }

  static pruneNullAndUndefined(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map(ObjectUtil.pruneNullAndUndefined)
        .filter((value) => value !== null && value !== undefined);

      return cleanedArray.length > 0 ? cleanedArray : null;
    }

    const cleanedObject: any = {};

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = ObjectUtil.pruneNullAndUndefined(obj[key]);

        if (value !== null && value !== undefined) {
          cleanedObject[key] = value;
        }
      }
    }

    return Object.keys(cleanedObject).length === 0 ? null : cleanedObject;
  }

  static deepMerge<T>(target: T, source: Partial<T>): T {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      // If source value is an object, recursively merge, otherwise just assign
      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue)
      ) {
        target[key] = this.deepMerge(targetValue || {}, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    }
    return target;
  }
}

export const stripImagesPrefix = (filePath?: string) => {
  return filePath?.replace(/^images\//, '');
}