import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCcw, Sparkles, Layout } from 'lucide-react'

const IMAGE_CARDS_COUNT = 89 // 0-88
const WORD_CARDS_DATA = [
    { index: 89, text: '感情' }, { index: 90, text: '孤独' }, { index: 91, text: '生气' }, { index: 92, text: '焦虑' },
    { index: 93, text: '道歉' }, { index: 94, text: '外表' }, { index: 95, text: '攻击' }, { index: 96, text: '吸引' },
    { index: 97, text: '开始' }, { index: 98, text: '夸赞' }, { index: 99, text: '厌烦' }, { index: 100, text: '上司' },
    { index: 101, text: '改变' }, { index: 102, text: '孩童' }, { index: 103, text: '诙谐' }, { index: 104, text: '强迫' },
    { index: 105, text: '顺应' }, { index: 106, text: '混乱' }, { index: 107, text: '循环' }, { index: 108, text: '危险' },
    { index: 109, text: '依赖' }, { index: 110, text: '破坏' }, { index: 111, text: '丢脸' }, { index: 112, text: '不喜欢' },
    { index: 113, text: '梦想' }, { index: 114, text: '消除' }, { index: 115, text: '尴尬' }, { index: 116, text: '色情' },
    { index: 117, text: '专家' }, { index: 118, text: '失败' }, { index: 119, text: '幻想' }, { index: 120, text: '父亲' },
    { index: 121, text: '恐惧' }, { index: 122, text: '坚定' }, { index: 123, text: '游戏' }, { index: 124, text: '付出' },
    { index: 125, text: '前进' }, { index: 126, text: '哀伤' }, { index: 127, text: '罪恶感' }, { index: 128, text: '习惯' },
    { index: 129, text: '憎恨' }, { index: 130, text: '犹豫' }, { index: 131, text: '躲藏' }, { index: 132, text: '执着' },
    { index: 133, text: '家' }, { index: 134, text: '同性恋' }, { index: 135, text: '希望' }, { index: 136, text: '羞辱' },
    { index: 137, text: '喜悦' }, { index: 138, text: '恐吓' }, { index: 139, text: '欢笑' }, { index: 140, text: '放开' },
    { index: 141, text: '谎言' }, { index: 142, text: '男性' }, { index: 143, text: '母亲' }, { index: 144, text: '裸体' },
    { index: 145, text: '亏欠' }, { index: 146, text: '痛苦' }, { index: 147, text: '姿态' }, { index: 148, text: '权利游戏' },
    { index: 149, text: '憎恶' }, { index: 150, text: '抗拒' }, { index: 151, text: '退省' }, { index: 152, text: '固执' },
    { index: 153, text: '敌对' }, { index: 154, text: '腐朽' }, { index: 155, text: '弄巧成拙' }, { index: 156, text: '羞愧' },
    { index: 157, text: '分享' }, { index: 158, text: '应该' }, { index: 159, text: '奴隶' }, { index: 160, text: '停止' },
    { index: 161, text: '陌生人' }, { index: 162, text: '愚蠢' }, { index: 163, text: '成功' }, { index: 164, text: '压抑' },
    { index: 165, text: '掠夺' }, { index: 166, text: '威胁' }, { index: 167, text: '丑陋' }, { index: 168, text: '受害者' },
    { index: 169, text: '违背' }, { index: 170, text: '等候' }, { index: 171, text: '疲惫' }, { index: 172, text: '聪明' },
    { index: 173, text: '女人' }, { index: 174, text: '奇妙' }, { index: 175, text: '错误' }, { index: 176, text: '爱情' }
]

export default function OHCardsTool({ onFinish }: { onFinish: (result: any) => void }) {
    const [drawnCards, setDrawnCards] = useState<{ image: number, word: { index: number, text: string } } | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    const draw = () => {
        setIsDrawing(true)
        setDrawnCards(null)

        setTimeout(() => {
            const imageIdx = Math.floor(Math.random() * IMAGE_CARDS_COUNT)
            const wordData = WORD_CARDS_DATA[Math.floor(Math.random() * WORD_CARDS_DATA.length)]
            const res = { image: imageIdx, word: wordData }
            setDrawnCards(res)
            setIsDrawing(false)
            onFinish(res)
        }, 1500)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
            <header className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2 text-[var(--text-main)]">OH 卡探索</h2>
                <p className="text-[var(--text-muted)]">点击按钮，开启潜意识的图景对话。</p>
            </header>

            <div className="relative w-full min-h-[400px] glass mb-12 flex items-center justify-center p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <AnimatePresence mode="wait">
                    {!drawnCards && !isDrawing && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-24 h-32 border-2 border-dashed border-[var(--text-muted)] rounded-xl mb-6 mx-auto flex items-center justify-center text-[var(--text-muted)]">
                                <Layout size={40} />
                            </div>
                            <p className="text-[var(--text-muted)] italic">准备好后点击下方按钮</p>
                        </motion.div>
                    )}

                    {isDrawing && (
                        <motion.div
                            key="drawing"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-40 h-56 bg-white/5 rounded-xl animate-pulse border border-white/10" />
                            <div className="w-40 h-56 bg-white/5 rounded-xl animate-pulse border border-white/10" />
                        </motion.div>
                    )}

                    {drawnCards && !isDrawing && (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col md:flex-row gap-8 items-center"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative w-48 h-64 bg-[var(--bg-main)] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-2xl">
                                    <img
                                        src={`/cards/image-card/${drawnCards.image}.jpg`}
                                        alt="Image Card"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as any).src = `https://via.placeholder.com/200x300?text=Img+${drawnCards.image}` }}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative w-48 h-64 bg-white rounded-xl flex items-center justify-center p-6 border border-slate-200 shadow-2xl overflow-hidden">
                                    <img
                                        src={`/cards/word-card/${drawnCards.word.index}${drawnCards.word.text}.jpg`}
                                        alt="Word Card"
                                        className="w-full h-full object-contain"
                                        onError={(e) => { (e.target as any).src = `https://via.placeholder.com/200x300?text=${drawnCards.word.text}` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                {!drawnCards ? (
                    <button
                        onClick={draw}
                        disabled={isDrawing}
                        className="px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <Sparkles size={20} /> 抽取的瞬间
                    </button>
                ) : (
                    <button
                        onClick={draw}
                        disabled={isDrawing}
                        className="px-8 py-4 bg-[var(--bg-card)] hover:bg-[var(--glass-bg)] text-[var(--text-main)] rounded-xl font-bold border border-[var(--border-color)] flex items-center gap-2 transition-all"
                    >
                        <RefreshCcw size={20} /> 重新抽取
                    </button>
                )}
            </div>

            {drawnCards && (
                <p className="mt-8 text-[var(--text-muted)] text-sm max-w-md text-center">
                    凝视这两张卡片，放松呼吸。尝试将图片表现的画面与核心关键词联系在一起。
                </p>
            )}
        </div>
    )
}
