
import { existsSync as fsExistsSync } from 'fs';
import * as mkdirp from 'mkdirp'
import * as Path from 'path'


export function ensureDirectory(dirPath: string)
{
    if (!fsExistsSync(dirPath)) {
        mkdirp.sync(dirPath);
    }
}

export function ensureFileDirectory(filePath: string)
{
    const dirPath = Path.dirname(filePath);
    return ensureDirectory(dirPath);
}