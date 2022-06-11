// const properties = ["color", "backgroundColor"];

function getGrayHsl() {
  const colors = {};
  traverseFiltered(($item) => {
    const styles = window.getComputedStyle($item);
    const bgColor = getPropertyColor($item, "backgroundColor", styles);
    const textColor = getNotInheritPropertyColor($item, "color", styles);

    if (bgColor) {
      colors[bgColor] = colors[bgColor] ?? 0;
      colors[bgColor] += getArea($item);
    }
    if (textColor) {
      colors[textColor] = colors[textColor] ?? 0;
      colors[textColor] += getArea($item);
    }
  });

  const entries = Object.entries(colors).map(([key, count]) => {
    return [rgbToHsl(key), count];
  });

  const filtered = entries.filter(([key]) => {
    const [h, s, l, a] = key;
    if (a === 0) return false;
    if (h === 0 && s === 0) return false;
    if (s === 100) return false;
    if (l > 20 && l < 80) return false;
    return true;
  });

  if (filtered.length === 0) return [0, 0, 0];

  const mostUsed = filtered.reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  })[0];

  return mostUsed.slice(0, 3);
}

// const getPalette = (function () {
//   const selector = "*:not(svg *,script,style,pre *,[contenteditable] *)";

//   function getPalette() {
//     const colors = {};
//     const $elements = document.querySelectorAll(selector);
//     $elements.forEach(($element) => {
//       if (!isVisible($element)) return;
//       styles = getComputedStyle($element);
//       const textColor = getTextColor($element, "color", styles);
//       const bgColor = getBoxColor($element, "backgroundColor", styles);
//       if (textColor) {
//         colors[textColor] = colors[textColor] ?? 0;
//         colors[textColor] += 1;
//       }
//       if (bgColor) {
//         colors[bgColor] = colors[bgColor] ?? 0;
//         colors[bgColor] += 1;
//       }
//     });

//     return {
//       all: colors,
//       // hsl: colorsToHsl(colors),
//       merged: mergeSimilar(colors),
//     };
//   }

//   function getBoxColor(
//     $element,
//     propName = "backgroundColor",
//     styles = getComputedStyle($element),
//   ) {
//     const maybeRgba = styles[propName];
//     const hasColor =
//       maybeRgba.includes("rgb(") ||
//       (maybeRgba.includes("rgba(") && !maybeRgba.endsWith("0)"));

//     return hasColor ? maybeRgba : null;
//   }

//   function getTextColor(
//     $element,
//     propName = "color",
//     styles = getComputedStyle($element),
//   ) {
//     if (!$element.parentElement) return styles[propName];
//     const parentColor = getComputedStyle($element.parentElement)[propName];
//     return parentColor === styles[propName] ? null : styles[propName];
//   }

//   function colorsToHsl(colors) {
//     return Object.fromEntries(
//       Object.entries(colors).map(([name, count]) => [
//         hslToString(rgbToHsl(name)),
//         count,
//       ]),
//     );
//   }

//   function isVisible($element) {
//     return !!(
//       $element.offsetWidth ||
//       $element.offsetHeight ||
//       $element.getClientRects().length
//     );
//   }

//   function mergeSimilar(colors) {
//     const merged = [];
//     const mergeMap = {};
//     Object.fromEntries(
//       Object.entries(colors).map(([rgba, count]) => {
//         const { r, g, b, a } = rgbToHsl(rgba);
//       }),
//     );
//   }

//   return getPalette;
// })();
