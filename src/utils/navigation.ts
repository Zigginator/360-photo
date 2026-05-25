/**
 * Gets the index of the next photo in a circular array
 * @param currentIndex Current photo index
 * @param totalPhotos Total number of photos
 * @returns Index of the next photo
 */
export const getNextPhotoIndex = (currentIndex: number, totalPhotos: number): number => {
  return (currentIndex + 1) % totalPhotos;
};

/**
 * Gets the index of the previous photo in a circular array
 * @param currentIndex Current photo index
 * @param totalPhotos Total number of photos
 * @returns Index of the previous photo
 */
export const getPreviousPhotoIndex = (currentIndex: number, totalPhotos: number): number => {
  return (currentIndex - 1 + totalPhotos) % totalPhotos;
};
