const helpers = (() => {
  const rgbaRx = /rgba?\(.*\)/;

  function makeColor(rgbaString) {
    return {
      get isOk() {
        return rgbaRx.test(rgbaString) && this.hsla.a > 0.1;
      },
      get isLight() {
        const { l, a } = this.hsla;
        return l >= 50 && a >= 0.9;
      },
      get isDark() {
        const { l, a } = this.hsla;
        return l <= 30 && a >= 0.9;
      },
      get hsla() {
        const { r, g, b, a } = this.rgba;
        const { h, s, l } = rgbToHsl(r, g, b);
        return { h, s, l, a };
      },
      get light() {
        const { h, s, l, a } = this.hsla;
        const newL = l < 50 ? 100 - l : l;
        return { h, s, l: newL, a };
      },
      get dark() {
        const { h, s, l, a } = this.hsla;
        const newL = l > 50 ? 100 - l : l;
        return { h, s, l: newL, a };
      },
      get rgba() {
        return rgbaAsArrayOfString(rgbaString);
      },
    };
  }

  function hslaToString({ h, s, l, a }) {
    console.info(`🔥  l`, l);
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  function rgbToHsl(r, g, b) {
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
      h /= 6;
    }
    l = Math.round(l * 100);
    return { h, s, l };
  }

  function rgbaAsArrayOfString(rgbString) {
    const [r, g, b, a = "1"] = rgbString
      .replace(/ /g, "")
      .replace(/rgba?/g, "")
      .replace(/[()]/g, "")
      .split(",");
    return { r, g, b, a };
  }

  function isVisible($element) {
    return !!(
      $element.offsetWidth ||
      $element.offsetHeight ||
      $element.getClientRects().length
    );
  }

  function getColor(
    $element,
    propName = "backgroundColor",
    styles = getComputedStyle($element),
  ) {
    const [rgbString] = styles[propName].match(rgbaRx);
    return makeColor(rgbString);
  }

  function getArea($element) {
    const rectangle = $element.getBoundingClientRect();
    return rectangle.width * rectangle.height;
  }

  function waitForBody() {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations_list) => {
        mutations_list.forEach((mutation) => {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode.tagName !== "BODY") return;
            observer.disconnect();
            resolve();
          });
        });
      });
      observer.observe(document.documentElement, { childList: true });
    });
  }

  const storeLense = (hostname) => ({
    get() {
      return new Promise((res) =>
        chrome.storage.sync.get([hostname], (store) =>
          res(store[hostname] ?? true),
        ),
      );
    },
    set(value) {
      return new Promise((res) =>
        chrome.storage.sync.set({ [hostname]: value }, res),
      );
    },
  });

  // function getHostName(url) {
  //   const { hostname } = new URL(url);
  //   if (hostname.startsWith("www.")) return hostname.replace("www.", "");
  //   return hostname;
  // }

  return {
    getArea,
    isVisible,
    getColor,
    waitForBody,
    hslaToString,
    storeLense,
  };
})();
