define('external', [], function () {
    return function external() {
        return 'external';
    };
});
define('resource', [], function () {
    return function resource() {
        return 'resource';
    };
});
define('internal', ['external', 'resource'], function (external, resource) {
    return {
        compose(message) {
            return `${message} from compose with ${external()} and ${resource()}`;
        }
    };
});
