<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    import type { OsuUserInfo } from "$lib/interfaces";
    import { players, captains, player_pairs } from '$lib/stores';

    const toastStore = getToastStore()

    let user_id = "";

    const submituserId = async () => {
        try {
            // Check if token exists
            let token = localStorage.getItem('guestToken');
            const expiresAt = Number(localStorage.getItem('tokenExpiresAt'));

            // If no token or token is expired
            if (!token || (Date.now() > expiresAt)) {
                // console.log("Token doesn't exist or has expired, requesting new token...");
                token = await getGuestToken();
            }

            const full_user_info = await geUserInfo(token);
            const selected_user_info = filterUserInfo(full_user_info);
            
            let duplicate_id = false;
            players.update(currentPlayers => {
                if (currentPlayers.some(player => player.user_id === selected_user_info.user_id)) {
                    duplicate_id = true;
                    return currentPlayers; // Don't add duplicate
                }
                return [...currentPlayers, selected_user_info]; // Add new player
            });

            // console.log($players);
            
            if (duplicate_id) {
                throw new Error('Duplicate user_id.');
            }

            toastStore.trigger({
                message: `✓ User Id added: ${user_id}, ${selected_user_info.name}`,
                background: 'bg-zinc-800 text-green-400 text-center',
                timeout: 2500,
            })

        } catch (error) {
            console.error("Failed to add user:", error);
            toastStore.trigger({
                message: `✗ Failed to add user: ${error}`,
                background: 'bg-zinc-800 text-red-400 text-center',
                timeout: 2500,
            });
            return; // Stop execution if there's an error
        }

        user_id = "";
    };

    function deleteUserId() {
        // Remove from store
        players.update(currentPlayers => currentPlayers.filter(player => player.user_id !== user_id));
        player_pairs.update(currentPairs => 
            currentPairs.filter(pair => 
                pair[0].user_id !== user_id && pair[1].user_id !== user_id
            )
        );

        toastStore.trigger({
            message: `✓ User not in storage anymore`,
            background: 'bg-zinc-800 text-green-400 text-center',
            timeout: 2500,
        });
    }

    async function getGuestToken(): Promise<string> {
        const response = await fetch('/api/get_token', { method: 'POST' });
        const data = await response.json();
        // console.log(data)

        // Check if we got the token
        const guest_token = data.access_token;
        if (!guest_token) {
            throw new Error('Token is null or undefined');

        }
        // Store the token and expiration time
        localStorage.setItem('guestToken', guest_token);

        const expires_at = Date.now() + Number(data.expires_in) * 1000
        localStorage.setItem('tokenExpiresAt', expires_at.toString());

        return guest_token;
    }

    async function geUserInfo(token: string) {
        const response = await fetch(`/api/user_info/${user_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Send guest_token as Bearer token
            }
        });
        
        if (!response.ok) {
            throw new Error ("Error in fetching user info.")
        }

        const data = await response.json();

        return data;
    }

    function saveChanges() {
        try {
            localStorage.setItem('players', JSON.stringify($players));
            localStorage.setItem('player_pairs', JSON.stringify($player_pairs));
            toastStore.trigger({
                message: `✓ Changes saved successfully!`,
                background: 'bg-zinc-800 text-green-400 text-center',
                timeout: 2500,
            })
        } catch (e) {
            toastStore.trigger({
                message: `✗ Save failed for some reason.`,
                background: 'bg-zinc-800 text-red-400 text-center',
                timeout: 2500,
            });
        }
    }

    function filterUserInfo(info): OsuUserInfo {
        let user_info: OsuUserInfo = {
            user_id: user_id,
            name: info.username,
            rank: info.statistics.global_rank,
            pp: info.statistics.pp,
            pfp_url: info.avatar_url,
        };
        return user_info;
    }

    function restrictToNumbers(event): void {
        // \D matches anything that's not a digit
        user_id = event.target.value.replace(/\D/g, ''); 
    }
</script>
  
<div class="bg-gray-200 p-4 flex justify-between items-center">
    <div class="flex space-x-2">
        <input
            type="text"
            placeholder="Enter Osu User ID"
            bind:value={user_id}
            on:input={restrictToNumbers}
            class="border p-2 rounded text-black placeholder-gray-400"
        />
        <button
            on:click={submituserId}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 hover:shadow-lg transition"
        >
            Submit User Id
        </button>
        <button
            on:click={deleteUserId}
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 hover:shadow-lg transition"
        >
            Delete User Id
        </button>
    </div>
    <div>
        <span class="text-black pr-5">Player Count: {$players.length+$captains.length}</span>
        <button
            on:click={saveChanges}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 hover:shadow-lg transition"
        >
            Save Changes
        </button>
    </div>
</div>
  