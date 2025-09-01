import { useState } from 'react'
import { Sparkles, Settings, Send, Lightbulb } from 'lucide-react'

const projects = [
  { id: '3PI', name: '3PI Platform', color: 'bg-purple-100 text-purple-700' },
  { id: 'Insurgents', name: 'Insurgents', color: 'bg-blue-100 text-blue-700' },
  { id: 'AI', name: 'AI/KAI', color: 'bg-green-100 text-green-700' },
  { id: 'General', name: 'General', color: 'bg-gray-100 text-gray-700' }
]

const priorities = [
  { id: 'low', name: 'Low', color: 'text-gray-600' },
  { id: 'medium', name: 'Medium', color: 'text-yellow-600' },
  { id: 'high', name: 'High', color: 'text-red-600' }
]

const outputFormats = [
  { id: 'markdown', name: 'Markdown', description: 'Clean, readable format' },
  { id: 'jira', name: 'Jira', description: 'Ready to paste into Jira' },
  { id: 'pdf', name: 'PDF', description: 'Professional document (coming soon)' },
  { id: 'confluence', name: 'Confluence', description: 'Wiki format (coming soon)' }
]

export default function InputForm({ 
  value, 
  onChange, 
  contentType, 
  context, 
  onContextChange, 
  onGenerate, 
  isGenerating,
  suggestions = []
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [charCount, setCharCount] = useState(value.length)

  const handleInputChange = (newValue) => {
    onChange(newValue)
    setCharCount(newValue.length)
  }

  const handleSuggestionClick = (suggestion) => {
    const currentValue = value.trim()
    const newValue = currentValue 
      ? `${currentValue} ${suggestion}` 
      : `I need a ${contentType} for ${suggestion}`
    handleInputChange(newValue)
  }

  const getPlaceholderText = () => {
    const placeholders = {
      epic: "I need an epic for user authentication improvements that integrates with our existing SSO infrastructure...",
      story: "I need a user story for login functionality that supports mobile biometric authentication...",
      prd: "I need a PRD for the 3PI platform integration framework that enables seamless third-party connections...",
      analysis: "I need an analysis of user engagement metrics from the past quarter to identify improvement opportunities...",
      summary: "I need a summary of the authentication planning meeting with key decisions and next steps...",
      'stakeholder-map': "I need a stakeholder map for the authentication project identifying key decision makers and influencers..."
    }
    return placeholders[contentType] || "Describe what you need to generate..."
  }

  const canGenerate = value.trim().length > 10 && !isGenerating

  return (
    <div className="space-y-6">
      {/* Main Input */}
      <div>
        <label htmlFor="user-input" className="block text-sm font-medium text-gray-700 mb-2">
          "I need a..." 
          <span className="text-gray-500 ml-2">({charCount} characters)</span>
        </label>
        <div className="relative">
          <textarea
            id="user-input"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={getPlaceholderText()}
            disabled={isGenerating}
            className={`
              input-field min-h-[120px] resize-y pr-12
              ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            maxLength={2000}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {2000 - charCount} remaining
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lightbulb className="h-4 w-4" />
            <span>AI Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isGenerating}
                className="suggestion-chip"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Basic Context & Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            id="project"
            value={context.project}
            onChange={(e) => onContextChange({ ...context, project: e.target.value })}
            disabled={isGenerating}
            className="input-field"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={context.priority}
            onChange={(e) => onContextChange({ ...context, priority: e.target.value })}
            disabled={isGenerating}
            className="input-field"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        disabled={isGenerating}
        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
      >
        <Settings className="h-4 w-4" />
        <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Settings</span>
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Advanced Configuration</h3>
          
          {/* Output Formats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Formats
            </label>
            <div className="space-y-2">
              {outputFormats.map((format) => (
                <label key={format.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={context.outputFormats.includes(format.id)}
                    onChange={(e) => {
                      const formats = e.target.checked
                        ? [...context.outputFormats, format.id]
                        : context.outputFormats.filter(f => f !== format.id)
                      onContextChange({ ...context, outputFormats: formats })
                    }}
                    disabled={isGenerating || (format.id === 'pdf' || format.id === 'confluence')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className={`text-sm font-medium ${
                      format.id === 'pdf' || format.id === 'confluence' 
                        ? 'text-gray-400' 
                        : 'text-gray-700'
                    }`}>
                      {format.name}
                    </span>
                    <p className="text-xs text-gray-500">{format.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Context Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context Enhancement
            </label>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  disabled={isGenerating}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Include relevant meeting notes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  disabled={isGenerating}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Include related documents</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  disabled={isGenerating}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Include similar content examples</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${canGenerate 
              ? 'btn-primary hover:scale-105 shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? (
            <>
              <div className="loading-spinner"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Content</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Input Validation */}
      {value.trim().length > 0 && value.trim().length < 10 && (
        <p className="text-sm text-orange-600 flex items-center space-x-1">
          <span>⚠️</span>
          <span>Please provide more detail (at least 10 characters) for better results</span>
        </p>
      )}
    </div>
  )
}