/* eslint-disable import/prefer-default-export, func-names */
import EXIF from 'exif-js';

export function getImageRotationByExif(image) {
  return new Promise(resolve => {
    if (!image || image.type !== 'image/jpeg') {
      resolve(0);
      return;
    }

    EXIF.getData(image, function() {
      const orientation = EXIF.getTag(this, 'Orientation');
      let rotatePic = 0;

      switch (orientation) {
        case 8:
          rotatePic = 270;
          break;
        case 6:
          rotatePic = 90;
          break;
        case 3:
          rotatePic = 180;
          break;
        default:
          rotatePic = 0;
      }

      resolve(rotatePic);
    });
  });
}
