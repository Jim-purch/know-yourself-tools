import React, { useState } from 'react'
import { astro } from 'iztro'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Sparkles, User, Info } from 'lucide-react'

// Palace Grid Position Map (Standard Chart Layout)
// Si(5) Wu(6) Wei(7) Shen(8)
// Chen(4)          You(9)
// Mao(3)           Xu(10)
// Yin(2) Chou(1) Zi(0) Hai(11)
//
// We map EarthlyBranch Index (0=Zi, 1=Chou...) to Grid Cells (0-11, or specific row/col)
// Let's use a 4x4 Grid where cells are indexed 0-15.
// 0  1  2  3
// 4        5
// 6        7
// 8  9  10 11
//
// Mapping Branch Index to Visual Position:
// Si(5) -> 0, Wu(6) -> 1, Wei(7) -> 2, Shen(8) -> 3
// Chen(4) -> 4, You(9) -> 5
// Mao(3) -> 6, Xu(10) -> 7
// Yin(2) -> 8, Chou(1) -> 9, Zi(0) -> 10, Hai(11) -> 11

const branchToGridIndex: Record<number, number> = {
    5: 0, 6: 1, 7: 2, 8: 3,
    4: 4, 9: 5,
    3: 6, 10: 7,
    2: 8, 1: 9, 0: 10, 11: 11
}

export default function ZiWeiTool() {
    const [birthDate, setBirthDate] = useState('')
    const [birthTime, setBirthTime] = useState('12:00')
    const [gender, setGender] = useState<'男' | '女'>('男')
    const [astrolabe, setAstrolabe] = useState<any>(null)

    const calculateZiWei = () => {
        if (!birthDate) return
        const [hour] = birthTime.split(':').map(Number)

        // Calculate Time Index (0=Zi...11=Hai)
        // 23:00-01:00 = Zi (0)
        // 01:00-03:00 = Chou (1)
        // Formula: floor((hour + 1) / 2) % 12
        const timeIndex = Math.floor((hour + 1) / 2) % 12

        try {
            // solarDateStr must be YYYY-M-D or YYYY-MM-DD
            const result = astro.bySolar(birthDate, timeIndex, gender, true, 'zh-CN')
            setAstrolabe(result)
        } catch (e) {
            console.error("ZiWei Calculation Error", e)
        }
    }

    const PalaceCell = ({ palace }: { palace: any }) => {
        if (!palace) return <div className="bg-[var(--bg-card)]/30 border border-[var(--border-color)]/50 rounded-lg"></div>

        const isLifePalace = palace.name === '命宫'

        return (
            <div className={`
                relative p-1 md:p-2 border rounded-lg h-full flex flex-col justify-between overflow-hidden text-[10px] md:text-xs
                ${isLifePalace ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}
            `}>
                {/* Header: Earthly Branch & Palace Name */}
                <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[var(--accent-blue)] scale-75 origin-top-left md:scale-100">{palace.earthlyBranch}</span>
                    <span className={`font-bold ${isLifePalace ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'} scale-90 md:scale-100 origin-top-right`}>{palace.name}</span>
                </div>

                {/* Stars */}
                <div className="flex-1 flex flex-row justify-between gap-1 overflow-hidden">
                    {/* Major Stars (Red) */}
                    <div className="flex flex-col items-start">
                        {palace.majorStars.map((star: any) => (
                            <span key={star.name} className={`font-bold ${star.brightness === '庙' || star.brightness === '旺' ? 'text-[var(--accent-rose)]' : 'text-[var(--accent-rose)]/70'}`}>
                                {star.name}<span className="text-[8px] opacity-60 ml-0.5">{star.brightness}</span>
                            </span>
                        ))}
                    </div>
                    {/* Minor Stars (Purple/Blue) */}
                    <div className="flex flex-col items-end text-[var(--text-muted)] scale-90 origin-top-right">
                        {palace.minorStars.slice(0, 4).map((star: any) => (
                            <span key={star.name}>{star.name}</span>
                        ))}
                    </div>
                </div>

                {/* Footer: Decade & Ages */}
                <div className="border-t border-[var(--border-color)]/50 pt-1 mt-1 flex justify-between items-end opacity-80">
                    <span className="text-[var(--accent-purple)]">{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                    <span className="text-[var(--text-muted)] opacity-50">{palace.ages[0]}...</span>
                </div>
            </div>
        )
    }

    // Prepare grid cells
    const renderGrid = () => {
        if (!astrolabe) return null

        // Map palaces to grid cells
        // Palaces array usually is indexed by something, but we should find them by earthlyBranch or index.
        // FunctionalPalace has 'earthlyBranch' (Zi, Chou...)
        // We need to find the palace for each Branch Index (0-11)

        const branchNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        const getPalaceByBranch = (branch: string) => astrolabe.palaces.find((p: any) => p.earthlyBranch === branch)

        // 4x4 Grid
        // 0  1  2  3
        // 4  C  C  5  (C=Center)
        // 6  C  C  7
        // 8  9  10 11

        // Visual Order:
        // Row 1: Si(5), Wu(6), Wei(7), Shen(8)
        // Row 2 Left: Chen(4)
        // Row 2 Right: You(9)
        // Row 3 Left: Mao(3)
        // Row 3 Right: Xu(10)
        // Row 4: Yin(2), Chou(1), Zi(0), Hai(11)

        const cells = []

        // Row 1
        cells.push(getPalaceByBranch('巳'))
        cells.push(getPalaceByBranch('午'))
        cells.push(getPalaceByBranch('未'))
        cells.push(getPalaceByBranch('申'))

        // Row 2 (Middle is center)
        cells.push(getPalaceByBranch('辰'))
        // Center Placeholder 1
        // Center Placeholder 2
        cells.push(getPalaceByBranch('酉'))

        // Row 3
        cells.push(getPalaceByBranch('卯'))
        // Center Placeholder 3
        // Center Placeholder 4
        cells.push(getPalaceByBranch('戌'))

        // Row 4
        cells.push(getPalaceByBranch('寅'))
        cells.push(getPalaceByBranch('丑'))
        cells.push(getPalaceByBranch('子'))
        cells.push(getPalaceByBranch('亥'))

        return (
            <div className="grid grid-cols-4 gap-2 aspect-square w-full max-w-[600px] mx-auto bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)]">
                {/* Row 1 */}
                <div className="aspect-square">{cells[0] && <PalaceCell palace={cells[0]} />}</div>
                <div className="aspect-square">{cells[1] && <PalaceCell palace={cells[1]} />}</div>
                <div className="aspect-square">{cells[2] && <PalaceCell palace={cells[2]} />}</div>
                <div className="aspect-square">{cells[3] && <PalaceCell palace={cells[3]} />}</div>

                {/* Row 2 */}
                <div className="aspect-square">{cells[4] && <PalaceCell palace={cells[4]} />}</div>
                <div className="col-span-2 row-span-2 bg-[var(--bg-main)]/50 rounded-lg border border-[var(--border-color)] flex flex-col items-center justify-center text-center p-4">
                     {/* Center Info */}
                     <div className="text-xl font-bold text-[var(--primary)] mb-2">{astrolabe.solarDate}</div>
                     <div className="text-[var(--text-main)] mb-1">{astrolabe.gender}命  {astrolabe.fiveElementsClass}</div>
                     <div className="text-xs text-[var(--text-muted)]">
                        <div>命宫: {astrolabe.earthlyBranchOfSoulPalace}</div>
                        <div>身宫: {astrolabe.earthlyBranchOfBodyPalace}</div>
                     </div>
                     <div className="mt-4 text-[var(--accent-gold)] text-xs">
                        {astrolabe.zodiac} {astrolabe.sign}
                     </div>
                </div>
                <div className="aspect-square">{cells[5] && <PalaceCell palace={cells[5]} />}</div>

                {/* Row 3 */}
                <div className="aspect-square">{cells[6] && <PalaceCell palace={cells[6]} />}</div>
                {/* Center occupied */}
                <div className="aspect-square">{cells[7] && <PalaceCell palace={cells[7]} />}</div>

                {/* Row 4 */}
                <div className="aspect-square">{cells[8] && <PalaceCell palace={cells[8]} />}</div>
                <div className="aspect-square">{cells[9] && <PalaceCell palace={cells[9]} />}</div>
                <div className="aspect-square">{cells[10] && <PalaceCell palace={cells[10]} />}</div>
                <div className="aspect-square">{cells[11] && <PalaceCell palace={cells[11]} />}</div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 w-full">
            <header className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2 text-[var(--text-main)]">紫微斗数</h2>
                <p className="text-[var(--text-muted)]">帝王之学，推演人生轨迹。</p>
            </header>

            {!astrolabe ? (
                <div className="max-w-md mx-auto glass p-8 rounded-xl border border-[var(--border-color)] space-y-6">
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
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-2">
                            <User size={16} /> 性别
                        </label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setGender('男')}
                                className={`flex-1 py-3 rounded-xl border transition-all ${gender === '男' ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'}`}
                            >
                                男
                            </button>
                            <button
                                onClick={() => setGender('女')}
                                className={`flex-1 py-3 rounded-xl border transition-all ${gender === '女' ? 'bg-[var(--accent-rose)] border-[var(--accent-rose)] text-white' : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]'}`}
                            >
                                女
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={calculateZiWei}
                        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                        <Sparkles size={20} /> 开始排盘
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-full overflow-x-auto pb-4">
                        {renderGrid()}
                    </div>

                    <button
                        onClick={() => setAstrolabe(null)}
                        className="mt-8 px-6 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-muted)] rounded-lg transition-all"
                    >
                        重新排盘
                    </button>
                </motion.div>
            )}
        </div>
    )
}
