export default () => {
  onmessage = async ({ data: { bitmap, src } }) => {
    const canvasW = Math.min(48, bitmap.width);
    const canvasH = canvasW * (bitmap.width / bitmap.height);
    // @ts-ignore
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d");
    const originalArea = [0, 0, bitmap.width, bitmap.height];
    const scaledArea = [0, 0, canvasW, canvasH];
    context.drawImage(bitmap, ...originalArea, ...scaledArea);
    const { data: ctxData } = context.getImageData(0, 0, canvasW, canvasH);

    const colors = new Set<string>();
    // const lightness: number[] = [];
    const chunkSize = 4;
    for (let i = 0; i < ctxData.length; i += chunkSize) {
      const [r, g, b, a] = ctxData.slice(i, i + chunkSize) as number[];
      if (a === 0) continue;
      const { h, s, l } = rgbToHsl(r, g, b);
      // lightness.push(l);
      if (noSimilar(colors, h, s, l)) colors.add(`${h}-${s}-${l}`);
    }

    // const avgLightness = lightness.reduce((a, b) => a + b) / lightness.length;
    console.info(`🔥 colors`, { src, colors });
    const colorful = colors.size > 3;
    return postMessage({ src, colorful });
  };

  function noSimilar(colors: Set<string>, h: number, s: number, l: number) {
    const hasSimilar = [...colors].some((textColor) => {
      const [iH, iS] = textColor.split("-").map(Number);
      const aroundH = iH > h - 8 && iH < h + 8;
      const aroundS = iS > s - 8 && iS < s + 8;
      return s < 8 ? aroundS : aroundH && aroundS;
    });
    return !hasSimilar;
  }

  function rgbToHsl(r: number, g: number, b: number) {
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      // @ts-ignore
      h /= 6;
    }

    return {
      h: Math.round((h as number) * 100),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
};
