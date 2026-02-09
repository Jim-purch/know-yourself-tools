export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export type AIProvider = 'openai' | 'deepseek' | 'moonshot' | 'yi' | 'custom';

export interface AIConfig {
    provider: AIProvider;
    apiKey: string;
    baseUrl: string;
    model: string;
}

export const PROVIDER_PRESETS: Record<AIProvider, Omit<AIConfig, 'apiKey'>> = {
    openai: {
        provider: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
    },
    deepseek: {
        provider: 'deepseek',
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
    },
    moonshot: {
        provider: 'moonshot',
        baseUrl: 'https://api.moonshot.cn/v1',
        model: 'moonshot-v1-8k',
    },
    yi: {
        provider: 'yi',
        baseUrl: 'https://api.lingyiwanwu.com/v1',
        model: 'yi-large',
    },
    custom: {
        provider: 'custom',
        baseUrl: '',
        model: '',
    }
};

export async function fetchCompletion(messages: ChatMessage[], config: AIConfig): Promise<string> {
    if (!config.apiKey) {
        throw new Error("API Key is missing. Please configure it in settings.");
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };

    // Adjust base URL if it ends with a slash to avoid double slashes,
    // though most APIs are forgiving.
    // Also ensure /chat/completions is appended if not present in custom URL,
    // but typically user provides base like https://api.openai.com/v1
    const cleanBaseUrl = config.baseUrl.replace(/\/$/, '');
    const url = `${cleanBaseUrl}/chat/completions`;

    const body = {
        model: config.model,
        messages: messages,
        temperature: 0.7,
        stream: false
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.error?.message) {
                    errorMsg += ` - ${errorData.error.message}`;
                } else {
                    errorMsg += ` - ${JSON.stringify(errorData)}`;
                }
            } catch (e) {
                // ignore json parse error
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response from AI provider.");
        }

        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("AI Completion Failed:", error);
        throw error;
    }
}
