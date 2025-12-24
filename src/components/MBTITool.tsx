import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react'

const questions = [
    { id: 1, text: '在社交聚会中，你通常：', options: [{ text: '与多人交谈，包括陌生人', type: 'E' }, { text: '只与少数熟识的人交谈', type: 'I' }] },
    { id: 2, text: '你更倾向于：', options: [{ text: '实际、具体、着眼于当前', type: 'S' }, { text: '直觉、抽象、着眼于未来', type: 'N' }] },
    { id: 3, text: '在做决策时，你更依赖：', options: [{ text: '逻辑分析与客观事实', type: 'T' }, { text: '个人价值观与对他人的影响', type: 'F' }] },
    { id: 4, text: '你更喜欢的工作方式是：', options: [{ text: '有计划、有条理、按部就班', type: 'J' }, { text: '灵活、自发、随遇而安', type: 'P' }] },
    { id: 5, text: '在一天的劳累之后，你感到恢复精力的方式是：', options: [{ text: '和朋友聚在一起聊天', type: 'E' }, { text: '一个人安静地待着', type: 'I' }] },
    { id: 6, text: '你更倾向于注意到：', options: [{ text: '细节与真实发生的事情', type: 'S' }, { text: '联系、暗示与隐藏的含义', type: 'N' }] },
    { id: 7, text: '你认为哪种评价更悦耳：', options: [{ text: '“一个冷静理智的人”', type: 'T' }, { text: '“一个有同情心的人”', type: 'F' }] },
    { id: 8, text: '你是否通常：', options: [{ text: '早早做好决定并感到轻松', type: 'J' }, { text: '保留选择权并等待更多信息', type: 'P' }] },
]

export default function MBTITool({ onFinish }: { onFinish: (result: string) => void }) {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [showResult, setShowResult] = useState(false)

    const handleSelect = (type: string) => {
        const newAnswers = { ...answers, [questions[currentIdx].id]: type }
        setAnswers(newAnswers)

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1)
        } else {
            calculateResult(newAnswers)
        }
    }

    const calculateResult = (finalAnswers: Record<number, string>) => {
        const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
        Object.values(finalAnswers).forEach(type => {
            counts[type] = (counts[type] || 0) + 1
        })

        const result = [
            counts.E >= counts.I ? 'E' : 'I',
            counts.S >= counts.N ? 'S' : 'N',
            counts.T >= counts.F ? 'T' : 'F',
            counts.J >= counts.P ? 'J' : 'P'
        ].join('')

        setShowResult(true)
        onFinish(result)
    }

    if (showResult) {
        const result = [
            answers[1] === answers[5] ? answers[1] : (answers[1] || 'E'),
            // simplified logic for brevity, in real app counts would be used
        ].join('') // This is just a placeholder, the logic above is more correct

        const finalResult = [
            (Object.values(answers).filter(a => a === 'E').length >= Object.values(answers).filter(a => a === 'I').length) ? 'E' : 'I',
            (Object.values(answers).filter(a => a === 'S').length >= Object.values(answers).filter(a => a === 'N').length) ? 'S' : 'N',
            (Object.values(answers).filter(a => a === 'T').length >= Object.values(answers).filter(a => a === 'F').length) ? 'T' : 'F',
            (Object.values(answers).filter(a => a === 'J').length >= Object.values(answers).filter(a => a === 'P').length) ? 'J' : 'P'
        ].join('')

        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">您的性格类型是：{finalResult}</h2>
                    <p className="text-slate-400 mb-8">这是一个初步的探索，MBTI 只是了解自我的一个窗口。</p>

                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8 text-left">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            结果解读
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            您的测试结果显示您在各个维度上的偏好。这个结果已经保存到您的历史记录中，您可以随时导出。
                        </p>
                    </div>

                    <button
                        onClick={() => { setShowResult(false); setCurrentIdx(0); setAnswers({}); }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl mx-auto transition-all"
                    >
                        <RotateCcw size={18} /> 重新测试
                    </button>
                </motion.div>
            </div>
        )
    }

    const progress = ((currentIdx + 1) / questions.length) * 100

    return (
        <div className="p-8 max-w-2xl mx-auto h-full flex flex-col justify-center">
            <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-500 font-medium">问题 {currentIdx + 1} / {questions.length}</span>
                    <span className="text-indigo-400 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-500"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold mb-8 leading-tight">{questions[currentIdx].text}</h2>
                    <div className="flex flex-col gap-4">
                        {questions[currentIdx].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(opt.type)}
                                className="w-full text-left p-6 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800/80 hover:border-indigo-500 hover:scale-[1.01] transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-lg text-slate-200 group-hover:text-white">{opt.text}</span>
                                    <div className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-indigo-500 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-8 border-t border-slate-800 flex justify-between">
                <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentIdx === 0 ? 'text-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <ChevronLeft size={20} /> 上一题
                </button>
            </div>
        </div>
    )
}
