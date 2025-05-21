import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProfileProvider } from "./contexts/ProfileContext.jsx"; // Import ProfileProvider
import { ToastProvider } from "@heroui/react";

export function Provider({ children }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider locale="en-US" navigate={navigate} useHref={useHref}>
      <ToastProvider placement="top-center" />
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider> {/* Wrap AuthProvider's children with ProfileProvider */}
      </AuthProvider>
    </HeroUIProvider>
  );
}
