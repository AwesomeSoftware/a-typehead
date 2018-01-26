import { AwesomeOption } from './awesome-option';
export declare class AwesomeHelper {
    static toAwesomeOptions(options: any[], textField: string, idField: string): AwesomeOption[];
    static fromAwesomeOptions(awesomeOptions: AwesomeOption[]): any[];
    static getStylesPosition(element: any, query: string): string;
    static stringToLowerSafely(text: string): string;
}
