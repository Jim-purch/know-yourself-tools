import React, { useState } from 'react'
import { SolarTime } from 'tyme4ts'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card } from './ui/Card'

export default function BaziTool({ onFinish }: { onFinish: (result: any) => void }) {
    const [birthDate, setBirthDate] = useState('')
    const [birthTime, setBirthTime] = useState('12:00')
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const calculateBazi = () => {
        if (!birthDate) return
        setLoading(true)

        // Simulate a small delay for "processing" feel
        setTimeout(() => {
            const [year, month, day] = birthDate.split('-').map(Number)
            const [hour, minute] = birthTime.split(':').map(Number)

            // Tyme4ts SolarTime
            const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, 0)
            const eightChar = solarTime.getSixtyCycleHour().getEightChar()

            const data = {
                year: { stem: eightChar.getYear().getHeavenStem().getName(), branch: eightChar.getYear().getEarthBranch().getName() },
                month: { stem: eightChar.getMonth().getHeavenStem().getName(), branch: eightChar.getMonth().getEarthBranch().getName() },
                day: { stem: eightChar.getDay().getHeavenStem().getName(), branch: eightChar.getDay().getEarthBranch().getName() },
                hour: { stem: eightChar.getHour().getHeavenStem().getName(), branch: eightChar.getHour().getEarthBranch().getName() }
            }

            setResult(data)
            onFinish(data)
            setLoading(false)
        }, 600)
    }

    const Pillar = ({ name, stem, branch }: { name: string, stem: string, branch: string }) => (
        <Card variant="default" className="flex flex-col items-center gap-3 p-4 min-w-[80px]">
            <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">{name}</span>
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent-purple)] shadow-inner">
                    {stem}
                </div>
                <div className="aspect-square rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent-blue)] shadow-inner">
                    {branch}
                </div>
            </div>
        </Card>
    )

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <h2 className="text-3xl font-bold mb-2 text-[var(--text-main)]">八字排盘</h2>
                <p className="text-[var(--text-muted)]">输入您的生辰信息，探索命学奥秘。</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="space-y-6 md:col-span-1">
                    <Input
                        label="出生日期"
                        type="date"
                        icon={<CalendarIcon size={16} />}
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                    <Input
                        label="出生时间"
                        type="time"
                        icon={<Clock size={16} />}
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                    />

                    <Button
                        onClick={calculateBazi}
                        className="w-full py-6 text-lg"
                        isLoading={loading}
                        disabled={!birthDate}
                    >
                        {!loading && <Sparkles size={20} className="mr-2" />}
                        开始排盘
                    </Button>
                </div>

                <Card variant="glass" className="md:col-span-2 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                    {!result ? (
                        <p className="text-[var(--text-muted)] italic">请在左侧输入信息后点击排盘</p>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="grid grid-cols-4 gap-2 md:gap-4 w-full"
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
                </Card>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="default">
                        <h4 className="font-bold mb-4 text-[var(--accent-purple)]">排盘简析</h4>
                        <div className="space-y-3 text-[var(--text-main)] text-sm leading-relaxed">
                            <p>日主属：<span className="text-[var(--primary)] font-bold">{result.day.stem}</span>，代表您的核心原色。</p>
                            <p>年柱代表祖荫与童年；月柱代表父母与事业；日柱代表自身与配偶；时柱代表子女与晚年。</p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
