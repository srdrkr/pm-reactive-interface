import { useState } from 'react'
import { Copy, Check, Download, Share2, RotateCcw, Save, ExternalLink, FileText, Code, File } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const formatTypes = {
  markdown: {
    name: 'Markdown',
    description: 'Clean, readable format',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  jira: {
    name: 'Jira',
    description: 'Ready to paste into Jira',
    icon: Code,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  pdf: {
    name: 'PDF',
    description: 'Professional document',
    icon: File,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  confluence: {
    name: 'Confluence',
    description: 'Wiki format',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
}

export default function OutputManager({ content, contentType, context, onRegenerate }) {
  const [activeFormat, setActiveFormat] = useState('markdown')
  const [copiedStates, setCopiedStates] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(true)

  const copyToClipboard = async (text, format) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [format]: true }))
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [format]: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopiedStates(prev => ({ ...prev, [format]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [format]: false }))
      }, 2000)
    }
  }

  const downloadContent = (text, format) => {
    const extensions = {
      markdown: 'md',
      jira: 'txt',
      pdf: 'txt',
      confluence: 'txt'
    }
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${contentType}-${Date.now()}.${extensions[format] || 'txt'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getContentForFormat = (format) => {
    if (!content?.content) return ''
    
    switch (format) {
      case 'markdown':
        return content.content.markdown || ''
      case 'jira':
        return content.content.jira?.copyPasteFormat || content.content.jira?.description || ''
      case 'pdf':
        return content.content.pdf?.markdown || content.content.markdown || ''
      case 'confluence':
        return content.content.confluence?.markdown || content.content.markdown || ''
      default:
        return content.content.markdown || ''
    }
  }

  const availableFormats = Object.keys(content?.content || {}).filter(format => 
    formatTypes[format] && content.content[format]
  )

  const extractTitle = (text) => {
    const titleMatch = text?.match(/^#\s+(.+)$/m)
    return titleMatch ? titleMatch[1].trim() : `Generated ${contentType}`
  }

  const getWordCount = (text) => {
    return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0
  }

  const getReadingTime = (text) => {
    const words = getWordCount(text)
    const minutes = Math.ceil(words / 200) // Average reading speed
    return minutes
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="card bg-success-50 border-success-200">
        <div className="flex items-center space-x-3">
          <div className="bg-success-100 p-2 rounded-full">
            <Check className="h-5 w-5 text-success-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-success-900">
              Content Generated Successfully!
            </h3>
            <p className="text-sm text-success-700">
              {extractTitle(getContentForFormat('markdown'))}
            </p>
          </div>
          <div className="text-sm text-success-600">
            Generated in {Math.round((content.processingTime || 15000) / 1000)}s
          </div>
        </div>
      </div>

      {/* Output Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Generated Content</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="btn-secondary text-sm"
            >
              {isPreviewMode ? 'Show Raw' : 'Show Preview'}
            </button>
            <button
              onClick={onRegenerate}
              className="btn-secondary text-sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {availableFormats.map(format => {
            const formatData = formatTypes[format]
            const Icon = formatData.icon
            const isActive = activeFormat === format
            
            return (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-all duration-200
                  ${isActive 
                    ? `border-primary-500 ${formatData.bgColor} ${formatData.color}` 
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{formatData.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {getWordCount(getContentForFormat(activeFormat))}
            </div>
            <div className="text-xs text-gray-600">Words</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {getContentForFormat(activeFormat).split('\n').length}
            </div>
            <div className="text-xs text-gray-600">Lines</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              ~{getReadingTime(getContentForFormat(activeFormat))}m
            </div>
            <div className="text-xs text-gray-600">Read Time</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => copyToClipboard(getContentForFormat(activeFormat), activeFormat)}
            className="btn-primary"
            disabled={!getContentForFormat(activeFormat)}
          >
            {copiedStates[activeFormat] ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={() => downloadContent(getContentForFormat(activeFormat), activeFormat)}
            className="btn-secondary"
            disabled={!getContentForFormat(activeFormat)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>

          <button
            className="btn-secondary"
            disabled
            title="Coming soon"
          >
            <Save className="h-4 w-4 mr-2" />
            Save to GitHub
          </button>

          {activeFormat === 'jira' && (
            <button
              className="btn-secondary"
              disabled
              title="Direct Jira integration coming soon"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Jira Ticket
            </button>
          )}
        </div>

        {/* Content Display */}
        <div className="border border-gray-200 rounded-lg">
          {/* Content Header */}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <formatTypes[activeFormat].icon className="h-4 w-4" />
                <span>{formatTypes[activeFormat].name} Output</span>
              </h5>
              <span className="text-xs text-gray-500">
                {formatTypes[activeFormat].description}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin">
            {isPreviewMode && activeFormat === 'markdown' ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{getContentForFormat(activeFormat)}</ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {getContentForFormat(activeFormat)}
              </pre>
            )}
            
            {!getContentForFormat(activeFormat) && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No content available for this format</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jira-Specific Information */}
      {activeFormat === 'jira' && content.content.jira?.fields && (
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Jira Field Mapping</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(content.content.jira.fields).map(([field, value]) => (
              <div key={field} className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </div>
                <div className="text-sm text-gray-900">
                  {Array.isArray(value) ? value.join(', ') : value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Jira Integration:</strong> Copy the content above and paste directly into your Jira ticket description. 
              The field mappings shown here can be used to populate the appropriate Jira fields.
            </p>
          </div>
        </div>
      )}

      {/* Generation Context */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Generation Context</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {content.context?.documentsUsed || 0}
            </div>
            <div className="text-xs text-gray-600">Documents Used</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {content.context?.suggestionsApplied || 0}
            </div>
            <div className="text-xs text-gray-600">AI Suggestions</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {content.context?.projectContext || 'General'}
            </div>
            <div className="text-xs text-gray-600">Project Context</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {content.context?.priority || 'Medium'}
            </div>
            <div className="text-xs text-gray-600">Priority Level</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Generated on {new Date(content.generatedAt).toLocaleString()} 
          • Processing time: {Math.round((content.processingTime || 0) / 1000)}s
          • Content type: {contentType}
        </div>
      </div>
    </div>
  )
}