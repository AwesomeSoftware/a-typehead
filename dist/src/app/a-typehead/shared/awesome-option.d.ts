export declare class AwesomeOption {
    private textField;
    private idField;
    model: any;
    private simpleText;
    constructor(textField?: string, idField?: string, model?: any, simpleText?: string);
    readonly text: string;
    readonly id: string;
    compare(newValue: any): boolean;
}
