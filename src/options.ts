import { LogLevel } from './levels';

export class Options {
    public pretty: boolean = false;
    public enableFile: boolean = false;
    public path?: string;
    public cleanOnStart: boolean = false;
    public level: LogLevel = LogLevel.info;
    public subLevels: Record<string, LogLevel> = {};
}

export class OptionsBuilder {
    private _options = new Options();

    public pretty(value: boolean): OptionsBuilder {
        this._options.pretty = value;
        return this;
    }

    public enableFile(value: boolean): OptionsBuilder {
        this._options.enableFile = value;
        return this;
    }

    public path(value: string): OptionsBuilder {
        this._options.path = value;
        return this;
    }

    public cleanOnStart(value: boolean): OptionsBuilder {
        this._options.cleanOnStart = value;
        return this;
    }

    public level(value: LogLevel): OptionsBuilder {
        this._options.level = value;
        return this;
    }

    public subLevel(name: string, value: LogLevel): OptionsBuilder {
        this._options.subLevels[name] = value;
        return this;
    }

    build(): Options {
        return this._options;
    }
}
