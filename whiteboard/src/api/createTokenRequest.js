import Ably from "ably/promises";

export default async function handler(req, res) {
    const client = new Ably.Realtime(process.env.VITE_ABLY_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'collab-app' });
    res.status(200).json(tokenRequestData);
};