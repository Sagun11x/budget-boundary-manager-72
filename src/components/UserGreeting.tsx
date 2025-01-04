import { useAuth } from "@/contexts/AuthContext";

export const UserGreeting = () => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const getUserName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    return user.email?.split("@")[0] || "";
  };

  if (!user) return null;

  return (
    <div className="text-lg font-medium text-gray-700 mb-6">
      {getGreeting()}, {getUserName()}!
    </div>
  );
};