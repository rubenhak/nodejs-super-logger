import { existsSync as fsExistsSync } from 'fs';
import { mkdirpSync } from 'mkdirp';
import * as Path from 'path';

export function ensureDirectory(dirPath: string) {
    if (!fsExistsSync(dirPath)) {
        mkdirpSync(dirPath);
    }
}

export function ensureFileDirectory(filePath: string) {
    const dirPath = Path.dirname(filePath);
    return ensureDirectory(dirPath);
}
