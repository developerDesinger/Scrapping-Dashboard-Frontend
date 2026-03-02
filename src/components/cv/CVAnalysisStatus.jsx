import { Upload, FileSearch, Brain, Check } from 'lucide-react'

const steps = [
    { icon: Upload, label: 'Upload', key: 'upload' },
    { icon: FileSearch, label: 'Parse', key: 'parse' },
    { icon: Brain, label: 'Analyze', key: 'analyze' },
    { icon: Check, label: 'Match', key: 'match' },
]

const stepIndex = {
    idle: -1,
    uploading: 0,
    parsing: 1,
    analyzing: 2,
    complete: 3,
}

export default function CVAnalysisStatus({ status = 'idle' }) {
    const currentIdx = stepIndex[status] ?? -1

    if (status === 'idle') return null

    return (
        <div className="glass rounded-2xl p-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-surface-200 mb-6">Analysis Progress</h3>
            <div className="flex items-center justify-between">
                {steps.map((step, i) => {
                    const isComplete = i < currentIdx || status === 'complete'
                    const isCurrent = i === currentIdx && status !== 'complete'

                    return (
                        <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                    ${isComplete
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : isCurrent
                                                ? 'gradient-brand text-white shadow-lg shadow-brand-500/20 animate-pulse-soft'
                                                : 'glass-light text-surface-500'
                                        }
                  `}
                                >
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-xs font-medium ${isComplete || isCurrent ? 'text-surface-200' : 'text-surface-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex-1 mx-3 mt-[-20px]">
                                    <div className="h-[2px] rounded-full bg-surface-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500 w-full' : isCurrent ? 'gradient-brand w-1/2' : 'w-0'}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
