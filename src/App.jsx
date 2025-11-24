import React, { useState, useEffect } from "react";

import { View } from "@instructure/ui-view";
import { Heading } from "@instructure/ui-heading";
import { Text } from "@instructure/ui-text";
import { Link } from "@instructure/ui-link";

import {
  LtiPageSettings,
  LtiTokenRetriever,
  LaunchOAuth,
  LtiHeightLimit,
} from "@oxctl/ui-lti";

import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [needsToken, setNeedsToken] = useState(false);
  const [accountUrl, setAccountUrl] = useState(null);
  const [server, setServer] = useState("");

  const updateToken = (receivedToken, server) => {
    setToken(receivedToken);
    setServer(server);

    const decodedJwt = jwtDecode(receivedToken);
    const jwtClaim = decodedJwt["https://purl.imsglobal.org/spec/lti/claim/custom"];

  // Ensure there's no trailing slash on the Canvas base URL before concatenating
  const baseCanvasUrl = (jwtClaim.canvas_base_url || "").replace(/\/+$/g, "");
  const url = baseCanvasUrl + "/accounts/" + jwtClaim.canvas_account_id;
    setAccountUrl(url);
  };

  // Redirect automatically when accountUrl becomes available
  useEffect(() => {
    if (accountUrl) {
      if (window.top !== window.self) {
        // inside an iframe → redirect the top window
        window.top.location.href = accountUrl;
      } else {
        // normal page → redirect current window
        window.location.href = accountUrl;
      }
    }
  }, [accountUrl]);

  return (
    <LtiTokenRetriever handleJwt={updateToken}>
      <LtiPageSettings>
        <LtiHeightLimit>
          <LaunchOAuth
            promptLogin={needsToken}
            accessToken={token}
            server={{ proxyServer: server }}
            promptUserLogin={() => setNeedsToken(false)}
          >
            <View as="div" padding="large">
              <Heading level="h1" as="h2">
                Redirecting to Subaccount...
              </Heading>

              {accountUrl ? (
                <Text>
                  If you are not redirected automatically,{" "}
                  <Link target="_top" href={accountUrl}>
                    click here
                  </Link>
                  .
                </Text>
              ) : (
                <Text>Preparing redirect...</Text>
              )}
            </View>
          </LaunchOAuth>
        </LtiHeightLimit>
      </LtiPageSettings>
    </LtiTokenRetriever>
  );
}

export default App;
