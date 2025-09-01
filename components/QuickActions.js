import { GitBranch, FileText, FileCode, BarChart3, MessageSquare, Users } from 'lucide-react'

const quickActions = [
  {
    id: 'epic',
    name: 'Epic',
    description: 'Comprehensive product epic',
    icon: GitBranch,
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    examples: ['User authentication', 'Mobile redesign']
  },
  {
    id: 'story',
    name: 'Story',
    description: 'User story with criteria',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    examples: ['Login flow', 'Profile editing']
  },
  {
    id: 'prd',
    name: 'PRD',
    description: 'Product requirements doc',
    icon: FileCode,
    color: 'bg-green-100 text-green-700 hover:bg-green-200',
    examples: ['3PI Platform', 'API framework']
  },
  {
    id: 'analysis',
    name: 'Analysis',
    description: 'Data-driven insights',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    examples: ['User behavior', 'Performance metrics']
  },
  {
    id: 'summary',
    name: 'Summary',
    description: 'Concise communication',
    icon: MessageSquare,
    color: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
    examples: ['Meeting recap', 'Project update']
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    description: 'Relationship analysis',
    icon: Users,
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    examples: ['Project stakeholders', 'Team mapping']
  }
]

export default function QuickActions({ currentType, onActionSelect, disabled = false }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-2">
        {quickActions.map(action => {
          const Icon = action.icon
          const isActive = currentType === action.id
          
          return (
            <button
              key={action.id}
              onClick={() => onActionSelect(action.id)}
              disabled={disabled}
              className={`
                w-full p-3 rounded-lg border text-left transition-all duration-200 group
                ${isActive 
                  ? 'border-primary-500 bg-primary-50 shadow-sm' 
                  : `border-gray-200 bg-white hover:border-gray-300 ${action.color} ${!disabled && 'hover:shadow-sm'}`
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg flex-shrink-0 transition-colors duration-200
                  ${isActive ? 'bg-primary-100 text-primary-700' : action.color}
                `}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`
                      font-medium text-sm 
                      ${isActive ? 'text-primary-900' : 'text-gray-900'}
                    `}>
                      {action.name}
                    </h4>
                    {isActive && (
                      <span className="text-xs text-primary-600 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <p className={`
                    text-xs mt-1 
                    ${isActive ? 'text-primary-700' : 'text-gray-600'}
                  `}>
                    {action.description}
                  </p>
                  
                  <div className="mt-2">
                    <p className={`
                      text-xs font-medium 
                      ${isActive ? 'text-primary-600' : 'text-gray-500'}
                    `}>
                      Examples:
                    </p>
                    <p className={`
                      text-xs 
                      ${isActive ? 'text-primary-600' : 'text-gray-500'}
                    `}>
                      {action.examples.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              
              {!disabled && (
                <div className={`
                  mt-2 text-xs transition-opacity duration-200
                  ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                `}>
                  Click to switch to {action.name.toLowerCase()} generation
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Pro Tip:</strong> Quick actions let you instantly switch content types. 
          Your input and context will be preserved when switching.
        </p>
      </div>
    </div>
  )
}