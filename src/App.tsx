import React, { useState, useEffect } from 'react'
import {
    Users,
    Sparkles,
    Calendar,
    Star,
    History,
    Download,
    ExternalLink,
    ChevronRight,
    LayoutDashboard,
    BrainCircuit
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import MBTITool from './components/MBTITool'
import BaziTool from './components/BaziTool'
import OHCardsTool from './components/OHCardsTool'

// Placeholder for Zi Wei Tool
const ZiWeiTool = () => (
    <div className="p-8 max-w-2xl mx-auto h-full flex flex-col justify-center text-center">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">紫微斗数</h2>
        <p className="text-slate-400 mb-8">精准的人生星盘分析。该模块正在研发中，敬请期待。</p>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-500">紫微排盘涉及复杂的星曜布局，我们将为您提供最专业的推演算法。</p>
        </div>
    </div>
)

export default function App() {
    const [activeTool, setActiveTool] = useState<string | null>(null)
    const [history, setHistory] = useState<any[]>(() => {
        const saved = localStorage.getItem('ky-tools-history')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('ky-tools-history', JSON.stringify(history))
    }, [history])

    const addHistoryEntry = (toolId: string, toolName: string, result: any) => {
        const entry = {
            id: Date.now(),
            toolId,
            toolName,
            timestamp: new Date().toLocaleString(),
            result
        }
        setHistory(prev => [entry, ...prev])
    }

    const exportData = () => {
        const dataStr = JSON.stringify(history, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `know-yourself-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const tools = [
        {
            id: 'mbti',
            name: 'MBTI 性格测试',
            description: '深入了解你的性格底色与职业偏向',
            icon: <BrainCircuit size={24} />,
            color: 'bg-indigo-500/20 text-indigo-400',
            component: <MBTITool onFinish={(res: any) => addHistoryEntry('mbti', 'MBTI 测试', res)} />
        },
        {
            id: 'oh-cards',
            name: 'OH 卡探索',
            description: '潜意识图景卡片，开启心灵对话',
            icon: <Sparkles size={24} />,
            color: 'bg-purple-500/20 text-purple-400',
            component: <OHCardsTool onFinish={(res) => addHistoryEntry('oh-cards', 'OH 卡探索', res)} />
        },
        {
            id: 'bazi',
            name: '八字排盘',
            description: '传统命理精粹，解析生辰奥秘',
            icon: <Calendar size={24} />,
            color: 'bg-amber-500/20 text-amber-400',
            component: <BaziTool onFinish={(res) => addHistoryEntry('bazi', '八字排盘', res)} />
        },
        {
            id: 'ziwei',
            name: '紫微斗数',
            description: '帝王之学，推演人生轨迹',
            icon: <Star size={24} />,
            color: 'bg-rose-500/20 text-rose-400',
            component: <ZiWeiTool />
        }
    ]

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-slate-200">
            {/* Sidebar */}
            <aside className="w-full md:w-64 glass border-r border-slate-800 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Users className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">知己工具箱</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Self Discovery</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTool(null)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${!activeTool ? 'bg-slate-800/50 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">主控制台</span>
                    </button>

                    <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-600 uppercase tracking-tighter">探索工具</div>
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTool === tool.id ? 'bg-slate-800/50 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
                        >
                            <div className={`p-1.5 rounded-md ${tool.color}`}>
                                {tool.icon}
                            </div>
                            <span className="font-medium">{tool.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-8 overflow-y-auto max-h-[40vh] pr-2 scrollbar-hide">
                    <div className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-tighter mb-4 flex items-center justify-between">
                        <span>最近使用记录</span>
                        <History size={12} />
                    </div>
                    <div className="flex flex-col gap-2">
                        {history.length === 0 ? (
                            <p className="px-4 text-xs text-slate-600 italic">暂无记录</p>
                        ) : (
                            history.slice(0, 10).map((item) => (
                                <div key={item.id} className="p-3 bg-slate-800/20 border border-slate-800/50 rounded-lg">
                                    <div className="text-xs font-bold text-slate-300">{item.toolName}</div>
                                    <div className="text-[10px] text-slate-500">{item.timestamp}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={exportData}
                        className="flex items-center gap-3 px-4 py-3 w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                        <Download size={20} />
                        <span className="font-medium">导出所有数据</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950/20 relative">
                <AnimatePresence mode="wait">
                    {!activeTool ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-8 md:p-12 max-w-6xl mx-auto"
                        >
                            <header className="mb-12">
                                <h2 className="text-4xl font-bold title-gradient mb-4">开启您的自我探索之旅</h2>
                                <p className="text-slate-400 text-lg max-w-2xl">
                                    集成心理学与传统智慧的多维探索平台，助您在纷繁世界中找回最真实的原色。
                                </p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tools.map((tool) => (
                                    <div
                                        key={tool.id}
                                        onClick={() => setActiveTool(tool.id)}
                                        className="glass-card glass p-6 cursor-pointer group flex flex-col h-full"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                            {tool.description}
                                        </p>
                                        <div className="flex items-center text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            开始使用 <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full bg-slate-900/40"
                        >
                            {tools.find(t => t.id === activeTool)?.component}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
