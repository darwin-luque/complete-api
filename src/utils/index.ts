import { exec } from 'child_process';
import { FfmpegResult } from '../types';

// generate uuidv4
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const execFfmpeg = (href: string): Promise<FfmpegResult> =>
  new Promise((res, rej) => {
    exec(
      `ffprobe -v quiet -show_streams -select_streams v:0 -of json "${href}"`,
      (err, stdout) => {
        if (err) {
          rej(err);
          return;
        }
        res(JSON.parse(stdout) as FfmpegResult);
      },
    );
  });
