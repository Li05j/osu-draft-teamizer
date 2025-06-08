import { writable } from 'svelte/store';
import type { OsuTeam, OsuUserInfo } from '$lib/interfaces';
import { TEAM_COUNT } from '$lib/constants';

export const players = writable<OsuUserInfo[]>([]);
export const captains = writable<OsuUserInfo[]>([]);
// So for some reason the retarded me decided to separate captains and players.
// This means players + captains = all players.
// However, player_pairs is going to be simply a tracking - it should not effect items in players or captains.
export const player_pairs = writable<[OsuUserInfo, OsuUserInfo][]>([]);
export const teams = writable<OsuTeam[]>(Array.from({ length: TEAM_COUNT }, () => ({ players: [] })));

// Captain and Player pair
export const undoStack = writable<[OsuUserInfo, OsuUserInfo][]>([]);

// Signals

// Emitted when a player is about to be added to teams
export const addPlayerToTeamSignal = writable<OsuUserInfo | null>();

// Emitted when undo is triggered
export const undoSignal = writable<[OsuUserInfo, OsuUserInfo] | null>();