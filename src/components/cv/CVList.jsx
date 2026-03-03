import { Trash2, FileText, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { cvAPI } from '../../services/api'

export default function CVList({ cvs, loading, onCVDeleted }) {
    const handleDeleteCV = async (candidateId) => {
        try {
            await cvAPI.deleteCv(candidateId)
            toast.success('CV deleted successfully!')
            onCVDeleted(candidateId)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete CV. Please try again.')
            console.error('Error deleting CV:', err)
        }
    }

    if (loading) {
        return (
            <div>
                <h3 className="text-sm font-semibold text-surface-100 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-400" />
                    Uploaded CVs
                </h3>
                <div className="glass rounded-xl p-6 flex items-center justify-center gap-3">
                    <Loader className="h-5 w-5 text-brand-400 animate-spin" />
                    <p className="text-sm text-surface-300">Loading your CVs...</p>
                </div>
            </div>
        )
    }

    if (!cvs || cvs.length === 0) {
        return (
            <div>
                <h3 className="text-sm font-semibold text-surface-100 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-400" />
                    Uploaded CVs (0)
                </h3>
                <div className="glass rounded-xl p-6 text-center">
                    <FileText className="h-8 w-8 text-surface-600 mx-auto mb-2" />
                    <p className="text-sm text-surface-400">No CVs uploaded yet</p>
                    <p className="text-xs text-surface-500 mt-1">Upload your first CV above to get started</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-surface-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-brand-400" />
                    </div>
                    Uploaded CVs <span className="text-brand-400">({cvs.length})</span>
                </h3>
            </div>
            {cvs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cvs.map((cv) => {
                        const cvId = cv.id || cv.candidate_id
                        
                        return (
                            <div
                                key={cvId}
                                className="glass rounded-2xl overflow-hidden hover:border-brand-500/50 transition-all hover:shadow-lg hover:shadow-brand-500/10 group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-brand-500/20 transition-all">
                                                <FileText className="h-7 w-7 text-brand-400" />
                                            </div>
                                            <p className="text-lg font-bold text-surface-100 truncate">
                                                {cv.candidate_name || 'Unknown'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCV(cvId)}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors flex-shrink-0 ml-3"
                                            title="Delete CV"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="glass rounded-2xl p-12 text-center">
                    <FileText className="h-12 w-12 text-surface-600 mx-auto mb-4" />
                    <p className="text-lg text-surface-400 font-medium">No CVs uploaded yet</p>
                    <p className="text-sm text-surface-500 mt-2">Upload your first CV above to get started</p>
                </div>
            )}
        </div>
    )
}
