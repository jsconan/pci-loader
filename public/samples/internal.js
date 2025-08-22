define(['external'], function (external) {
    return {
        compose(message) {
            return `${message} from compose with ${external()}`;
        }
    };
});
