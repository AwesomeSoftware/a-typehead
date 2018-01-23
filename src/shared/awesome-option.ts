import { AwesomeHelper } from './awesome-helper';

export class AwesomeOption {
    constructor(private textField?: string,
        private idField?: string,
        public model?: any,
        private simpleText?: string) {
    }

    public get text(): string {
        if (this.model && this.textField) {
            return this.model[this.textField];
        } else if (this.simpleText) {
            return this.simpleText;
        } else {
            return null;
        }
    }
    public get id(): string {
        if (this.model && this.idField) {
            return this.model[this.idField];
        } else {
            return null;
        }
    }
    public compare(newValue: any): boolean {
        if (!newValue) {
            return false;
        }
        const curText = AwesomeHelper.stringToLowerSafely(this.text);
        const curId = this.id;
        if (newValue instanceof AwesomeOption) {
            const newText = AwesomeHelper.stringToLowerSafely(newValue.text);
            const newId = newValue.id;
            return curText === newText && curId === newId;
        } else {
            const newText = AwesomeHelper.stringToLowerSafely(newValue[this.textField]);
            const newId = newValue[this.idField];
            return curText === newText && this.id === newId;
        }
    }
}
