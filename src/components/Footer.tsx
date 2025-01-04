import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};