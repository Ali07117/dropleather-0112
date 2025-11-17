"use client"

import { useState } from "react"
import { useSubscription } from "@/hooks/useSubscription"

export default function IntegrationPage() {
  const { hasFeature, isFreePlan, plan } = useSubscription()
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Test API call to our real integration endpoint
  const testIntegrationAPI = async () => {
    setLoading(true)
    setTestResult("Testing real integration API...")
    
    try {
      // Call the actual backend integration route we created
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${apiBaseUrl}/v1/seller/integration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // In a real app, this would be the user's JWT token from auth
          "Authorization": `Bearer ${localStorage.getItem('jwt_token') || 'test-token'}`,
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTestResult("✅ Real API Success: " + JSON.stringify(data, null, 2))
      } else {
        setTestResult("❌ Real API Failed: " + JSON.stringify(data, null, 2))
      }
    } catch (error) {
      setTestResult("❌ Network Error: " + error)
    } finally {
      setLoading(false)
    }
  }

  // Check if user can access integration feature
  const canAccessIntegration = hasFeature("integration")

  if (isFreePlan && !canAccessIntegration) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Integration</h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">🔒 Upgrade Required</h2>
          <p className="text-amber-700 mb-4">
            Integration features are available with Pro and Enterprise plans.
          </p>
          <p className="text-sm text-amber-600 mb-4">
            Current Plan: <strong>{plan || "Free"}</strong>
          </p>
          <a 
            href="/subscription-plan?feature=integration"
            className="inline-block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
          >
            Upgrade Now
          </a>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Subscription Debug Info:</h3>
          <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto">
            {JSON.stringify({ plan, isFreePlan, hasIntegration: hasFeature("integration") }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Integration</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Access Granted!</h2>
        <p className="text-green-700 mb-4">
          Hi! The subscription workflow is working! You have access to integration features.
        </p>
        <p className="text-sm text-green-600">
          Current Plan: <strong>{plan || "Unknown"}</strong>
        </p>
      </div>

      <div className="grid gap-6">
        {/* Demo API Test */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Real Integration API Test</h3>
          <p className="text-gray-600 mb-4">
            Test the actual subscription-protected integration endpoint: <code>/v1/seller/integration</code>
          </p>
          
          <button
            onClick={testIntegrationAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors mb-4"
          >
            {loading ? "Testing Real API..." : "Test Real Integration API"}
          </button>

          {testResult && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-4">
              <h4 className="font-medium mb-2">API Response:</h4>
              <pre className="text-sm text-gray-700 bg-white p-2 rounded border overflow-auto whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        {/* Feature Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Subscription Status</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Plan:</strong> {plan || "Loading..."}
            </div>
            <div>
              <strong>Integration Access:</strong> {canAccessIntegration ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Is Free Plan:</strong> {isFreePlan ? "Yes" : "No"}
            </div>
            <div>
              <strong>Brand Lab Access:</strong> {hasFeature("brand-lab-ai") ? "✅ Yes" : "❌ No"}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔍 Debug Information</h3>
          <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded border overflow-auto">
            {JSON.stringify({
              plan,
              hasFeature: {
                integration: hasFeature("integration"),
                branding: hasFeature("branding"),
                "brand-lab-ai": hasFeature("brand-lab-ai"),
                "virtual-model": hasFeature("virtual-model"),
                "private-products": hasFeature("private-products")
              },
              isFreePlan
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}