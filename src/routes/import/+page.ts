import type { PageLoad } from './$types';
export const load: PageLoad = () => {
    const storedPlayers = localStorage.getItem('players');
    return {
        players: storedPlayers ? JSON.parse(storedPlayers) : []
    };
};
