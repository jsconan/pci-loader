define(function () {
    return {
        write(css) {
            const styleEl = document.createElement('style');
            styleEl.setAttribute('type', 'text/css');
            document.getElementsByTagName('head')[0].appendChild(styleEl);
            if (styleEl.styleSheet) {
                styleEl.styleSheet.cssText = css;
            } else {
                styleEl.appendChild(document.createTextNode(css));
            }
            return styleEl;
        }
    };
});
