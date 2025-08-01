import React, { useState } from "react";

import { View } from "@instructure/ui-view";
import { Heading } from "@instructure/ui-heading";
import { Text } from "@instructure/ui-text";
import { Link } from "@instructure/ui-link";

import {
  LtiApplyTheme,
  LtiTokenRetriever,
  LaunchOAuth,
  LtiHeightLimit,
} from "@oxctl/ui-lti";

import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [needsToken, setNeedsToken] = useState(false);

  const [
    comInstructureBrandConfigJsonUrl,
    setComInstructureBrandConfigJsonUrl,
  ] = useState(null);

  const [canvasUserPrefersHighContrast, setCanvasUserPrefersHighContrast] =
    useState(false);

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

    console.log("claimed account ID is " + jwtClaim.canvas_account_id);
    
    accountUrl = server+"/account/"+jwtClaim.canvas_account_id
    
    console.log("setAccountUrl is "+accountUrl)
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
          
            <View as="div" padding="large">
              <Heading level="h1" as="h2">
                Visit Subaccount
              </Heading>

              <Text>Visit <Link href={accountUrl}>parent subaccount</Link>.</Text>
            </View>
            
          </LaunchOAuth>
        </LtiHeightLimit>
      </LtiApplyTheme>
    </LtiTokenRetriever>
  );
}

export default App;
