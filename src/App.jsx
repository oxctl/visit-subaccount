import React, { useState } from "react";

import { Tabs } from "@instructure/ui-tabs";
import {
  LtiApplyTheme,
  LtiTokenRetriever,
  LaunchOAuth,
  LtiHeightLimit,
} from "@oxctl/ui-lti";

import { jwtDecode } from "jwt-decode";

import HomePage from "./HomePage";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [token, setToken] = useState(null);
  const [needsToken, setNeedsToken] = useState(false);

  const [
    comInstructureBrandConfigJsonUrl,
    setComInstructureBrandConfigJsonUrl,
  ] = useState(null);
  const [canvasUserPrefersHighContrast, setCanvasUserPrefersHighContrast] =
    useState(false);
  const [accountId, setAccountId] = useState(1);

  const [server, setServer] = useState(null);

  const updateToken = (receivedToken, server) => {
    setToken(receivedToken);

    setServer(server);

    const decodedJwt = jwtDecode(receivedToken);

    const jwtClaim =
      decodedJwt["https://purl.imsglobal.org/spec/lti/claim/custom"];
    setComInstructureBrandConfigJsonUrl(
      jwtClaim.com_instructure_brand_config_json_url,
    );
    setCanvasUserPrefersHighContrast(
      jwtClaim.canvas_user_prefers_high_contrast === "true",
    );
    setAccountId(jwtClaim.canvas_account_id);
  };

  const handleTabChange = (event, { index }) => {
    setSelectedIndex(index);
  };

  return (
    <LtiTokenRetriever handleJwt={updateToken}>
      <LtiApplyTheme
        url={comInstructureBrandConfigJsonUrl}
        highContrast={canvasUserPrefersHighContrast}
      >
        <LtiHeightLimit>
          <LaunchOAuth
            promptLogin={needsToken}
            accessToken={token}
            server={{ proxyServer: server }}
            promptUserLogin={() => setNeedsToken(false)}
          >
            <Tabs
              margin="large auto"
              padding="medium"
              onRequestTabChange={handleTabChange}
            >
              <Tabs.Panel
                id="home"
                renderTitle="Home"
                textAlign="start"
                padding="large"
                isSelected={selectedIndex === 0}
              >
                <HomePage accountId={accountId} />
              </Tabs.Panel>

            </Tabs>
          </LaunchOAuth>
        </LtiHeightLimit>
      </LtiApplyTheme>
    </LtiTokenRetriever>
  );
}

export default App;
