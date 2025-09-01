import { useState } from 'react'
import { FileText, MessageSquare, Lightbulb, ChevronDown, ChevronUp, Check, Plus } from 'lucide-react'

export default function ContextPanel({ suggestions, context, onContextChange, disabled = false }) {
  const [expandedSections, setExpandedSections] = useState({
    documents: true,
    meetings: true,
    templates: false,
    similar: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleDocument = (docPath) => {
    const isSelected = context.selectedDocs.includes(docPath)
    const newSelectedDocs = isSelected
      ? context.selectedDocs.filter(path => path !== docPath)
      : [...context.selectedDocs, docPath]
    
    onContextChange({
      ...context,
      selectedDocs: newSelectedDocs
    })
  }

  const toggleMeetingNote = (notePath) => {
    const isSelected = context.selectedNotes.includes(notePath)
    const newSelectedNotes = isSelected
      ? context.selectedNotes.filter(path => path !== notePath)
      : [...context.selectedNotes, notePath]
    
    onContextChange({
      ...context,
      selectedNotes: newSelectedNotes
    })
  }

  const relevantDocs = suggestions.results?.documents || []
  const meetingNotes = suggestions.results?.meetingNotes || []
  const templates = suggestions.results?.templates || []
  const similarContent = suggestions.results?.similarContent || []
  const aiSuggestions = suggestions.results?.suggestions || []

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Smart Context Assistant</h3>
        <div className="text-sm text-gray-500">
          {suggestions.totalResults} results found
        </div>
      </div>

      <div className="space-y-4">
        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">AI Recommendations</span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-blue-800">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relevant Documents */}
        {relevantDocs.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('documents')}
              disabled={disabled}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Relevant Documents</span>
                <span className="text-sm text-gray-500">({relevantDocs.length})</span>
              </div>
              {expandedSections.documents ? 
                <ChevronUp className="h-4 w-4 text-gray-600" /> : 
                <ChevronDown className="h-4 w-4 text-gray-600" />
              }
            </button>

            {expandedSections.documents && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {relevantDocs.map((doc, index) => {
                  const isSelected = context.selectedDocs.includes(doc.path)
                  
                  return (
                    <div key={index} className="p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDocument(doc.path)}
                            disabled={disabled}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {doc.title}
                            </h4>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className="text-xs text-gray-500">
                                {Math.round(doc.relevance * 100)}% match
                              </span>
                              <div 
                                className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden"
                                title={`${Math.round(doc.relevance * 100)}% relevance`}
                              >
                                <div 
                                  className="h-full bg-primary-600 transition-all duration-300"
                                  style={{ width: `${doc.relevance * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {doc.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 truncate">
                              {doc.path.replace(process.env.HOME || '/Users/jeremiah.weise', '~')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(doc.lastModified || doc.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Meeting Notes */}
        {meetingNotes.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('meetings')}
              disabled={disabled}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Meeting Notes</span>
                <span className="text-sm text-gray-500">({meetingNotes.length})</span>
              </div>
              {expandedSections.meetings ? 
                <ChevronUp className="h-4 w-4 text-gray-600" /> : 
                <ChevronDown className="h-4 w-4 text-gray-600" />
              }
            </button>

            {expandedSections.meetings && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {meetingNotes.map((note, index) => {
                  const isSelected = context.selectedNotes.includes(note.path)
                  
                  return (
                    <div key={index} className="p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMeetingNote(note.path)}
                            disabled={disabled}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {note.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                {note.project}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round(note.relevance * 100)}% match
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {note.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {note.date}
                              </span>
                              {note.attendees && (
                                <span className="text-xs text-gray-400">
                                  • {note.attendees.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Templates & Examples */}
        {templates.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('templates')}
              disabled={disabled}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Templates & Examples</span>
                <span className="text-sm text-gray-500">({templates.length})</span>
              </div>
              {expandedSections.templates ? 
                <ChevronUp className="h-4 w-4 text-gray-600" /> : 
                <ChevronDown className="h-4 w-4 text-gray-600" />
              }
            </button>

            {expandedSections.templates && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {templates.map((template, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Used {template.usage} times
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {template.description}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          Last used: {new Date(template.lastUsed).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button
                        disabled={disabled}
                        className="ml-3 btn-secondary text-xs"
                        title="Apply template (coming soon)"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Similar Content */}
        {similarContent.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('similar')}
              disabled={disabled}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Similar Content</span>
                <span className="text-sm text-gray-500">({similarContent.length})</span>
              </div>
              {expandedSections.similar ? 
                <ChevronUp className="h-4 w-4 text-gray-600" /> : 
                <ChevronDown className="h-4 w-4 text-gray-600" />
              }
            </button>

            {expandedSections.similar && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {similarContent.map((content, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {content.title}
                          </h4>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {content.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(content.similarity * 100)}% similar
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {content.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{content.project}</span>
                          <span>{new Date(content.createdDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Context Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Context Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Selected Documents:</span>
              <span className="ml-2 font-medium text-gray-900">
                {context.selectedDocs.length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Selected Notes:</span>
              <span className="ml-2 font-medium text-gray-900">
                {context.selectedNotes.length}
              </span>
            </div>
          </div>
          
          {(context.selectedDocs.length > 0 || context.selectedNotes.length > 0) && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                💡 Selected context will be automatically included in content generation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}