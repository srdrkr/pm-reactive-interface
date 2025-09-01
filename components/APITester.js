import { useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

const getAPIEndpoints = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://github-meeting-webhook.vercel.app'
  return [
    {
      name: 'Content Generation',
      endpoint: `${apiBaseUrl}/api/reactive-mode/generate`,
      method: 'POST',
      testData: {
        contentType: 'story',
        userInput: 'I need a user story for login functionality with basic email and password authentication',
        context: {
          project: '3PI',
          priority: 'high',
          outputFormats: ['markdown', 'jira']
        }
      }
    },
    {
      name: 'Context Search',
      endpoint: `${apiBaseUrl}/api/reactive-mode/context-search`,
      method: 'GET',
      testParams: {
        query: 'authentication login user story',
        project: '3PI',
        contentType: 'story',
        includeTemplates: 'true',
        includeSimilar: 'true'
      }
    },
    {
      name: 'Templates',
      endpoint: `${apiBaseUrl}/api/reactive-mode/templates`,
      method: 'GET',
      testParams: {
        type: 'story',
        project: '3PI',
        includeExamples: 'true'
      }
    }
  ]
}

const TestStatus = {
  IDLE: 'idle',
  TESTING: 'testing',
  SUCCESS: 'success',
  ERROR: 'error'
}

export default function APITester({ onClose }) {
  const [testResults, setTestResults] = useState({})
  const [isTestingAll, setIsTestingAll] = useState(false)

  const testEndpoint = async (endpoint) => {
    const { name, endpoint: url, method, testData, testParams } = endpoint
    
    setTestResults(prev => ({
      ...prev,
      [name]: { status: TestStatus.TESTING, startTime: Date.now() }
    }))

    try {
      let response
      
      if (method === 'GET') {
        const queryString = new URLSearchParams(testParams).toString()
        response = await fetch(`${url}?${queryString}`)
      } else {
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        })
      }

      const responseTime = Date.now() - testResults[name]?.startTime
      const data = await response.json()

      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: response.ok ? TestStatus.SUCCESS : TestStatus.ERROR,
          responseTime,
          statusCode: response.status,
          data: response.ok ? data : { error: data },
          error: response.ok ? null : data.message || 'Request failed'
        }
      }))
    } catch (error) {
      const responseTime = Date.now() - (testResults[name]?.startTime || Date.now())
      
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: TestStatus.ERROR,
          responseTime,
          error: error.message,
          data: null
        }
      }))
    }
  }

  const testAllEndpoints = async () => {
    setIsTestingAll(true)
    setTestResults({})
    
    const endpoints = getAPIEndpoints()
    // Test endpoints sequentially to avoid overwhelming the backend
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsTestingAll(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case TestStatus.TESTING:
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case TestStatus.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case TestStatus.ERROR:
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case TestStatus.TESTING:
        return 'border-blue-200 bg-blue-50'
      case TestStatus.SUCCESS:
        return 'border-green-200 bg-green-50'
      case TestStatus.ERROR:
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">API Integration Testing</h2>
            <p className="text-sm text-gray-600">Test backend API connectivity and functionality</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Test All Button */}
          <div className="mb-6">
            <button
              onClick={testAllEndpoints}
              disabled={isTestingAll}
              className={`
                btn-primary w-full 
                ${isTestingAll ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isTestingAll ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Testing All Endpoints...
                </>
              ) : (
                'Test All Endpoints'
              )}
            </button>
          </div>

          {/* Individual Endpoint Tests */}
          <div className="space-y-4">
            {getAPIEndpoints().map((endpoint) => {
              const result = testResults[endpoint.name]
              const status = result?.status || TestStatus.IDLE
              
              return (
                <div
                  key={endpoint.name}
                  className={`border rounded-lg p-4 ${getStatusColor(status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
                        <p className="text-sm text-gray-600">
                          {endpoint.method} {endpoint.endpoint}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {result?.responseTime && (
                        <span className="text-sm text-gray-600">
                          {result.responseTime}ms
                        </span>
                      )}
                      {result?.statusCode && (
                        <span className={`
                          text-sm px-2 py-1 rounded
                          ${result.statusCode < 300 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {result.statusCode}
                        </span>
                      )}
                      <button
                        onClick={() => testEndpoint(endpoint)}
                        disabled={status === TestStatus.TESTING || isTestingAll}
                        className="btn-secondary text-sm"
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  {/* Test Details */}
                  {result && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {result.error && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-800 mb-1">Error:</p>
                          <p className="text-sm text-red-700 bg-red-100 p-2 rounded">
                            {result.error}
                          </p>
                        </div>
                      )}
                      
                      {result.data && (
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">Response:</p>
                          <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Request Details */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-800 mb-1">Request:</p>
                    {endpoint.method === 'GET' ? (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Query Parameters:</strong>
                        <pre className="mt-1">
                          {JSON.stringify(endpoint.testParams, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Request Body:</strong>
                        <pre className="mt-1">
                          {JSON.stringify(endpoint.testData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Test Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Test Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {Object.values(testResults).filter(r => r.status === TestStatus.SUCCESS).length}
                  </div>
                  <div className="text-xs text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {Object.values(testResults).filter(r => r.status === TestStatus.ERROR).length}
                  </div>
                  <div className="text-xs text-gray-600">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-600">
                    {Object.values(testResults).length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            API testing helps ensure frontend-backend integration is working correctly.
            All tests should pass before deploying to production.
          </p>
        </div>
      </div>
    </div>
  )
}