import { X, Sparkles, FileText, GitBranch, FileCode, BarChart3, MessageSquare, Users, Clock } from 'lucide-react'

const contentTypeIcons = {
  epic: GitBranch,
  story: FileText,
  prd: FileCode,
  analysis: BarChart3,
  summary: MessageSquare,
  'stakeholder-map': Users
}

export default function MobileMenu({ isOpen, onClose, recentItems, onQuickAction, onRecentItemSelect }) {
  if (!isOpen) return null

  const quickActions = [
    { id: 'epic', name: 'Epic', color: 'bg-purple-100 text-purple-700' },
    { id: 'story', name: 'Story', color: 'bg-blue-100 text-blue-700' },
    { id: 'prd', name: 'PRD', color: 'bg-green-100 text-green-700' },
    { id: 'analysis', name: 'Analysis', color: 'bg-orange-100 text-orange-700' },
    { id: 'summary', name: 'Summary', color: 'bg-teal-100 text-teal-700' },
    { id: 'stakeholder-map', name: 'Stakeholder Map', color: 'bg-pink-100 text-pink-700' }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="sidebar-mobile open">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <span className="font-semibold text-gray-900">PM Orchestration</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(action => {
                const Icon = contentTypeIcons[action.id] || FileText
                
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      onQuickAction(action.id)
                      onClose()
                    }}
                    className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded ${action.color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {action.name}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Items */}
          {recentItems.length > 0 && (
            <div className="flex-1 p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Items</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {recentItems.slice(0, 8).map(item => {
                  const Icon = contentTypeIcons[item.type] || FileText
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onRecentItemSelect(item)
                        onClose()
                      }}
                      className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.preview}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-primary-600 font-medium">
                              {item.project}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-600">
                PM Orchestration Engine
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phase 6 Reactive Mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}