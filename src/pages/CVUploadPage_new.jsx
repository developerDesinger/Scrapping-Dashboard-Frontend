import { useState, useCallback, useEffect } from 'react'
import { FileText, CheckCircle2, Sparkles, Trash2 } from 'lucide-react'
import CVDropzone from '../components/cv/CVDropzone'
import CVAnalysisStatus from '../components/cv/CVAnalysisStatus'
import CVList from '../components/cv/CVList'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { cvAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function CVUploadPage() {
    const [file, setFile] = useState(null)
    const [candidateName, setCandidateName] = useState('')
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('idle') // idle | uploading | complete
    const [analysis, setAnalysis] = useState(null)
    const [candidateId, setCandidateId] = useState(null)
    
    // CV List states
    const [cvList, setCvList] = useState([])
    const [cvListLoading, setCvListLoading] = useState(false)
    const [cvListError, setCvListError] = useState(null)

    // Fetch CVs on component mount
    useEffect(() => {
        fetchUserCVs()
    }, [])

    const fetchUserCVs = async () => {
        setCvListLoading(true)
        setCvListError(null)
        try {
            const response = await cvAPI.getUserCVs()
            console.log('Raw API response:', response)
            
            // Handle different response structures
            const cvs = response.data?.data || response.data?.cvs || response.data || []
            console.log('Processed CVs:', cvs)
            
            setCvList(Array.isArray(cvs) ? cvs : [])
        } catch (err) {
            console.error('Error fetching CVs:', err)
            setCvListError('Failed to load CVs')
        } finally {
            setCvListLoading(false)
        }
    }

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile)
        setStatus('idle')
        setProgress(0)
        setAnalysis(null)
    }

    const handleUpload = useCallback(async () => {
        if (!file || !candidateName.trim()) {
            toast.error('Please enter candidate name and select a file.')
            return
        }

        try {
            setStatus('uploading')
            const result = await cvAPI.upload(file, candidateName, (p) => setProgress(p))

            setStatus('complete')
            setAnalysis(result.data)
            setCandidateId(result.data?.candidate_id || result.data?.id)
            toast.success('CV uploaded successfully!')
            
            // Refresh CV list
            await fetchUserCVs()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
            setStatus('idle')
            setProgress(0)
        }
    }, [file, candidateName])

    const handleDeleteCV = useCallback(async () => {
        if (!candidateId) {
            toast.error('No CV to delete.')
            return
        }

        if (!window.confirm('Are you sure you want to delete this CV?')) {
            return
        }

        try {
            await cvAPI.deleteCv(candidateId)
            setFile(null)
            setCandidateName('')
            setAnalysis(null)
            setCandidateId(null)
            setProgress(0)
            setStatus('idle')
            toast.success('CV deleted successfully!')
            
            // Refresh CV list
            await fetchUserCVs()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed. Please try again.')
        }
    }, [candidateId])

    const handleCVDeleted = async (deletedId) => {
        // Remove the deleted CV from the list
        setCvList((prevList) => prevList.filter((cv) => (cv.id || cv.candidate_id) !== deletedId))
    }

    const handleResetUpload = () => {
        setFile(null)
        setCandidateName('')
        setAnalysis(null)
        setCandidateId(null)
        setProgress(0)
        setStatus('idle')
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-surface-100">CV Upload</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Upload your CV to find the best matching jobs across all platforms
                </p>
            </div>

            {/* Main Content with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - CV List */}
                <div className="lg:col-span-1">
                    <CVList 
                        cvs={cvList} 
                        loading={cvListLoading} 
                        onCVDeleted={handleCVDeleted}
                    />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Candidate Name Input */}
                    {status === 'idle' && (
                        <Card>
                            <Input
                                placeholder="Enter candidate name"
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                disabled={status === 'uploading'}
                            />
                        </Card>
                    )}

                    {/* Upload Zone */}
                    <CVDropzone onFileSelect={handleFileSelect} disabled={status !== 'idle' && status !== 'complete'} />

                    {/* Upload Button */}
                    {file && status === 'idle' && (
                        <div className="flex justify-center animate-slide-up">
                            <Button onClick={handleUpload} size="lg" icon={Sparkles}>
                                Upload CV
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

                    {/* Results */}
                    {status === 'complete' && analysis && (
                        <Card className="animate-slide-up">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-surface-100">CV Uploaded Successfully</h2>
                                        <p className="text-sm text-surface-500">Your CV has been stored and processed</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDeleteCV}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete CV"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Candidate Name */}
                                <div className="glass-light rounded-xl p-4 text-center">
                                    <p className="text-lg font-semibold text-surface-200 mb-1 truncate">{analysis.candidate_name || candidateName}</p>
                                    <p className="text-xs text-surface-500">Candidate Name</p>
                                </div>

                                {/* Candidate ID */}
                                <div className="glass-light rounded-xl p-4 text-center">
                                    <p className="text-sm font-medium text-brand-400 mb-1 truncate">{analysis.candidate_id || candidateId}</p>
                                    <p className="text-xs text-surface-500">Candidate ID</p>
                                </div>

                                {/* File */}
                                <div className="glass-light rounded-xl p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <FileText className="h-4 w-4 text-brand-400" />
                                        <p className="text-sm font-medium text-surface-200 truncate">{analysis.filename || file.name}</p>
                                    </div>
                                    <p className="text-xs text-surface-500">Uploaded File</p>
                                </div>
                            </div>

                            {/* Skills */}
                            {analysis.skills && analysis.skills.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-surface-300 mb-3">Extracted Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.skills.map((skill) => (
                                            <Badge key={skill} variant="brand">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            {(analysis.experience || analysis.education) && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysis.experience && (
                                        <div className="glass-light rounded-xl p-4">
                                            <p className="text-xs text-surface-500 mb-1">Experience Level</p>
                                            <p className="text-sm font-medium text-surface-200">{analysis.experience}</p>
                                        </div>
                                    )}
                                    {analysis.education && (
                                        <div className="glass-light rounded-xl p-4">
                                            <p className="text-xs text-surface-500 mb-1">Education</p>
                                            <p className="text-sm font-medium text-surface-200">{analysis.education}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload New CV Button */}
                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={handleResetUpload}
                                    variant="secondary"
                                >
                                    Upload Another CV
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
