export function createBitmap(url: string) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const newWidth = Math.min(64, img.width);
        const newHeight = newWidth * (img.width / img.height);

        res(
          await createImageBitmap(img, 0, 0, img.width, img.height, {
            resizeWidth: newWidth,
            resizeHeight: newHeight,
            resizeQuality: "pixelated",
          }),
        );
      } catch (err) {
        rej(err);
      }
    };
    img.src = url;
  });
}
