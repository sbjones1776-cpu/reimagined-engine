
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Calendar, Lock, Users, Eye, FileText, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "January 15, 2025";
  const contactEmail = "support@math-adventure.com";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-600">Your privacy is important to us</p>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="mb-8 bg-blue-50 border-blue-300">
        <Shield className="w-5 h-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Children's Privacy Protection:</strong> Math Adventure is designed for children aged 5-14. 
          We comply with the Children's Online Privacy Protection Act (COPPA) and require verifiable parental 
          consent before collecting any personal information from children under 13.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Introduction */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-700" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Welcome to Math Adventure ("we," "our," or "us"). This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our educational math learning platform 
              (the "Service").
            </p>
            <p className="text-gray-700">
              We are committed to protecting the privacy of all users, especially children. This policy applies 
              to all users of Math Adventure, including students, parents, and teachers.
            </p>
            <p className="text-gray-700">
              By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">1. Account Information</h3>
              <p className="text-gray-700 mb-2">When you create an account, we collect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Full name</li>
                <li>Email address</li>
                <li>Age/grade level (for educational content alignment)</li>
                <li>Parent/guardian email (for children under 13)</li>
                <li>Account preferences and settings</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">2. Educational Data</h3>
              <p className="text-gray-700 mb-2">To provide personalized learning, we collect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Game scores and performance metrics</li>
                <li>Time spent on activities</li>
                <li>Correct and incorrect answers</li>
                <li>Learning progress and achievement data</li>
                <li>Daily challenge participation</li>
                <li>Skill mastery levels</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">3. Avatar & Customization Data</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Avatar customization choices</li>
                <li>Items purchased with in-game currency</li>
                <li>Unlocked achievements and badges</li>
                <li>Pet selections and experience points</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">4. Payment Information</h3>
              <p className="text-gray-700 mb-2">
                When you purchase a subscription, payment processing is handled by Square, Inc. We do not store 
                credit card information. We only receive:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Subscription tier selected</li>
                <li>Subscription start and end dates</li>
                <li>Payment confirmation status</li>
                <li>Transaction IDs for record-keeping</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">5. Communication Data</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Messages between parents and children (within app)</li>
                <li>Support requests and correspondence</li>
                <li>Feedback and survey responses</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">6. Usage Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Device type and operating system</li>
                <li>Browser type and version</li>
                <li>IP address (for security and fraud prevention)</li>
                <li>Login times and session duration</li>
                <li>Pages visited and features used</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700 mb-2">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Provide and maintain the Service:</strong> Deliver educational content, track progress, and personalize learning experiences</li>
              <li><strong>Process payments:</strong> Manage subscriptions and billing through our payment processor</li>
              <li><strong>Communicate with you:</strong> Send important updates, respond to support requests, and deliver educational feedback</li>
              <li><strong>Improve our Service:</strong> Analyze usage patterns to enhance features and educational effectiveness</li>
              <li><strong>Enable parent controls:</strong> Allow parents/teachers to monitor children's progress and set appropriate boundaries</li>
              <li><strong>Personalize learning:</strong> Adapt difficulty levels and recommend appropriate content based on performance</li>
              <li><strong>Generate reports:</strong> Provide progress reports and analytics to parents and teachers</li>
              <li><strong>Ensure security:</strong> Detect and prevent fraudulent activity, abuse, and security threats</li>
              <li><strong>Comply with legal obligations:</strong> Meet legal requirements and enforce our terms of service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy (COPPA) */}
        <Card className="border-4 border-orange-300 shadow-lg">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Children's Privacy (COPPA Compliance)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              <strong>Math Adventure is committed to protecting children's privacy.</strong> We comply with the 
              Children's Online Privacy Protection Act (COPPA).
            </p>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Parental Consent</h3>
              <p className="text-gray-700 mb-2">For children under 13, we:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Require verifiable parental consent before collecting personal information</li>
                <li>Only collect information reasonably necessary to participate in the Service</li>
                <li>Do not condition participation on providing more information than necessary</li>
                <li>Allow parents to review, delete, or refuse further collection of their child's information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Information We Collect from Children</h3>
              <p className="text-gray-700">
                From children under 13, we only collect information necessary for educational purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Username and email (for account creation)</li>
                <li>Grade level (for age-appropriate content)</li>
                <li>Game progress and educational performance</li>
                <li>Avatar customization preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Parental Rights</h3>
              <p className="text-gray-700 mb-2">Parents have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Review personal information collected from their child</li>
                <li>Request deletion of their child's personal information</li>
                <li>Refuse to allow further collection or use of their child's information</li>
                <li>Access the parent portal to monitor their child's activity</li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, contact us at <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              <strong>We do not sell or rent your personal information to third parties.</strong>
            </p>
            
            <p className="text-gray-700 mb-2">We may share information with:</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-800">Service Providers</h4>
                <p className="text-gray-700 text-sm">
                  We work with trusted third-party service providers to help us operate our Service:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4 mt-1">
                  <li><strong>Square, Inc.:</strong> Payment processing (PCI-DSS compliant)</li>
                  <li><strong>Base44 Platform:</strong> Application hosting and infrastructure</li>
                  <li><strong>OpenAI:</strong> AI-powered tutoring features (anonymized data only)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Parents and Teachers</h4>
                <p className="text-gray-700 text-sm">
                  When a child is linked to a parent or teacher account, we share the child's educational progress, 
                  game statistics, and performance data with that parent/teacher.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Legal Requirements</h4>
                <p className="text-gray-700 text-sm">
                  We may disclose information if required by law, court order, or to protect our rights, safety, 
                  or the rights and safety of others.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Business Transfers</h4>
                <p className="text-700 text-sm">
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred. 
                  We will notify you before your information is transferred and becomes subject to a different privacy policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              We take the security of your information seriously and implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using HTTPS/TLS</li>
              <li><strong>Secure Storage:</strong> Data is stored on secure servers with restricted access</li>
              <li><strong>Authentication:</strong> User accounts are protected with secure authentication systems</li>
              <li><strong>Access Controls:</strong> Only authorized personnel have access to personal information</li>
              <li><strong>Regular Security Audits:</strong> We regularly review our security practices</li>
              <li><strong>PCI Compliance:</strong> Payment processing through Square meets PCI-DSS standards</li>
            </ul>
            <Alert className="mt-4 bg-yellow-50 border-yellow-300">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                While we strive to protect your information, no method of transmission over the internet or electronic 
                storage is 100% secure. We cannot guarantee absolute security.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">We retain your information for as long as necessary to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Provide our Service and maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Enable parents/teachers to track long-term educational progress</li>
            </ul>
            <p className="text-gray-700 mt-4">
              When you delete your account, we will delete or anonymize your personal information within 30 days, 
              except where we are required by law to retain certain information longer.
            </p>
            <p className="text-gray-700">
              Educational progress data may be retained in anonymized form for research and product improvement purposes.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">You have the following rights regarding your personal information:</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-800">Access and Portability</h4>
                <p className="text-gray-700 text-sm">
                  Request a copy of your personal information in a machine-readable format
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Correction</h4>
                <p className="text-gray-700 text-sm">
                  Update or correct inaccurate information through your account settings
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Deletion</h4>
                <p className="text-gray-700 text-sm">
                  Request deletion of your account and associated data
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Opt-Out</h4>
                <p className="text-gray-700 text-sm">
                  Unsubscribe from promotional emails (you'll still receive essential account notifications)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Parental Controls</h4>
                <p className="text-gray-700 text-sm">
                  Parents can access the Parent Portal to manage their child's account, set restrictions, 
                  and monitor activity
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a>
            </p>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              We use cookies and similar technologies to enhance your experience and improve our Service:
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-800">Essential Cookies</h4>
                <p className="text-gray-700 text-sm">
                  Required for basic functionality (authentication, security, preferences)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Analytics</h4>
                <p className="text-gray-700 text-sm">
                  Help us understand how users interact with our Service to improve it
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Preferences</h4>
                <p className="text-gray-700 text-sm">
                  Remember your settings and customization choices
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              some functionality of the Service.
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Links */}
        <Card className="border-2 border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              Third-Party Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Our Service may contain links to third-party websites or services that are not operated by us. 
              We have no control over and assume no responsibility for the content, privacy policies, or practices 
              of any third-party sites or services.
            </p>
            <p className="text-gray-700">
              We strongly advise you to review the privacy policy of every site you visit, especially before 
              allowing children to use those sites.
            </p>
          </CardContent>
        </Card>

        {/* International Users */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              International Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Math Adventure is based in the United States and our Service is intended primarily for users in the 
              United States. If you access our Service from outside the United States, please be aware that your 
              information may be transferred to, stored, and processed in the United States.
            </p>
            <p className="text-gray-700">
              By using our Service, you consent to the transfer of your information to the United States and 
              agree that such transfer will be governed by U.S. law and this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Policy */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-700" />
              Changes to This Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Sending an email notification for significant changes (if you've provided an email)</li>
              <li>Displaying a prominent notice within the Service</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
              Policy are effective when posted on this page.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="border-4 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">Email</p>
                  <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">For COPPA-related inquiries or parental rights</p>
                  <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm">
              We will respond to your inquiry within 30 days of receipt. For COPPA-related requests from parents, 
              we will respond within 10 business days.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance */}
        <Alert className="bg-green-50 border-green-300">
          <Shield className="w-5 h-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>By using Math Adventure, you acknowledge that you have read and understood this Privacy Policy 
            and agree to its terms.</strong> If you do not agree with this Privacy Policy, please do not use our Service.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
