import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Settings,
    RefreshCw,
    Trash2,
    MessageSquare,
    Bot,
    User,
    Check,
    AlertCircle,
    ChevronDown,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCompletion, PROVIDER_PRESETS, type AIConfig, type ChatMessage, type AIProvider } from '../utils/ai';

const DEFAULT_SYSTEM_PROMPT = `As a professional Life Coach, you are here to help the user through a journey of self-discovery and problem-solving using the GROW model (Goal, Reality, Options, Will).

Your core principles:
1.  **Empathy & Active Listening**: Validate the user's feelings. Reflect back what you hear to ensure understanding.
2.  **Powerful Questioning**: Ask open-ended questions (starting with What, How, When, Who) to provoke deep thinking. Avoid "Why" as it can sound judgmental.
3.  **Non-Directive**: Do not give advice or solutions unless explicitly asked or after the user is stuck. Your goal is to help them find their own answers.
4.  **Structure (GROW)**:
    -   **Goal**: What do they want to achieve? (Make it SMART: Specific, Measurable, Achievable, Relevant, Time-bound).
    -   **Reality**: What is happening now? What have they tried? What are the obstacles?
    -   **Options**: What could they do? Brainstorm possibilities without judgment.
    -   **Will**: What *will* they do? Commit to a specific action plan.

Start by asking what topic they would like to explore today. Maintain a supportive, encouraging, and professional tone.`;

const AICoachingTool: React.FC = () => {
    // State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Configuration State
    const [config, setConfig] = useState<AIConfig & { systemPrompt: string }>({
        provider: 'openai',
        apiKey: '',
        baseUrl: PROVIDER_PRESETS.openai.baseUrl,
        model: PROVIDER_PRESETS.openai.model,
        systemPrompt: DEFAULT_SYSTEM_PROMPT
    });

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Load from LocalStorage
    useEffect(() => {
        const savedConfig = localStorage.getItem('ky-ai-config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved config", e);
            }
        }

        const savedMessages = localStorage.getItem('ky-ai-messages');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse saved messages", e);
            }
        } else {
            // Initial greeting if no messages
            setMessages([{
                role: 'assistant',
                content: '你好！我是你的 AI 教练。今天你想探讨什么话题？我们可以一起梳理你的目标、现状和可能的行动方案。'
            }]);
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('ky-ai-config', JSON.stringify(config));
    }, [config]);

    useEffect(() => {
        localStorage.setItem('ky-ai-messages', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleConfigChange = (field: keyof typeof config, value: string) => {
        setConfig(prev => {
            const newConfig = { ...prev, [field]: value };

            // If provider changes, update base URL and model defaults if not custom
            if (field === 'provider' && value !== 'custom') {
                const preset = PROVIDER_PRESETS[value as AIProvider];
                if (preset) {
                    newConfig.baseUrl = preset.baseUrl;
                    newConfig.model = preset.model;
                }
            }
            return newConfig;
        });
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        if (!config.apiKey) {
            setError("请先在设置中配置 API Key");
            setShowSettings(true);
            return;
        }

        const userMsg: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare messages with system prompt
            const apiMessages: ChatMessage[] = [
                { role: 'system', content: config.systemPrompt },
                ...messages,
                userMsg
            ];

            const responseContent = await fetchCompletion(apiMessages, config);

            setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "请求失败，请检查网络或 API Key");
            // Remove the user message if failed? Or just show error?
            // Better to keep user message but show error toast.
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm("确定要清空所有对话记录吗？")) {
            setMessages([{
                role: 'assistant',
                content: '对话已重置。我们可以重新开始探讨一个新的话题。'
            }]);
        }
    };

    const handleResetPrompt = () => {
        if (window.confirm("确定要恢复默认提示词吗？")) {
            handleConfigChange('systemPrompt', DEFAULT_SYSTEM_PROMPT);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] rounded-xl overflow-hidden relative">

            {/* Header / Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] z-10">
                <div className="flex items-center gap-2">
                    <Bot className="text-[var(--primary)]" />
                    <h3 className="font-bold text-lg">AI 教练</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleClearHistory}
                        className="p-2 hover:bg-[var(--glass-bg)] rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        title="清空记录"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                        title="设置"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex">

                {/* Chat Area - Hide on mobile when settings open */}
                <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${showSettings ? 'hidden md:flex' : 'flex'}`}>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-sidebar)] border border-[var(--border-color)]'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-[var(--primary)]" />}
                                </div>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${
                                    msg.role === 'user'
                                        ? 'bg-[var(--primary)] text-white rounded-tr-none'
                                        : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-tl-none text-[var(--text-main)] shadow-sm'
                                }`}>
                                    <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[var(--bg-sidebar)] border border-[var(--border-color)] flex items-center justify-center">
                                    <Bot size={16} className="text-[var(--primary)]" />
                                </div>
                                <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-4 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-center">
                                <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-red-500/20">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
                        <div className="flex gap-2 items-end max-w-4xl mx-auto">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="输入您的问题或想法..."
                                className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 max-h-32 min-h-[50px] resize-none focus:outline-none focus:border-[var(--primary)] transition-colors text-[var(--text-main)] placeholder-[var(--text-muted)]"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--primary)]/20 flex-shrink-0"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="text-center mt-2 text-xs text-[var(--text-muted)]">
                            AI 可能产生错误信息，请核实重要信息。API Key 仅存储在本地浏览器。
                        </div>
                    </div>
                </div>

                {/* Settings Panel (Overlay on mobile, Split on desktop) */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute md:relative inset-y-0 right-0 w-full md:w-[400px] bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] shadow-2xl z-20 overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg">设置</h3>
                                    <button onClick={() => setShowSettings(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                                        <ChevronDown className="rotate-[-90deg]" />
                                    </button>
                                </div>

                                {/* Provider Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-muted)]">AI 服务商</label>
                                    <select
                                        value={config.provider}
                                        onChange={(e) => handleConfigChange('provider', e.target.value)}
                                        className="w-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:border-[var(--primary)] outline-none appearance-none"
                                    >
                                        <option value="openai">OpenAI (GPT-4o)</option>
                                        <option value="deepseek">DeepSeek (深度求索)</option>
                                        <option value="moonshot">Moonshot (Kimi)</option>
                                        <option value="yi">Yi (零一万物)</option>
                                        <option value="custom">自定义 (Custom)</option>
                                    </select>
                                </div>

                                {/* API Key */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-muted)]">API Key</label>
                                    <input
                                        type="password"
                                        value={config.apiKey}
                                        onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                                        placeholder="sk-..."
                                        className="w-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                                    />
                                    <p className="text-xs text-[var(--text-muted)]">您的 Key 仅存储在本地浏览器 LocalStorage 中，不会上传至任何服务器。</p>
                                </div>

                                {/* Base URL */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-muted)]">API Base URL</label>
                                    <input
                                        type="text"
                                        value={config.baseUrl}
                                        onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                                        placeholder="https://api.openai.com/v1"
                                        className="w-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:border-[var(--primary)] outline-none font-mono text-sm"
                                    />
                                </div>

                                {/* Model Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-muted)]">模型名称 (Model)</label>
                                    <input
                                        type="text"
                                        value={config.model}
                                        onChange={(e) => handleConfigChange('model', e.target.value)}
                                        placeholder="gpt-4"
                                        className="w-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:border-[var(--primary)] outline-none font-mono text-sm"
                                    />
                                </div>

                                {/* System Prompt */}
                                <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-[var(--text-muted)]">系统提示词 (System Prompt)</label>
                                        <button
                                            onClick={handleResetPrompt}
                                            className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                                        >
                                            <RefreshCw size={10} /> 恢复默认
                                        </button>
                                    </div>
                                    <textarea
                                        value={config.systemPrompt}
                                        onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                                        className="w-full h-64 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:border-[var(--primary)] outline-none text-sm leading-relaxed scrollbar-hide"
                                    />
                                    <p className="text-xs text-[var(--text-muted)]">您可以修改提示词以调整 AI 教练的风格。</p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> 保存并返回
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AICoachingTool;
