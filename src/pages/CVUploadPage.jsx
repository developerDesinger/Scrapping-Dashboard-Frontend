import { useState, useCallback } from 'react'
import { FileText, CheckCircle2, Sparkles } from 'lucide-react'
import CVDropzone from '../components/cv/CVDropzone'
import CVAnalysisStatus from '../components/cv/CVAnalysisStatus'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { cvAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function CVUploadPage() {
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('idle') // idle | uploading | parsing | analyzing | complete
    const [analysis, setAnalysis] = useState(null)

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile)
        setStatus('idle')
        setProgress(0)
        setAnalysis(null)
    }

    const handleUpload = useCallback(async () => {
        if (!file) return

        try {
            setStatus('uploading')
            const result = await cvAPI.upload(file, (p) => setProgress(p))

            setStatus('parsing')
            await new Promise((r) => setTimeout(r, 1000))

            setStatus('analyzing')
            await new Promise((r) => setTimeout(r, 1500))

            setStatus('complete')
            setAnalysis(result.data)
            toast.success('CV analyzed successfully!')
        } catch (err) {
            toast.error('Upload failed. Please try again.')
            setStatus('idle')
            setProgress(0)
        }
    }, [file])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-surface-100">CV Upload</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Upload your CV to find the best matching jobs across all platforms
                </p>
            </div>

            {/* Upload Zone */}
            <CVDropzone onFileSelect={handleFileSelect} disabled={status !== 'idle' && status !== 'complete'} />

            {/* Upload Button */}
            {file && status === 'idle' && (
                <div className="flex justify-center animate-slide-up">
                    <Button onClick={handleUpload} size="lg" icon={Sparkles}>
                        Analyze CV
                    </Button>
                </div>
            )}

            {/* Progress Bar */}
            {status === 'uploading' && (
                <Card className="animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-surface-300">Uploading...</span>
                        <span className="text-sm font-medium text-brand-400">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-800 overflow-hidden">
                        <div
                            className="h-full rounded-full gradient-brand transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </Card>
            )}

            {/* Analysis Steps */}
            <CVAnalysisStatus status={status} />

            {/* Results */}
            {status === 'complete' && analysis && (
                <Card className="animate-slide-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-surface-100">Analysis Complete</h2>
                            <p className="text-sm text-surface-500">Your CV has been analyzed and matched</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Match Score */}
                        <div className="glass-light rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-gradient mb-1">{analysis.matchScore}%</p>
                            <p className="text-xs text-surface-500">Overall Match Score</p>
                        </div>

                        {/* Experience */}
                        <div className="glass-light rounded-xl p-4 text-center">
                            <p className="text-lg font-semibold text-surface-200 mb-1">{analysis.experience}</p>
                            <p className="text-xs text-surface-500">Experience Level</p>
                        </div>

                        {/* File */}
                        <div className="glass-light rounded-xl p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-brand-400" />
                                <p className="text-sm font-medium text-surface-200 truncate">{analysis.filename}</p>
                            </div>
                            <p className="text-xs text-surface-500">Uploaded File</p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-semibold text-surface-300 mb-3">Extracted Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skills.map((skill) => (
                                <Badge key={skill} variant="brand">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
