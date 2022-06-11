(function () {
  // const baseStyles = getBaseStyles();
  const textProps = ["color", "text-decoration-color"];
  const bgProps = [
    "background-color",
    "border-top-color",
    "border-bottom-color",
    "border-left-color",
    "border-right-color",
    "fill",
  ];

  const observerParams = { subtree: true, childList: true, attributes: true };
  const observer = new MutationObserver((mutations_list) => {
    // mutations_list.forEach((mutation) => {
    //   if (mutation.type === "attributes") {
    //     runTraverse(mutation.target);
    //   }
    //   mutation.addedNodes.forEach((addedNode) => {
    //     if (!(addedNode instanceof Element)) return;
    //     runTraverse(addedNode);
    //   });
    // });
  });

  // setTimeout(() => {
  //   console.clear();
  //   runTraverse();
  // });

  // traverse();

  function traverse() {
    const $items = [
      document.documentElement,
      document.body,
      ...document.body.querySelectorAll(
        "*:not(script):not(noscript):not(style)",
      ),
    ].reverse();

    observer.disconnect();
    $items.forEach(($item) => {
      const rect = $item.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      applyChanges($item);
    });
    observer.observe(document.body, observerParams);
  }

  function applyChanges(item) {
    const itemStyles = window.getComputedStyle(item);
    const changedColorProps = getNotBasicColorProps(item, itemStyles);

    changedColorProps.forEach((propName) => {
      const value = itemStyles[propName];
      console.info(`🔥 value`, value);
      // if (value === "none") break;
      const rgbaValue = getRgbaString(value);
      const lightness = getElementLightness(rgbaValue);
      const isText = textProps.includes(propName);

      const shouldInvert =
        (isText && lightness < 0.5) || (!isText && lightness > 0.5);

      console.info(`🔥`, {
        item,
        propName,
        value,
        lightness,
        shouldInvert,
        inverted: invertPropertyColor(value),
      });

      if (shouldInvert) {
        item.style[propName] = invertPropertyColor(value);
        // setTimeout(() => (item.style[propName] = invertPropertyColor(value)));
      }
    });
  }

  function revertChanges(item) {
    console.info(`🔥 revertChanges`, item);

    // item.__before = item.style;

    for (propName in item.__myStyles) {
      if (item.style[propName] === item.__myStyles[propName]) {
        item.style[propName] = "";
      }
    }

    item.__myStyles = {};
  }

  function getNotBasicColorProps(item, itemStyles) {
    const parentStyles = item.parentElement
      ? window.getComputedStyle(item.parentElement)
      : {};

    const changed = [...textProps, ...bgProps].filter(
      (propName) => itemStyles[propName] !== parentStyles[propName],
    );

    return changed;
  }

  function getElementLightness(rgbString) {
    const rgbIntArray = rgbToArray(rgbString);
    const rgb = rgbIntArray.slice(0, 3);
    const a = rgbIntArray[3] ?? 1;

    if (a === 0) return null;

    // Get the highest and lowest out of red green and blue
    const highest = Math.max(...rgb);
    const lowest = Math.min(...rgb);
    const avg = (highest + lowest) / 2 / 255;
    const rounded = Math.round(avg * a * 100) / 100;

    // Return the average divided by 255
    return rounded;
  }

  function getRgbaString(propertyString) {
    const rx = /rgba?\(.*\)/;
    const [rgbString] = propertyString.match(rx);
    return rgbString;
  }

  function invertPropertyColor(propertyString) {
    const rgbString = getRgbaString(propertyString);
    const inverted = invertColor(rgbString);
    return propertyString.replace(rgbString, inverted);
  }

  function invertColor(rgbString) {
    const [r, g, b, a = 1] = rgbToArray(rgbString);
    return `rgba(${255 - r}, ${255 - g}, ${255 - b}, ${a})`;
  }

  function rgbToArray(rgbString) {
    return rgbString
      .replace(/ /g, "")
      .replace(/rgba?/g, "")
      .replace(/[()]/g, "")
      .split(",")
      .map((e) => parseInt(e));
  }

  // function getBaseStyles() {
  //   const $div = document.createElement("div");
  //   $div.style.all = "unset";
  //   document.body.append($div);
  //   const pureStyles = window.getComputedStyle($div);
  //   setTimeout(() => $div.remove(), 10);
  //   return pureStyles;
  // }

  // function getColorProps(baseStyles) {
  //   const rgbaRx = /rgba?\(/;
  //   const colorProps = [...baseStyles].filter((key) => {
  //     const value = baseStyles[key];
  //     return rgbaRx.test(value);
  //   });
  //   colorProps.push("box-shadow");

  //   const textColorProps = colorProps.filter(
  //     (name) =>
  //       name.includes("text") || name === "color" || name === "caret-color",
  //   );
  //   const bgColorProps = colorProps.filter(
  //     (props) => !textColorProps.includes(props),
  //   );

  //   return { colorProps, textColorProps, bgColorProps };
  // }

  function replaceValue(str, newValue) {
    return str.replace(/rgba?\(.*\)/, newValue);
  }
})();
