import axios from 'axios';

/**
 * Class to interact with the Kimi API, creating a new session per instance.
 * Each instance is temporary and does not save state, ensuring a new session per call.
 */
class Kimi {
    constructor() {
        // Generate a unique device and session ID for each instance.
        this.id = Date.now() + Math.floor(Math.random() * 1e3);
        this.headers = {
            'content-type': 'application/json',
            'x-language': 'zh-CN',
            'x-msh-device-id': this.id,
            'x-msh-platform': 'web',
            'x-msh-session-id': this.id,
            'x-traffic-id': this.id
        };
    }

    /**
     * Registers a new device and obtains authentication credentials.
     * @returns {Promise<{auth: string, cookie: string}>} The session credentials.
     */
    async register() {
        try {
            const { data, headers: h } = await axios.post(
                'https://www.kimi.com/api/device/register',
                {},
                { headers: this.headers }
            );
            return { auth: `Bearer ${data.access_token}`, cookie: h['set-cookie'].join('; ') };
        } catch (e) {
            console.error('Error registering device with Kimi:', e);
            return null;
        }
    }

    /**
     * Creates a new chat with the Kimi API.
     * @param {object} creds The authentication credentials.
     * @returns {Promise<string>} The ID of the new chat.
     */
    async createChat(creds) {
        try {
            const { data } = await axios.post(
                'https://www.kimi.com/api/chat',
                {
                    name: 'Chat 🜲 ᵖᵃᵗᵒ',
                    born_from: 'home',
                    kimiplus_id: 'kimi',
                    is_example: false,
                    source: 'web',
                    tags: []
                },
                { headers: { ...this.headers, authorization: creds.auth, cookie: creds.cookie } }
            );
            return data.id;
        } catch (e) {
            console.error('Error creating chat with Kimi:', e);
            return null;
        }
    }

    /**
     * Sends a message and gets the chat response.
     * @param {string} chatId The chat ID.
     * @param {object} creds The authentication credentials.
     * @param {string} text The user's message.
     * @returns {Promise<string>} The bot's response.
     */
    async chat(chatId, creds, text) {
        const payload = {
            kimiplus_id: 'kimi',
            extend: { sidebar: true },
            model: 'k2',
            use_search: true,
            messages: [{ role: 'user', content: text }],
            refs: [],
            history: [],
            scene_labels: [],
            use_semantic_memory: false,
            use_deep_research: false
        };

        const headers = { ...this.headers, authorization: creds.auth, cookie: creds.cookie };

        try {
            const { data } = await axios.post(
                `https://www.kimi.com/api/chat/${chatId}/completion/stream`,
                payload,
                { headers, responseType: 'text' }
            );

            let resp = '';
            const lines = data.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const d = JSON.parse(line.substring(6));
                        if (d.event === 'cmpl') resp += d.text;
                    } catch {}
                }
            }
            return resp.trim();
        } catch (e) {
            console.error('Error in Kimi API call:', e);
            throw e;
        }
    }
}

/**
 * Main scraper function that handles the entire Kimi chat process.
 * It returns a structured object with status and data.
 * @param {string} text The user's prompt.
 * @returns {Promise<object>} The structured response object.
 */
export async function kimi(text) {
    try {
        const kimiInstance = new Kimi();
        const creds = await kimiInstance.register();
        if (!creds) {
            return {
                autor: '🜲 ᵖᵃᵗᵒ',
                status: false,
                data: { message: 'Failed to authenticate with Kimi.' }
            };
        }

        const chatId = await kimiInstance.createChat(creds);
        if (!chatId) {
            return {
                autor: '🜲 ᵖᵃᵗᵒ',
                status: false,
                data: { message: 'Failed to create a chat with Kimi.' }
            };
        }

        const answer = await kimiInstance.chat(chatId, creds, text);

        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: true,
            data: { text: answer }
        };
    } catch (e) {
        console.error('Kimi scraper error:', e);
        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: false,
            data: { message: e.message }
        };
    }
}
