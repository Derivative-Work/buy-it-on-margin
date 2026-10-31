import film from '../config/film.json';
import seeds from '../config/seeds.json';
import cards from '../config/cards.json';

export const FILM = film;
export const SEED: number = seeds.seed;
export const CARDS = cards.cards as Record<string, {kind: string; text: string}>;
export const FPS = film.frame.fps;
export const PIC_W = film.frame.picture.width;
export const PIC_H = film.frame.picture.height;

/** Brief: hold a card >= 1.5 s + ~1 s per 3 words. */
export const cardHoldS = (text: string) =>
  film.card.min_hold_s + text.split(/\s+/).filter(Boolean).length * film.card.s_per_word;
