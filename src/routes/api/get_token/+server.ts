import { json } from '@sveltejs/kit';
import { PRIVATE_OSU_CLIENT_ID, PRIVATE_OSU_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_OSU_OAUTH_REQUEST_URL } from '$env/static/public';

export async function POST() {
    const response = await fetch(PUBLIC_OSU_OAUTH_REQUEST_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: PRIVATE_OSU_CLIENT_ID,
            client_secret: PRIVATE_OSU_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: 'public'
        })
    });
    const data = await response.json();
    return json(data);
}
