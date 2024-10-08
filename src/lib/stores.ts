import { writable } from 'svelte/store';
import type { OsuUserInfo } from './interfaces';

export const players = writable<OsuUserInfo[]>([]);