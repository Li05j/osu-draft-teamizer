export interface OsuUserInfo {
    user_id: string;
    name: string;
    rank: number;
    pp: number;
    pfp_url: string;
    tier?: number;
    manual_tier?: boolean;
}

export interface OsuTeam {
    players: OsuUserInfo[];
}