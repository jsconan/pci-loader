# Definition

**PCI** stands for **P**ortable **C**ustom **I**nteraction. This is a specification from [1EdTech](https://www.imsglobal.org/assessment/interactions.html) (previously “IMS Global”).

> **Portable Custom Interaction (PCI) defines a standard way for technology-enhanced items (TEIs) or custom interaction types** to be represented as part of the Question and Test Interoperability® (QTI®) and Accessible Portable Item Protocol® (APIP®) specifications.

PCI runtimes must be defined following the [AMD API Specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md). Here is a simple example:

**File:** `/path/to/myPCI/runtime.js`

```javascript
define('my/PCI/runtime', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',
        getInstance(dom, config, state) {
            const myInteraction = {
                getResponse() {},
                getState() {},
                oncompleted() {}
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, myInteraction.getState());
            }
        }
    });
});
```
