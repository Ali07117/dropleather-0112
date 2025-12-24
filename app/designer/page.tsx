'use client'

import Link from 'next/link';
import { CreditCard, Settings, Bell, Palette } from 'lucide-react';

export default function DesignerIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* DESIGN MODE BANNER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-4 shadow-lg">
        <h1 className="text-2xl font-bold">🎨 DESIGNER WORKSPACE</h1>
        <p className="text-purple-100 mt-1">No Authentication Required - All Pages Available for Design</p>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Pages - Design Mode</h2>
            <p className="text-gray-600 text-lg">
              Click on any page below to start designing. All forms and inputs are visible with mock data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Account Details Card */}
            <Link href="/designer/account-details">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 mx-auto group-hover:bg-green-200 transition-colors">
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Account Details</h3>
                <p className="text-gray-600 text-center mb-4">
                  Personal information, business details, and security settings
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Account Billing Card */}
            <Link href="/designer/account-billing">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Billing</h3>
                <p className="text-gray-600 text-center mb-4">
                  Subscription plans, payment methods, and billing history
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Account Notifications Card */}
            <Link href="/designer/account-notifications">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Notifications</h3>
                <p className="text-gray-600 text-center mb-4">
                  Email preferences, push notifications, and communication settings
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Ticket History Empty*/}
            <Link href="/designer/ticket-history-empty">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Ticket History Empty</h3>
                <p className="text-gray-600 text-center mb-4">
                  Email preferences, push notifications, and communication settings
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Ticket History */}
            <Link href="/designer/ticket-history">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Ticket History</h3>
                <p className="text-gray-600 text-center mb-4">
                  Email preferences, push notifications, and communication settings
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Store Integration */}
            <Link href="/designer/store-integration">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Store Integration</h3>
                <p className="text-gray-600 text-center mb-4">
                  Email preferences, push notifications, and communication settings
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>

            {/* Store Integration Empty */}
            <Link href="/designer/store-integration-empty">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Store Integration Empty</h3>
                <p className="text-gray-600 text-center mb-4">
                  Email preferences, push notifications, and communication settings
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700 text-center font-medium">
                    ✓ Mock data loaded
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Design Notes */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Design Notes</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✅ What&apos;s Available:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• All forms and inputs are visible</li>
                  <li>• Mock data pre-filled for design reference</li>
                  <li>• All buttons and interactions work</li>
                  <li>• Responsive design ready to test</li>
                  <li>• No authentication or API calls</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎨 Design Tips:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Test all form states and validations</li>
                  <li>• Check mobile responsiveness</li>
                  <li>• Verify color consistency</li>
                  <li>• Test button hover states</li>
                  <li>• Ensure proper spacing and alignment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Access URLs */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Access URLs:</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <span className="text-gray-600">Account Details:</span> 
                <code className="ml-2 bg-white px-2 py-1 rounded">localhost:3000/designer/account-details</code>
              </div>
              <div>
                <span className="text-gray-600">Billing:</span> 
                <code className="ml-2 bg-white px-2 py-1 rounded">localhost:3000/designer/account-billing</code>
              </div>
              <div>
                <span className="text-gray-600">Notifications:</span> 
                <code className="ml-2 bg-white px-2 py-1 rounded">localhost:3000/designer/account-notifications</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}