import { Template } from './types.js';
export declare const formSchema: {
    type: "object";
    required: string[];
    properties: {
        name: {
            type: "string";
            title: string;
        };
        dispatcher: {
            type: "string";
            title: string;
        };
        assertion: {
            type: "string";
            title: string;
        };
        wrap: {
            type: "string";
            title: string;
        };
    };
};
export declare const uiSchema: {
    dispatcher: {
        'ui:widget': string;
    };
    assertion: {
        'ui:widget': string;
    };
    wrap: {
        'ui:widget': string;
    };
};
export declare const defaultFormData: Template;
