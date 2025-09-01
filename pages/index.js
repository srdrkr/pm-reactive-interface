import { useState, useEffect } from 'react'
import Head from 'next/head'
import ContentTypeSelector from '../components/ContentTypeSelector'
import InputForm from '../components/InputForm'
import ContextPanel from '../components/ContextPanel'
import GenerationProgress from '../components/GenerationProgress'
import OutputManager from '../components/OutputManager'
import QuickActions from '../components/QuickActions'
import RecentItems from '../components/RecentItems'
import MobileMenu from '../components/MobileMenu'
import APITester from '../components/APITester'
import { Sparkles, Menu, X, Settings } from 'lucide-react'

export default function Home() {
  const [contentType, setContentType] = useState('epic')
  const [userInput, setUserInput] = useState('')
  const [context, setContext] = useState({
    project: '3PI',
    priority: 'medium',
    selectedDocs: [],
    selectedNotes: [],
    outputFormats: ['markdown', 'jira']
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [contextSuggestions, setContextSuggestions] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [recentItems, setRecentItems] = useState([])
  const [showAPITester, setShowAPITester] = useState(false)

  // Load recent items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pm-reactive-recent-items')
    if (saved) {
      setRecentItems(JSON.parse(saved))
    }
  }, [])

  // Auto-search for context when user input changes
  useEffect(() => {
    const searchContext = async () => {
      if (userInput.trim().length > 10) {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://github-meeting-webhook.vercel.app'
          const response = await fetch(`${apiBaseUrl}/api/reactive-mode/context-search?${new URLSearchParams({
            query: userInput,
            project: context.project,
            contentType: contentType,
            includeTemplates: 'true',
            includeSimilar: 'true'
          })}`)
          
          if (response.ok) {
            const data = await response.json()
            setContextSuggestions(data)
          } else {
            // Silently fail for context search - not critical
            console.log('Context search unavailable, continuing without suggestions')
          }
        } catch (error) {
          // Silently fail for context search - not critical
          console.log('Context search failed, continuing without suggestions:', error.message)
        }
      } else {
        // Clear suggestions when input is too short
        setContextSuggestions(null)
      }
    }

    const timeoutId = setTimeout(searchContext, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [userInput, context.project, contentType])

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      alert('Please describe what you need to generate')
      return
    }

    setIsGenerating(true)
    setGenerationProgress({
      stage: 'analyzing',
      progress: 10,
      message: 'Analyzing input and context...'
    })

    try {
      // Simulate progress updates
      const progressUpdates = [
        { stage: 'searching', progress: 25, message: 'Searching PM Context Engine...' },
        { stage: 'generating', progress: 50, message: 'Generating content with AI...' },
        { stage: 'formatting', progress: 80, message: 'Formatting for multiple outputs...' },
        { stage: 'complete', progress: 100, message: 'Content generation complete!' }
      ]

      // Update progress with delays
      for (const update of progressUpdates) {
        setTimeout(() => {
          setGenerationProgress(update)
        }, progressUpdates.indexOf(update) * 2000)
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://github-meeting-webhook.vercel.app'
      const response = await fetch(`${apiBaseUrl}/api/reactive-mode/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentType,
          userInput,
          context,
          outputFormat: context.outputFormats
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data)
        
        // Add to recent items
        const newItem = {
          id: Date.now(),
          title: extractTitle(data.content.markdown) || `Generated ${contentType}`,
          type: contentType,
          project: context.project,
          createdAt: new Date().toISOString(),
          preview: userInput.substring(0, 100) + (userInput.length > 100 ? '...' : '')
        }
        
        const updatedRecent = [newItem, ...recentItems.slice(0, 9)] // Keep last 10
        setRecentItems(updatedRecent)
        localStorage.setItem('pm-reactive-recent-items', JSON.stringify(updatedRecent))
        
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Content generation failed: ' + error.message)
      setGenerationProgress(null)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(null)
      }, 1000)
    }
  }

  const handleReset = () => {
    setUserInput('')
    setGeneratedContent(null)
    setGenerationProgress(null)
    setIsGenerating(false)
    setContextSuggestions(null)
  }

  const handleQuickAction = (type) => {
    setContentType(type)
    setGeneratedContent(null)
    setGenerationProgress(null)
  }

  const handleRecentItemSelect = (item) => {
    setContentType(item.type)
    setContext(prev => ({ ...prev, project: item.project }))
    setUserInput(item.preview)
    setGeneratedContent(null)
  }

  const extractTitle = (content) => {
    const titleMatch = content?.match(/^#\s+(.+)$/m)
    return titleMatch ? titleMatch[1].trim() : null
  }

  return (
    <>
      <Head>
        <title>PM Orchestration Engine - Reactive Mode</title>
        <meta name="description" content="On-demand content generation for product managers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto mobile-friendly">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Sparkles className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PM Orchestration Engine</h1>
                  <p className="text-sm text-gray-600">Reactive Mode</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Backend Online</span>
                </div>
                <button
                  onClick={() => setShowAPITester(true)}
                  className="btn-secondary text-sm"
                  title="Test API Integration"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary text-sm"
                  disabled={isGenerating}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          recentItems={recentItems}
          onQuickAction={handleQuickAction}
          onRecentItemSelect={handleRecentItemSelect}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto mobile-friendly py-6">
          <div className="responsive-grid">
            {/* Sidebar - Left */}
            <div className="hidden lg:block space-y-6">
              <QuickActions
                currentType={contentType}
                onActionSelect={handleQuickAction}
                disabled={isGenerating}
              />
              
              <RecentItems
                items={recentItems}
                onItemSelect={handleRecentItemSelect}
              />
            </div>

            {/* Main Content Area - Center */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Type & Input */}
              <div className="card">
                <ContentTypeSelector
                  selectedType={contentType}
                  onTypeChange={setContentType}
                  disabled={isGenerating}
                />

                <div className="mt-6">
                  <InputForm
                    value={userInput}
                    onChange={setUserInput}
                    contentType={contentType}
                    context={context}
                    onContextChange={setContext}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    suggestions={contextSuggestions?.suggestions || []}
                  />
                </div>
              </div>

              {/* Context Panel */}
              {contextSuggestions && (
                <ContextPanel
                  suggestions={contextSuggestions}
                  context={context}
                  onContextChange={setContext}
                  disabled={isGenerating}
                />
              )}

              {/* Generation Progress */}
              {isGenerating && generationProgress && (
                <GenerationProgress
                  progress={generationProgress}
                  contentType={contentType}
                />
              )}

              {/* Generated Content Output */}
              {generatedContent && !isGenerating && (
                <OutputManager
                  content={generatedContent}
                  contentType={contentType}
                  context={context}
                  onRegenerate={handleGenerate}
                />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto mobile-friendly py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>PM Orchestration Engine - Phase 6 Reactive Mode</p>
              <p>Powered by AI & PM Context Engine</p>
            </div>
          </div>
        </footer>

        {/* API Tester Modal */}
        {showAPITester && (
          <APITester onClose={() => setShowAPITester(false)} />
        )}
      </div>
    </>
  )
}