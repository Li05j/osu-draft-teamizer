import { json } from '@sveltejs/kit';
import { PUBLIC_OSU_API_URL } from '$env/static/public';

export async function GET({ params, request }) {
    try{
        const user_id = params.user_id;
        const guest_token = request.headers.get('Authorization');

        if (!guest_token) {
            throw new Error('Authorization token missing');
        }

        console.log(`user id: ${user_id}`)
        console.log(`url: ${PUBLIC_OSU_API_URL}/users/${user_id}/osu`)

        // Only support osu! standard mode fetch
        const response = await fetch(`${PUBLIC_OSU_API_URL}/users/${user_id}/osu`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': guest_token,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
    
        const data = await response.json();
        console.log(`Fetch data: ${data}`)
        return json(data);
    } catch(e) {
        console.error(e);
        return json({ error: e.message }, { status: 500 });
    }
}
