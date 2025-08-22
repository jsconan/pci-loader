/**
 * Defines data structures for PCI (Portable Custom Interaction).
 */
export declare namespace PCI {
    type Cardinality = 'single' | 'multiple' | 'ordered' | 'record';
    type BaseType =
        | 'null'
        | 'boolean'
        | 'integer'
        | 'float'
        | 'string'
        | 'point'
        | 'pair'
        | 'directedPair'
        | 'duration'
        | 'file'
        | 'uri'
        | 'identifier'
        | 'intOrIdentifier';

    interface SingleBoolean {
        boolean: boolean;
    }
    interface SingleInteger {
        integer: number;
    }
    interface SingleFloat {
        float: number;
    }
    interface SingleString {
        string: string;
    }
    interface SinglePoint {
        point: [number, number];
    }
    interface SinglePair {
        pair: [string, string];
    }
    interface SingleDirectedPair {
        directedPair: [string, string];
    }
    interface SingleDuration {
        duration: string;
    }
    interface SingleFile {
        file: { data: string; mime: string; name: string };
    }
    interface SingleURI {
        uri: string;
    }
    interface SingleIdentifier {
        identifier: string;
    }
    interface SingleIntOrIdentifier {
        intOrIdentifier: number | string;
    }

    interface MultipleBoolean {
        boolean: boolean[];
    }
    interface MultipleInteger {
        integer: number[];
    }
    interface MultipleFloat {
        float: number[];
    }
    interface MultipleString {
        string: string[];
    }
    interface MultiplePoint {
        point: [number, number][];
    }
    interface MultiplePair {
        pair: [string, string][];
    }
    interface MultipleDirectedPair {
        directedPair: [string, string][];
    }
    interface MultipleDuration {
        duration: string[];
    }
    interface MultipleFile {
        file: { data: string; mime: string; name: string }[];
    }
    interface MultipleURI {
        uri: string[];
    }
    interface MultipleIdentifier {
        identifier: string[];
    }
    interface MultipleIntOrIdentifier {
        intOrIdentifier: (number | string)[];
    }

    interface RecordNull {
        name: null;
    }
    interface RecordSingle {
        name: string;
        base:
            | null
            | SingleBoolean
            | SingleInteger
            | SingleFloat
            | SingleString
            | SinglePoint
            | SinglePair
            | SingleDirectedPair
            | SingleDuration
            | SingleFile
            | SingleURI
            | SingleIdentifier
            | SingleIntOrIdentifier;
    }
    interface RecordMultiple {
        name: string;
        list:
            | MultipleBoolean
            | MultipleInteger
            | MultipleFloat
            | MultipleString
            | MultiplePoint
            | MultiplePair
            | MultipleDirectedPair
            | MultipleDuration
            | MultipleFile
            | MultipleURI
            | MultipleIdentifier
            | MultipleIntOrIdentifier;
    }

    interface SingleCardinality {
        base:
            | null
            | SingleBoolean
            | SingleInteger
            | SingleFloat
            | SingleString
            | SinglePoint
            | SinglePair
            | SingleDirectedPair
            | SingleDuration
            | SingleFile
            | SingleURI
            | SingleIdentifier
            | SingleIntOrIdentifier;
    }
    interface MultipleCardinality {
        list:
            | MultipleBoolean
            | MultipleInteger
            | MultipleFloat
            | MultipleString
            | MultiplePoint
            | MultiplePair
            | MultipleDirectedPair
            | MultipleDuration
            | MultipleFile
            | MultipleURI
            | MultipleIdentifier
            | MultipleIntOrIdentifier;
    }
    interface RecordCardinality {
        record: (RecordNull | RecordSingle | RecordMultiple)[];
    }

    type Response = SingleCardinality | MultipleCardinality | RecordCardinality;

    interface State {
        response?: Response;
        [key: string]: unknown;
    }

    interface Config {
        properties: Record<string, unknown>;
        templateVariables?: Record<string, Response>;
        boundTo?: { [key: string]: Response };
        onready: (interaction: Interaction, state: State) => void;
        ondone?: (interaction: Interaction, response: Response, state: State, status: string) => void;
        status?: string;
    }

    interface Registration {
        typeIdentifier: string;
        getInstance: (container: Element, configuration: Config, state: State) => void;
    }

    interface Interaction {
        getResponse: () => Response;
        getState: () => State;
        oncompleted: () => void;
        [key: string]: unknown;
    }

    interface RegistryContext {
        register: (interaction: Registration) => void;
    }
    interface RegistryGetter {
        getInstance: (typeIdentifier: string, container: Element, configuration: Config, state: State) => void;
    }
    interface Registry extends RegistryContext, RegistryGetter {}
}
