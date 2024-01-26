import LZ from 'lz-string';
import {createTransform} from 'redux-persist';
import stringify from 'json-stringify-safe';

const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'production';

export function createTransformCompress(config) {
  return createTransform(
    state => LZ.compressToUTF16(stringify(state)),
    state => {
      if (typeof state !== 'string') {
        if (NODE_ENV !== 'production') {
          console.error(
            'redux-persist-transform-compress: expected outbound state to be a string',
          );
        }
        return state;
      }

      try {
        return JSON.parse(LZ.decompressFromUTF16(state));
      } catch (err) {
        if (NODE_ENV !== 'production') {
          console.error(
            'redux-persist-transform-compress: error while decompressing state',
            err,
          );
        }
        return null;
      }
    },
    config,
  );
}
