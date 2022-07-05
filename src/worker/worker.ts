export default () => {
  onmessage = async ({ data }) => {
    const canvasW = Math.min(48, data.width);
    const canvasH = canvasW * (data.width / data.height);
    // @ts-ignore
    const canvas = new OffscreenCanvas(data.width, data.height);
    const context = canvas.getContext("2d");
    const originalArea = [0, 0, data.width, data.height];
    const scaledArea = [0, 0, canvasW, canvasH];
    context.drawImage(data, ...originalArea, ...scaledArea);
    const { data: ctxData } = context.getImageData(0, 0, canvasW, canvasH);

    const colors = new Set<number>();
    const chunkSize = 4;
    for (let i = 0; i < ctxData.length; i += chunkSize) {
      const [r, g, b, a] = ctxData.slice(i, i + chunkSize) as number[];
      if (a === 0) continue;
      const { h } = rgbToHsl(r, g, b);
      const hue = Math.round(h * 100) / 100;
      if (colors.has(hue - 1) || colors.has(hue + 1)) continue;
      colors.add(Math.round(h * 100) / 100);
    }

    return postMessage(colors.size >= 3);
  };
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
    l = Math.round(l * 100);

    return { h: h as number, s, l };
  }
};
