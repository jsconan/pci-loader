define('my/hello', [], function () {
    return {
        hello(name) {
            return `Hello, <strong>${name}!</strong>`;
        }
    };
});
define('my/style', [], function () {
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
define('css!my/PCI/styles', [], function () {});
define('my/PCI/runtime', ['qtiCustomInteractionContext', 'my/hello', 'my/style', 'css!my/PCI/styles'], function (
    qtiCustomInteractionContext,
    hello,
    style
) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',

        getInstance(dom, config, state) {
            let name = state?.response?.base?.string || '';

            const css = `
            .my-pci {
                background-color: #f0f0f0;
                border: 1px solid #404040;
                padding: 20px;
                border-radius: 5px;
            }
            .my-pci .prompt label {
                background-color: transparent;
                color: #404040;
                font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
                font-weight: 500;
                font-size: 16px;
                margin-end: 10px;
            }
            .my-pci .prompt input {
                background-color: #f0f0f0;
                color: #404040;
                border: 1px solid #404040;
                border-radius: 5px;
                font-family: monospace, 'courier new', sans-serif;
                font-weight: 500;
                font-size: 16px;
                margin-end: 10px;
                padding: 5px;
            }
            .my-pci .response {
                color: #404040;
                font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
                font-weight: 500;
                font-size: 16px;
                margin-top: 10px;
            }
            `;
            const styleEl = style.write(css);

            dom.innerHTML = `
            <div class="my-pci">
                <div class="prompt">
                    <label for="my-name">Enter your name:</label>
                    <input id="my-name" type="text" />
                </div>
                <div class="response"></div>
            </div>
            `;
            const responseEl = dom.querySelector('.response');

            dom.addEventListener('input', event => {
                if (event.target.id === 'my-name') {
                    name = event.target.value;
                    responseEl.innerHTML = name ? hello.hello(name) : '';
                }
            });

            const myInteraction = {
                getResponse() {
                    return { base: { string: name } };
                },

                getState() {
                    return { response: myInteraction.getResponse() };
                },

                oncompleted() {
                    dom.innerHTML = '';
                    styleEl.remove();
                    return 'completed';
                }
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, myInteraction.getState());
            }
        }
    });

    return {};
});
define(['my/PCI/runtime'], function (IMSPCI) {
    return IMSPCI;
});
