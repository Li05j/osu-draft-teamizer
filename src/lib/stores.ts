import { writable } from 'svelte/store';
import type { OsuTeam, OsuUserInfo } from '$lib/interfaces';
import { TEAM_COUNT } from '$lib/constants';

export const players = writable<OsuUserInfo[]>([]);
export const captains = writable<OsuUserInfo[]>([]);

export const teams = writable<OsuTeam[]>(Array(TEAM_COUNT).fill({ captain: null, players: []}));