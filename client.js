const { waitForBody, getColor, makeColor, hslaToString, isVisible } = helpers;

(async () => {
  const initial = await store.get();
  start(initial);
  store.onChange(start);

  function start(enabled) {
    console.info(`🔥 enabled`, enabled);
  }

  // document.documentElement.dataset.daStatus = "start";
  // waitForBody().then(() => {
  //   console.info(`🔥 2`);
  //   document.documentElement.dataset.daStatus = "body";
  //   setDocumentBackground();
  // });
  // document.addEventListener("DOMContentLoaded", () => {
  //   console.info(`🔥 3`);
  //   document.documentElement.dataset.daStatus = "document";
  // });

  // function setDocumentBackground() {
  //   const htmlColor = getColor(document.documentElement);
  //   const bodyColor = getColor(document.body);
  //   const rootColor = bodyColor.isOk
  //     ? bodyColor
  //     : htmlColor.isOk
  //     ? htmlColor
  //     : makeColor("rgba(255,255,255)");

  //   // TODO: CALC RIGHT NUMBER
  //   const light = 100 - rootColor.light.l * 0.94;
  //   const hsla = { ...rootColor.dark, l: light };
  //   document.documentElement.style.backgroundColor = hslaToString(hsla);
  // }

  // function setRootAttribute() {
  //   document.querySelector("html, body, body > *, body > * > *");
  // }

  // function addDataAttributes($element) {
  //   const { ok, light, dark } = getColor($element);
  //   if (!ok) return;

  //   if (light) $element.dataset.daLight = "";
  //   if (dark) $element.dataset.daDark = "";

  //   const area = getArea($element);
  //   const documentArea = window.innerHeight * window.innerWidth;
  //   const proportion = area / documentArea || 1;
  //   $element.dataset.daSize =
  //     proportion < 0.01 ? "small" : proportion < 0.1 ? "medium" : "big";
  // }

  function startObserver(element, handler) {
    const observerParams = {
      subtree: true,
      childList: true,
      attributes: false,
    };
    const observer = new MutationObserver((mutations_list) => {
      mutations_list.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (!(addedNode instanceof Element)) return;
          if (!isVisible(addedNode)) return;
          requestAnimationFrame(() => handler(addedNode));
        });
      });
    });
    observer.observe(element, observerParams);
  }

  return;
  // const { isVisible, getPropertyColor, getArea } = helpers;

  // chrome.runtime.sendMessage("ready");
  // chrome.runtime.onMessage.addListener((message) => {
  //   if (message === "ok") init();
  //   else console.log("Smart Dark Mode Disabled");
  //   return true;
  // });

  // init();

  // // handleElement(document.documentElement);

  // function init() {
  //   document.documentElement.dataset.daRun = "";
  //   startObserver();
  // }

  // function startObserver() {
  //   const observerParams = {
  //     subtree: true,
  //     childList: true,
  //     attributes: false,
  //   };
  //   const observer = new MutationObserver((mutations_list) => {
  //     mutations_list.forEach((mutation) => {
  //       mutation.addedNodes.forEach((addedNode) => {
  //         if (!(addedNode instanceof Element)) return;
  //         if (!isVisible(addedNode)) return;
  //         requestAnimationFrame(() => handleElement(addedNode));
  //       });
  //     });
  //   });
  //   observer.observe(document.documentElement, observerParams);
  // }

  // function handleElement($element) {
  //   const bg = getPropertyColor($element, "backgroundColor");
  //   if (!bg.ok) return;

  //   if (bg.light) $element.dataset.daLight = "";
  //   if (bg.dark) $element.dataset.daDark = "";

  //   const area = getArea($element);
  //   const documentArea = window.innerHeight * window.innerWidth;
  //   const proportion = area / documentArea || 1;
  //   $element.dataset.daSize =
  //     proportion < 0.01 ? "small" : proportion < 0.1 ? "medium" : "big";
  // }
})();

// TODO: overlay based on hue/saturation (find grayish colors)
// TODO: should apply on website (based on overall lightness)?

// TODO: test top 100 websites

// document.addEventListener("DOMContentLoaded", init);

// function init() {
//   const overlay = document.createElement("div");
//   overlay.classList.add("$$dark-mode-overlay");
//   document.body.append(overlay);
// }

// const observerParams = { subtree: true, childList: true, attributes: true };
// const observer = new MutationObserver((mutations_list) => {
//   mutations_list.forEach((mutation) => {
//     if (mutation.type === "attributes") {
//       console.info(`🔥 attributes`, mutation.target);
//       setTimeout(() => init(mutation.target), 0);
//     }
//     mutation.addedNodes.forEach((addedNode) => {
//       if (!(addedNode instanceof Element)) return;
//       console.info(`🔥 addedNode`, addedNode);
//       setTimeout(() => init(addedNode), 0);
//     });
//   });
// });

// function init() {
//   return;
//   observer.disconnect();
//   start(document.documentElement).then(() => {
//     document.documentElement.dataset.darkModeOn = "";
//     observer.observe(document.documentElement, observerParams);
//   });
// }

// function start($element) {
//   // const grayHsl = getGrayHsl();
//   return traverseFiltered(($item) => {
//     const styles = window.getComputedStyle($item);
//     const bgColor = getPropertyColor($item, "backgroundColor", styles);
//     const textColor = getPropertyColor($item, "color", styles);
//     const $parent = getClosestParentWithBg($item);

//     // TODO: outline / boxShadow / pseudo (before/after/hover...)

//     if (bgColor) {
//       const hsl = rgbToHsl(bgColor);
//       const lightness = hsl[2];
//       if (lightness > 60 && !isSmallItem($item, $parent))
//         changePropColor($item, "backgroundColor", hsl);
//     }

//     if (textColor) {
//       if ($parent) {
//         const { backgroundColor } = getComputedStyle($parent);
//         const containerHsl = rgbToHsl(backgroundColor);
//         const itemHsl = rgbToHsl(textColor);
//         const containerBgLightness = containerHsl[2];
//         const itemLightness = itemHsl[2];
//         const isSmallDiff = Math.abs(containerBgLightness - itemLightness) < 50;
//         if (isSmallDiff) {
//           // console.log("\n\n");
//           // console.info(`🔥 backgroundColor`, backgroundColor);
//           // console.info(`🔥 $parent`, $parent);
//           // console.info(`🔥 $item`, $item);
//           changePropColor($item, "color", itemHsl);
//         }
//       }
//     }
//   }, $element);
// }

// function isSmallItem($element, $parent) {
//   if (!$parent) return false;
//   if ($parent === document.body) return false;
//   if ($element === document.body) return false;
//   const parentArea = getArea($parent);
//   const itemArea = getArea($element);
//   return itemArea / parentArea < 0.05;
// }

// function changePropColor($element, property, originalColor) {
//   const [h, s, l, a] = originalColor;
//   $element.style[property] = `hsla(${h}, ${s}%, ${100 - l}%, ${a})`;
// }

// function getClosestParentWithBg($item) {
//   if (!$item.parentElement) return null;

//   const bgColor = getPropertyColor($item.parentElement, "backgroundColor");
//   return bgColor
//     ? $item.parentElement
//     : getClosestParentWithBg($item.parentElement);
// }
