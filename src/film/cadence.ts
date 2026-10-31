import {FILM} from '../config';

const R = FILM.frame.picture_fps / FILM.frame.fps; // 0.75

/** Picture frame shown at composition frame f (18 fps picture inside a 24 fps file: a 2,1,1 hold pattern). */
export const pictureIndex = (f: number) => Math.floor(f * R + 1e-9);
/** The composition frame whose content that picture frame shows (its first frame). */
export const heldFrame = (f: number) => Math.ceil(pictureIndex(f) / R - 1e-9);
