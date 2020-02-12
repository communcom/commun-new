/* eslint-disable no-console */
import fetch from 'isomorphic-unfetch';
import ToastsManager from 'toasts-manager';
import exif from 'exif-js';

import {
  MAX_UPLOAD_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  IMG_HOSTING_URL,
} from 'shared/constants/common';

const MAX_SIDE_SIZE = 1920;
const MAX_UPLOAD_SIZE = Math.min(MAX_UPLOAD_FILE_SIZE, 2 * 1024 * 1024);
const DEFAULT_QUALITY = 0.7;

export async function uploadImage(file) {
  if (!file) {
    throw new Error('No file');
  }

  const formData = new FormData();

  formData.append('file', file);

  const result = await fetch(`${IMG_HOSTING_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await result.json();

  return data.url;
}

export async function uploadImageSafe(file) {
  try {
    return await uploadImage(file);
  } catch (err) {
    console.error(err);
    ToastsManager.error('Image uploading failed:', err.message);
  }

  return null;
}

function validateImageType(file) {
  if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    ToastsManager.error('Please insert only image files');
    return false;
  }

  return true;
}

function validateImageSize(file) {
  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    ToastsManager.error(
      `Too big file, max allowed size is ${Math.floor(MAX_UPLOAD_FILE_SIZE / (1024 * 1024))} MB`
    );
    return false;
  }

  return true;
}

export function validateImageFile(file) {
  return validateImageType(file) && validateImageSize(file);
}

function getOrientation(file) {
  return new Promise(resolve => {
    exif.getData(file, function() {
      resolve(exif.getTag(this, 'Orientation') || 0);
    });
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const blobUrl = URL.createObjectURL(file);

    const img = new window.Image();

    img.addEventListener('load', () => {
      resolve(img);
    });

    img.addEventListener('error', err => {
      reject(err);
    });

    img.src = blobUrl;
  });
}

function canvasToBlob(canvas, mimeType) {
  return new Promise(resolve => {
    canvas.toBlob(
      blob => {
        resolve(blob);
      },
      mimeType,
      DEFAULT_QUALITY
    );
  });
}

async function resizeImage(file) {
  const orientation = await getOrientation(file);

  const img = await loadImage(file);

  const { width, height } = img;

  let needResize = false;
  let forceType = null;
  let resizeRatio = 1;

  if (width > MAX_SIDE_SIZE || height > MAX_SIDE_SIZE) {
    if (width > MAX_SIDE_SIZE) {
      resizeRatio = MAX_SIDE_SIZE / width;
    }

    if (height * resizeRatio > MAX_SIDE_SIZE) {
      resizeRatio = MAX_SIDE_SIZE / height;
    }

    needResize = true;
  } else if (file.size > MAX_UPLOAD_SIZE) {
    forceType = 'image/jpeg';
  }

  if (!needResize && !forceType) {
    return file;
  }

  const newWidth = Math.round(width * resizeRatio);
  const newHeight = Math.round(height * resizeRatio);

  const canvas = document.createElement('canvas');

  if (orientation && orientation >= 5 && orientation <= 8) {
    canvas.width = newHeight;
    canvas.height = newWidth;
  } else {
    canvas.width = newWidth;
    canvas.height = newHeight;
  }

  const ctx = canvas.getContext('2d');

  ctx.scale(resizeRatio, resizeRatio);

  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break;
  }

  ctx.drawImage(img, 0, 0);

  const type = forceType || file.type;

  let blob = await canvasToBlob(canvas, type);

  // if after resizing size anyway exceed the limit then save to jpeg.
  if (blob.size > MAX_UPLOAD_SIZE && type !== 'image/jpeg') {
    blob = await canvasToBlob(canvas, 'image/jpeg');
  }

  return blob;
}

export async function validateAndUpload(file) {
  if (!validateImageType(file)) {
    return null;
  }

  let uploadFile = file;

  try {
    if (file.type !== 'image/gif') {
      uploadFile = await resizeImage(file);
    }
  } catch (err) {
    console.error('Image resizing is failed:', err);
  }

  if (!validateImageSize(uploadFile)) {
    return null;
  }

  return uploadImageSafe(uploadFile);
}
