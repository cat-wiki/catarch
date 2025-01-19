import { stat } from 'fs/promises';
import { join } from 'path';

export const findUp = async (filename: Readonly<string>, cwd: string = process.cwd()): Promise<string | null> => {
    const path = join(cwd, filename)
    try {
        await stat(path)
        return path
    } catch (e) {
        if (cwd === '/') {
            return null
        }
        return findUp(filename, join(cwd, '..'))
    }
}

export const findUpMany = async (filenames: readonly string[], cwd: string = process.cwd()): Promise<string | null> => {
    for (const filename of filenames) {
        const path = await findUp(filename, cwd)
        if (path) {
            return path
        }
    }
    return null
}