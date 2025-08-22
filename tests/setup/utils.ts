export class Script {
    /**
     * Evaluates a string of JavaScript code in the global context.
     * @param content The JavaScript code to evaluate.
     * @returns The result of the evaluated code.
     */
    static evaluate(content: string): unknown {
        return new Function(content)();
    }
}
