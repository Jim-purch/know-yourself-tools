import React, { useState } from 'react'
import { Solar, Lunar } from 'lunar-javascript'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react'

export default function BaziTool({ onFinish }: { onFinish: (result: any) => void }) {
    const [birthDate, setBirthDate] = useState('')
    const [birthTime, setBirthTime] = useState('12:00')
    const [result, setResult] = useState<any>(null)

    const calculateBazi = () => {
        if (!birthDate) return
        const [year, month, day] = birthDate.split('-').map(Number)
        const [hour, minute] = birthTime.split(':').map(Number)

        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        const data = {
            year: { stem: eightChar.getYearGan(), branch: eightChar.getYearZhi() },
            month: { stem: eightChar.getMonthGan(), branch: eightChar.getMonthZhi() },
            day: { stem: eightChar.getDayGan(), branch: eightChar.getDayZhi() },
            hour: { stem: eightChar.getHourGan(), branch: eightChar.getHourZhi() }
        }

        setResult(data)
        onFinish(data)
    }

    const Pillar = ({ name, stem, branch }: { name: string, stem: string, branch: string }) => (
        <div className="flex flex-col items-center gap-3">
            <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">{name}</span>
            <div className="flex flex-col gap-2">
                <div className="w-16 h-16 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent-purple)] shadow-inner">
                    {stem}
                </div>
                <div className="w-16 h-16 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent-blue)] shadow-inner">
                    {branch}
                </div>
            </div>
        </div>
    )

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <h2 className="text-3xl font-bold mb-2 text-[var(--text-main)]">八字排盘</h2>
                <p className="text-[var(--text-muted)]">输入您的生辰信息，探索命学奥秘。</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="space-y-6 md:col-span-1">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-2">
                            <CalendarIcon size={16} /> 出生日期
                        </label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-2">
                            <Clock size={16} /> 出生时间
                        </label>
                        <input
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                        />
                    </div>
                    <button
                        onClick={calculateBazi}
                        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                        <Sparkles size={20} /> 开始排盘
                    </button>
                </div>

                <div className="md:col-span-2 glass p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                    {!result ? (
                        <p className="text-[var(--text-muted)] italic">请在左侧输入信息后点击排盘</p>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex gap-4 md:gap-8"
                        >
                            <Pillar name="年柱" stem={result.year.stem} branch={result.year.branch} />
                            <Pillar name="月柱" stem={result.month.stem} branch={result.month.branch} />
                            <Pillar name="日柱" stem={result.day.stem} branch={result.day.branch} />
                            <Pillar name="时柱" stem={result.hour.stem} branch={result.hour.branch} />
                        </motion.div>
                    )}

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-purple)]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-blue)]/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)]">
                        <h4 className="font-bold mb-4 text-[var(--accent-purple)]">排盘简析</h4>
                        <div className="space-y-3 text-[var(--text-main)] text-sm leading-relaxed">
                            <p>日主属：<span className="text-[var(--primary)] font-bold">{result.day.stem}</span>，代表您的核心原色。</p>
                            <p>年柱代表祖荫与童年；月柱代表父母与事业；日柱代表自身与配偶；时柱代表子女与晚年。</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
