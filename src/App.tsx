import React, { useState, useEffect } from 'react'
import {
    Users,
    Sparkles,
    Calendar,
    Star,
    History,
    Download,
    ChevronRight,
    LayoutDashboard,
    BrainCircuit,
    Sun,
    Moon,
    Cpu,
    Menu,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './context/ThemeContext'

import MBTITool from './components/MBTITool'
import BaziTool from './components/BaziTool'
import OHCardsTool from './components/OHCardsTool'
import ZiWeiTool from './components/ZiWeiTool'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-color)]">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
            <button
                onClick={() => setTheme('tech')}
                className={`p-2 rounded-md transition-all ${theme === 'tech' ? 'bg-[var(--primary)] text-[var(--bg-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                title="Tech Mode"
            >
                <Cpu size={16} />
            </button>
        </div>
    )
}

export default function App() {
    const { theme } = useTheme();
    const [activeTool, setActiveTool] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
            colorVar: 'var(--primary)',
            bgVar: 'var(--primary-soft)',
            component: <MBTITool onFinish={(res: any) => addHistoryEntry('mbti', 'MBTI 测试', res)} />
        },
        {
            id: 'oh-cards',
            name: 'OH 卡探索',
            description: '潜意识图景卡片，开启心灵对话',
            icon: <Sparkles size={24} />,
            colorVar: 'var(--accent-purple)',
            bgVar: 'var(--accent-purple-soft)',
            component: <OHCardsTool onFinish={(res) => addHistoryEntry('oh-cards', 'OH 卡探索', res)} />
        },
        {
            id: 'bazi',
            name: '八字排盘',
            description: '传统命理精粹，解析生辰奥秘',
            icon: <Calendar size={24} />,
            colorVar: 'var(--accent-gold)',
            bgVar: 'var(--accent-gold-soft)',
            component: <BaziTool onFinish={(res) => addHistoryEntry('bazi', '八字排盘', res)} />
        },
        {
            id: 'ziwei',
            name: '紫微斗数',
            description: '帝王之学，推演人生轨迹',
            icon: <Star size={24} />,
            colorVar: 'var(--accent-rose)',
            bgVar: 'var(--accent-rose-soft)',
            component: <ZiWeiTool />
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg">
                        <Users className="text-[var(--bg-main)]" size={18} />
                    </div>
                    <span className="font-bold">知己工具箱</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-0 z-40 bg-[var(--bg-sidebar)] backdrop-blur-xl md:backdrop-blur-none
                w-full md:w-64 border-r border-[var(--border-color)] p-6 pt-24 md:p-6 flex flex-col gap-8
                transform transition-transform duration-300 md:transform-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="hidden md:flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                        <Users className="text-[var(--bg-main)]" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">知己工具箱</h1>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Self Discovery</p>
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                     <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-tighter">主题</span>
                     <ThemeSwitcher />
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => { setActiveTool(null); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${!activeTool ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm border-[var(--primary)] font-semibold' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="">主控制台</span>
                    </button>

                    <div className="mt-6 mb-2 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-tighter">探索工具</div>
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => { setActiveTool(tool.id); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${activeTool === tool.id ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm border-[var(--border-color)] font-semibold' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]'}`}
                        >
                            <div className={`p-1.5 rounded-md transition-all ${activeTool === tool.id ? 'shadow-[0_0_8px_var(--primary-soft)]' : ''}`} style={{ backgroundColor: tool.bgVar, color: tool.colorVar }}>
                                {tool.icon}
                            </div>
                            <span className="">{tool.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-8 overflow-y-auto max-h-[40vh] pr-2 scrollbar-hide">
                    <div className="px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-tighter mb-4 flex items-center justify-between">
                        <span>最近使用记录</span>
                        <History size={12} />
                    </div>
                    <div className="flex flex-col gap-2">
                        {history.length === 0 ? (
                            <p className="px-4 text-xs text-[var(--text-muted)] italic">暂无记录</p>
                        ) : (
                            history.slice(0, 10).map((item) => (
                                <div key={item.id} className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:border-[var(--primary)] transition-colors cursor-default">
                                    <div className="text-xs font-bold text-[var(--text-main)]">{item.toolName}</div>
                                    <div className="text-[10px] text-[var(--text-muted)]">{item.timestamp}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={exportData}
                        className="flex items-center gap-3 px-4 py-3 w-full text-[var(--primary)] hover:text-[var(--primary-hover)] hover:bg-[var(--primary)]/10 rounded-lg transition-all border border-transparent hover:border-[var(--primary)]/30"
                    >
                        <Download size={20} />
                        <span className="font-medium">导出所有数据</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-4 md:p-0">
                {/* Tech Theme Decorative Overlay */}
                {theme === 'tech' && (
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[var(--primary)] opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[var(--primary)] opacity-50"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-[var(--primary)] opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-[var(--primary)] opacity-30"></div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!activeTool ? (
                        <motion.div
                            key="dashboard"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 md:p-12 max-w-6xl mx-auto"
                        >
                            <motion.header variants={itemVariants} className="mb-12">
                                <h2 className="text-4xl font-bold title-gradient mb-4">开启您的自我探索之旅</h2>
                                <p className="text-[var(--text-muted)] text-lg max-w-2xl">
                                    集成心理学与传统智慧的多维探索平台，助您在纷繁世界中找回最真实的原色。
                                </p>
                            </motion.header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tools.map((tool) => (
                                    <motion.div
                                        key={tool.id}
                                        variants={itemVariants}
                                        onClick={() => setActiveTool(tool.id)}
                                        className="glass-card glass p-6 cursor-pointer group flex flex-col h-full border border-[var(--glass-border)] bg-[var(--glass-bg)]"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                                            style={{ backgroundColor: tool.bgVar, color: tool.colorVar }}
                                        >
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{tool.name}</h3>
                                        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 flex-1">
                                            {tool.description}
                                        </p>
                                        <div className="flex items-center text-[var(--primary)] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            开始使用 <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tool"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full bg-[var(--bg-card)]/50 rounded-xl m-0 md:m-6 overflow-hidden border border-[var(--border-color)]"
                        >
                             {/* Breadcrumb / Back Button for better UX */}
                            <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2">
                                <button onClick={() => setActiveTool(null)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 text-sm">
                                    <LayoutDashboard size={16}/> 控制台
                                </button>
                                <ChevronRight size={14} className="text-[var(--text-muted)]" />
                                <span className="text-[var(--text-main)] font-semibold">
                                    {tools.find(t => t.id === activeTool)?.name}
                                </span>
                            </div>
                            <div className="h-[calc(100%-60px)] overflow-y-auto">
                                {tools.find(t => t.id === activeTool)?.component}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
