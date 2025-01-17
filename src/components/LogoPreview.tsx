import { Package } from "lucide-react";

interface LogoPreviewProps {
  name: string;
  logo: string;
}

export function LogoPreview({ name, logo }: LogoPreviewProps) {
  return (
    <div className="mt-2 flex items-center justify-center">
      {logo ? (
        <img 
          src={logo} 
          alt={`${name} logo`}
          className="h-16 w-16 object-contain"
          onError={(e) => {
            console.log("Image load error, using placeholder");
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.onerror = null;
          }}
          crossOrigin="anonymous"
        />
      ) : (
        <Package className="h-16 w-16 text-gray-400" />
      )}
    </div>
  );
}