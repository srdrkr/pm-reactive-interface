import { FileText, GitBranch, FileCode, BarChart3, MessageSquare, Users } from 'lucide-react'

const contentTypes = [
  {
    id: 'epic',
    name: 'Epic',
    description: 'Comprehensive product epic with themes and stories',
    icon: GitBranch,
    color: 'bg-purple-100 text-purple-700',
    examples: 'User authentication, Mobile app redesign'
  },
  {
    id: 'story',
    name: 'Story',
    description: 'Well-formed user story with acceptance criteria',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    examples: 'Login flow, Profile editing'
  },
  {
    id: 'prd',
    name: 'PRD',
    description: 'Product Requirements Document',
    icon: FileCode,
    color: 'bg-green-100 text-green-700',
    examples: '3PI Platform, Integration framework'
  },
  {
    id: 'analysis',
    name: 'Analysis',
    description: 'Data-driven analysis with recommendations',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700',
    examples: 'User behavior, Performance metrics'
  },
  {
    id: 'summary',
    name: 'Summary',
    description: 'Concise stakeholder communication',
    icon: MessageSquare,
    color: 'bg-teal-100 text-teal-700',
    examples: 'Meeting recap, Project update'
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    description: 'Stakeholder relationship analysis',
    icon: Users,
    color: 'bg-pink-100 text-pink-700',
    examples: 'Project stakeholders, Team mapping'
  }
]

export default function ContentTypeSelector({ selectedType, onTypeChange, disabled = false }) {
  const selectedTypeData = contentTypes.find(type => type.id === selectedType)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Content Type</h2>
        {selectedTypeData && (
          <div className="flex items-center space-x-2">
            <selectedTypeData.icon className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">{selectedTypeData.description}</span>
          </div>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-3">
        {contentTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${type.color} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                  <p className="text-xs text-gray-500 mt-1">e.g. {type.examples}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Mobile Dropdown View */}
      <div className="sm:hidden">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        >
          {contentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.description}
            </option>
          ))}
        </select>
        
        {selectedTypeData && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1.5 rounded ${selectedTypeData.color}`}>
                <selectedTypeData.icon className="h-3 w-3" />
              </div>
              <span className="font-medium text-sm">{selectedTypeData.name}</span>
            </div>
            <p className="text-xs text-gray-600 mb-1">{selectedTypeData.description}</p>
            <p className="text-xs text-gray-500">Examples: {selectedTypeData.examples}</p>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      {selectedTypeData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            💡 Tips for {selectedTypeData.name}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {selectedType === 'epic' && (
              <>
                <li>• Include business value and success metrics</li>
                <li>• Break down into themes and user stories</li>
                <li>• Consider technical dependencies</li>
              </>
            )}
            {selectedType === 'story' && (
              <>
                <li>• Use "As a [user], I want [goal], so that [benefit]" format</li>
                <li>• Include specific acceptance criteria</li>
                <li>• Consider edge cases and error scenarios</li>
              </>
            )}
            {selectedType === 'prd' && (
              <>
                <li>• Define target users and use cases</li>
                <li>• Include market research and competitive analysis</li>
                <li>• Specify technical requirements and constraints</li>
              </>
            )}
            {selectedType === 'analysis' && (
              <>
                <li>• Include supporting data and methodology</li>
                <li>• Provide clear recommendations</li>
                <li>• Consider risks and next steps</li>
              </>
            )}
            {selectedType === 'summary' && (
              <>
                <li>• Focus on key decisions and outcomes</li>
                <li>• Include clear action items</li>
                <li>• Keep it concise and actionable</li>
              </>
            )}
            {selectedType === 'stakeholder-map' && (
              <>
                <li>• Identify influence vs interest levels</li>
                <li>• Include communication strategies</li>
                <li>• Map dependencies and relationships</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}