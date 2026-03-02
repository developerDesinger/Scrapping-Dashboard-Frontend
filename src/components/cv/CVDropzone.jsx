import { useCallback, useState } from 'react'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'

export default function CVDropzone({ onFileSelect, disabled }) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const acceptedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }, [])

    const validateAndSelect = (file) => {
        if (!file) return
        if (!acceptedTypes.includes(file.type)) {
            alert('Please upload a PDF or DOCX file.')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be under 10MB.')
            return
        }
        setSelectedFile(file)
        onFileSelect?.(file)
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const file = e.dataTransfer?.files?.[0]
        validateAndSelect(file)
    }, [])

    const handleInputChange = (e) => {
        const file = e.target.files?.[0]
        validateAndSelect(file)
    }

    const clearFile = () => {
        setSelectedFile(null)
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    if (selectedFile && !disabled) {
        return (
            <div className="glass rounded-2xl p-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-200 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{formatSize(selectedFile.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <button
                            onClick={clearFile}
                            className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
        relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${dragActive
                    ? 'border-brand-500 bg-brand-500/10 scale-[1.02]'
                    : 'border-surface-700 hover:border-surface-500 hover:bg-surface-800/30'
                }
      `}
        >
            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleInputChange}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragActive ? 'bg-brand-500/20' : 'glass-light'}`}>
                    <Upload className={`h-7 w-7 ${dragActive ? 'text-brand-400' : 'text-surface-500'}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-surface-300">
                        {dragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">or click to browse • PDF, DOCX up to 10MB</p>
                </div>
            </div>
        </div>
    )
}
