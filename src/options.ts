import { LogLevel } from './levels';

class Options
{
    public pretty: boolean = false;
    public enableFile: boolean = false;
    public path?: string;
    public cleanOnStart: boolean = false;
    public level: LogLevel = LogLevel.info;
}

export { Options }