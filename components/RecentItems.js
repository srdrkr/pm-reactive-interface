import { Clock, FileText, GitBranch, FileCode, BarChart3, MessageSquare, Users, Trash2 } from 'lucide-react'

const contentTypeIcons = {
  epic: GitBranch,
  story: FileText,
  prd: FileCode,
  analysis: BarChart3,
  summary: MessageSquare,
  'stakeholder-map': Users
}

const projectColors = {
  '3PI': 'bg-purple-100 text-purple-700',
  'Insurgents': 'bg-blue-100 text-blue-700',
  'AI': 'bg-green-100 text-green-700',
  'General': 'bg-gray-100 text-gray-700'
}

export default function RecentItems({ items, onItemSelect }) {
  const clearRecentItems = () => {
    if (window.confirm('Are you sure you want to clear all recent items?')) {
      localStorage.removeItem('pm-reactive-recent-items')
      window.location.reload()
    }
  }

  const removeItem = (itemId, event) => {
    event.stopPropagation()
    
    const updatedItems = items.filter(item => item.id !== itemId)
    localStorage.setItem('pm-reactive-recent-items', JSON.stringify(updatedItems))
    window.location.reload()
  }

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  if (items.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h3>
        
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">No recent items yet</p>
          <p className="text-xs text-gray-500">
            Generate your first content to see it appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
        <button
          onClick={clearRecentItems}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
          title="Clear all recent items"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
        {items.map(item => {
          const Icon = contentTypeIcons[item.type] || FileText
          const projectColor = projectColors[item.project] || projectColors.General
          
          return (
            <button
              key={item.id}
              onClick={() => onItemSelect(item)}
              className="w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left transition-all duration-200 group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">
                      {item.title}
                    </h4>
                    
                    <button
                      onClick={(e) => removeItem(item.id, e)}
                      className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all duration-200"
                      title="Remove this item"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 group-hover:text-gray-700">
                    {item.preview}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${projectColor}`}>
                      {item.project}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500 group-hover:text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{getRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Click any item to load it back into the editor
        </p>
      </div>
    </div>
  )
}