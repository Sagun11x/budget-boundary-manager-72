import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this service, you accept and agree to be bound
              by the terms and conditions of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use this service for personal,
              non-commercial purposes only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
              The service is provided "as is". We make no warranties, expressed or
              implied, and hereby disclaim all warranties.
            </p>

            <h2>4. Limitations</h2>
            <p>
              In no event shall we be liable for any damages arising out of the use
              or inability to use the service.
            </p>

            <div className="mt-6">
              <Link to="/auth" className="text-primary hover:underline">
                Back to Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;