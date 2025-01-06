import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Facebook, Twitter, Instagram, LifeBuoy, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Info = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Information</h1>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Terms and Conditions
            </h2>
            <div className="prose">
              <p className="text-gray-600">
                By using our subscription management service, you agree to the following terms:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                <li>We prioritize the security and privacy of your data</li>
                <li>All subscription information is stored securely</li>
                <li>You can export or delete your data at any time</li>
                <li>We regularly update our services to improve your experience</li>
              </ul>
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="mt-4 p-0">
                    {isExpanded ? 'Show less' : 'Read full terms'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4 text-gray-600">
                  <h3 className="font-semibold">1. Service Usage</h3>
                  <p>
                    Our subscription management service is provided "as is" and is subject to change. 
                    You must be at least 18 years old to use this service. You are responsible for 
                    maintaining the security of your account credentials.
                  </p>
                  
                  <h3 className="font-semibold">2. Data Privacy</h3>
                  <p>
                    We collect and process personal data in accordance with our Privacy Policy. 
                    Your data is encrypted and stored securely. We do not sell your personal 
                    information to third parties.
                  </p>
                  
                  <h3 className="font-semibold">3. Subscription Terms</h3>
                  <p>
                    Lifetime subscriptions are non-transferable and non-refundable. We reserve 
                    the right to modify service features or terminate accounts that violate our 
                    terms of service.
                  </p>
                  
                  <h3 className="font-semibold">4. Limitation of Liability</h3>
                  <p>
                    We are not liable for any indirect, incidental, special, consequential, or 
                    punitive damages resulting from your use of our service.
                  </p>
                  
                  <h3 className="font-semibold">5. Changes to Terms</h3>
                  <p>
                    We may update these terms from time to time. Continued use of the service 
                    after such changes constitutes acceptance of the new terms.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media</h2>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <LifeBuoy className="h-5 w-5 mr-2" />
              Support
            </h2>
            <p className="text-gray-600 mb-4">
              Need help? Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="space-y-3">
              <p className="text-gray-600">Email: support@subscriptionmanager.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <Button variant="outline" className="mt-2">
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Info;