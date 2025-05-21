import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import LoadingSpinner from "../components/loading-spinner";
import appConfig from "../configs/app.config";

const CollectToken = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    processing: true,
    success: false,
    message: "Processing authentication..."
  });

  useEffect(() => {
    const processToken = async () => {
      console.log("CollectToken: Processing OAuth redirect");
      
      try {
        // This will extract token from URL hash and fetch user profile
        const authData = await AuthenticationService.handleZohoOAuthCallback();
        
        if (!authData || !authData.accessToken) {
          console.error("CollectToken: No token found in URL hash");
          setStatus({
            processing: false,
            success: false,
            message: "Authentication failed: No token received."
          });
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            navigate(appConfig.unAuthenticatedEntryPath || "/login", {
              state: { authError: "Failed to authenticate with Zoho." }
            });
          }, 2000);
          return;
        }

        // Check if we have the user profile information
        if (authData.userInfo && authData.userInfo.email) {
          console.log("CollectToken: Token and user profile successfully retrieved");
          setStatus({
            processing: false,
            success: true,
            message: `Welcome, ${authData.userInfo.displayName || authData.userInfo.firstName || 'User'}!`
          });
        } else {
          console.log("CollectToken: Token retrieved but profile info is incomplete");
          setStatus({
            processing: false,
            success: true,
            message: "Authentication successful! Redirecting..."
          });
        }

        // Give user a moment to see the success message before redirecting
        setTimeout(() => {
          navigate(appConfig.authenticatedEntryPath || "/");
        }, 1500);

      } catch (error) {
        console.error("CollectToken: Error processing token", error);
        setStatus({
          processing: false,
          success: false,
          message: `Authentication error: ${error.message || "Unknown error"}`
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate(appConfig.unAuthenticatedEntryPath || "/login", {
            state: { authError: error.message || "Authentication failed." }
          });
        }, 2000);
      }
    };

    processToken();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "0 2rem",
        textAlign: "center"
      }}
    >
      {status.processing ? (
        <>
          <LoadingSpinner />
          <p style={{ marginTop: "1rem" }}>{status.message}</p>
        </>
      ) : (
        <div>
          {status.success ? (
            <div style={{ color: "green" }}>
              <h3>✓ {status.message}</h3>
            </div>
          ) : (
            <div style={{ color: "red" }}>
              <h3>✗ {status.message}</h3>
              <p>Redirecting to login page...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectToken;
