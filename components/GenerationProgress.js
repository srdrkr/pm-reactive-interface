import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Sparkles, FileText, Loader } from 'lucide-react'

const progressStages = {
  analyzing: {
    name: 'Analyzing Input',
    description: 'Understanding your request and requirements',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  searching: {
    name: 'Searching Context',
    description: 'Finding relevant documents and background information',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  generating: {
    name: 'Generating Content',
    description: 'Creating comprehensive content with AI assistance',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  formatting: {
    name: 'Formatting Output',
    description: 'Preparing content in multiple formats',
    icon: CheckCircle,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  complete: {
    name: 'Complete',
    description: 'Content generation successful!',
    icon: CheckCircle,
    color: 'text-success-600',
    bgColor: 'bg-success-50'
  }
}

export default function GenerationProgress({ progress, contentType }) {
  const [currentStage, setCurrentStage] = useState(progress.stage)
  const [estimatedTime, setEstimatedTime] = useState(30) // seconds
  const [elapsedTime, setElapsedTime] = useState(0)
  const [livePreview, setLivePreview] = useState('')

  const stageData = progressStages[currentStage] || progressStages.analyzing
  const Icon = stageData.icon

  // Update current stage when progress changes
  useEffect(() => {
    setCurrentStage(progress.stage)
  }, [progress.stage])

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate live preview updates
  useEffect(() => {
    if (progress.stage === 'generating') {
      const previewUpdates = [
        `# ${contentType === 'epic' ? 'Epic' : contentType === 'story' ? 'User Story' : 'Content'}: Loading...`,
        `# ${contentType === 'epic' ? 'Epic' : contentType === 'story' ? 'User Story' : 'Content'}: Enhanced Authentication System\n\n## Overview\nThis ${contentType} focuses on improving user authentication...`,
        `# ${contentType === 'epic' ? 'Epic' : contentType === 'story' ? 'User Story' : 'Content'}: Enhanced Authentication System\n\n## Overview\nThis ${contentType} focuses on improving user authentication experience by integrating with existing SSO infrastructure while adding support for mobile applications.\n\n## Business Value\n- Improved user experience and reduced login friction\n- Enhanced security posture and compliance adherence...`
      ]

      let updateIndex = 0
      const updateTimer = setInterval(() => {
        if (updateIndex < previewUpdates.length) {
          setLivePreview(previewUpdates[updateIndex])
          updateIndex++
        } else {
          clearInterval(updateTimer)
        }
      }, 2000)

      return () => clearInterval(updateTimer)
    }
  }, [progress.stage, contentType])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const getTimeRemaining = () => {
    const remaining = Math.max(0, estimatedTime - elapsedTime)
    return formatTime(remaining)
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Generating {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content...
        </h3>
        <p className="text-sm text-gray-600">
          Please wait while we create your content with AI assistance
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Progress: {progress.progress}%
          </span>
          <span className="text-sm text-gray-600">
            {getTimeRemaining()} remaining
          </span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {/* Current Stage */}
      <div className={`${stageData.bgColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-center space-x-3">
          <div className={`${stageData.color} p-2 rounded-full bg-white`}>
            {currentStage === progress.stage ? (
              <Icon className="h-5 w-5" />
            ) : (
              <Loader className="h-5 w-5 animate-spin" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium ${stageData.color}`}>
              {stageData.name}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {progress.message || stageData.description}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {Object.entries(progressStages).map(([stage, data], index) => {
            const isCompleted = progress.progress > index * 20
            const isCurrent = currentStage === stage
            const StageIcon = data.icon

            return (
              <div key={stage} className="flex flex-col items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success-100 border-success-500 text-success-600' 
                    : isCurrent
                      ? `${data.bgColor} border-gray-300 ${data.color}`
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <StageIcon className="h-4 w-4" />
                  )}
                </div>
                <span className={`
                  text-xs mt-1 text-center max-w-16 leading-tight
                  ${isCompleted ? 'text-success-600' : isCurrent ? data.color : 'text-gray-400'}
                `}>
                  {data.name}
                </span>
                
                {index < Object.keys(progressStages).length - 1 && (
                  <div className={`
                    absolute w-full h-0.5 mt-4 -z-10 transition-all duration-300
                    ${isCompleted ? 'bg-success-200' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Preview */}
      {livePreview && currentStage === 'generating' && (
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
            <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Live Preview</span>
              <span className="text-xs text-gray-500">(updating in real-time)</span>
            </h4>
          </div>
          
          <div className="p-4">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {livePreview}
              </pre>
            </div>
            
            {livePreview.length < 200 && (
              <div className="mt-3 flex items-center space-x-2 text-gray-500">
                <div className="loading-spinner"></div>
                <span className="text-sm">Content continues to generate...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {elapsedTime}s
          </div>
          <div className="text-xs text-gray-600">Elapsed</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {progress.progress}%
          </div>
          <div className="text-xs text-gray-600">Complete</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {getTimeRemaining()}
          </div>
          <div className="text-xs text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Cancel Option */}
      <div className="mt-4 text-center">
        <button 
          className="text-sm text-gray-500 hover:text-gray-700 underline"
          onClick={() => {
            if (window.confirm('Are you sure you want to cancel content generation?')) {
              window.location.reload()
            }
          }}
        >
          Cancel Generation
        </button>
      </div>
    </div>
  )
}