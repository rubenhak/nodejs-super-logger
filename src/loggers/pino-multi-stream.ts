/** Because of issues with pino version dependency this helper is copied from original */
/** Copied from: https://github.com/pinojs/pino-multi-stream **/

import { PrettyOptions } from 'pino-pretty';

// `pino/lib/tools` ships no type declarations; access it via require.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getPrettyStream = require('pino/lib/tools').getPrettyStream;

interface PrettyStreamArgs {
    opts?: PrettyOptions;
    prettyPrint?: PrettyOptions;
    prettifier?: any;
    dest?: NodeJS.WritableStream;
}

export function prettyStream(args: PrettyStreamArgs = {}): NodeJS.WritableStream {
    const prettyPrint = args.opts || args.prettyPrint;
    const { prettifier, dest = process.stdout } = args;
    return getPrettyStream(prettyPrint, prettifier, dest);
}
