define('my/PCI/runtime', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',

        getInstance() {
            throw new Error('A failure occurred');
        }
    });

    return {};
});
