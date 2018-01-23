import { AwesomeOption } from './awesome-option';

export class AwesomeHelper {
    public static toAwesomeOptions(options: any[], textField: string, idField: string): AwesomeOption[] {
        if (!options) {
            return null;
        }
        const awesomeOptions: AwesomeOption[] = [];
        options.forEach((option) => {
            awesomeOptions.push(new AwesomeOption(textField, idField, option));
        });
        return awesomeOptions;
    }

    public static fromAwesomeOptions(awesomeOptions: AwesomeOption[]): any[] {
        if (!awesomeOptions) {
            return null;
        }
        const options: any[] = [];
        awesomeOptions.forEach((option) => {
            options.push(option.model);
        });
        return options;
    }

    public static getStylesPosition(element: any, query: string) {
        const clientRect = element
            .querySelector(query)
            .getBoundingClientRect();
        const width = clientRect.width;
        const height = clientRect.height;
        const leftOffset = clientRect.left;
        const topOffset = clientRect.top + height + window.pageYOffset;

        return `position: absolute;
                width: ${width}px;
                left: ${leftOffset}px;
                top: ${topOffset}px;
                z-index: 100000;`;
    }

    public static stringToLowerSafely(text: string) {
        if (!text) {
            return text;
        } else {
            return text.toLowerCase();
        }
    }
}
