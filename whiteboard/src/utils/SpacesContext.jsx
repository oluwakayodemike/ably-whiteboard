import React, { useState, useEffect, useMemo } from "react";
import Spaces from "@ably/spaces";
import { nanoid } from "nanoid";
import { Realtime } from "ably";

import { getSpaceNameFromUrl } from "./helper";

const client = new Realtime.Promise({
    clientId: nanoid(),
    key: "2G93Ow.tGqEGw:rLw9dV_6eqF8n7aX2Cx4WtIq2MX5R5-NT-QplBJwsGo", 
  }); 

const SpacesContext = React.createContext(undefined);

const LeaveSpace = async () => {
  const spaces = new Spaces(client);
  const url = new URL(window.location.href);

  const pathSegments = url.pathname.split('/');
  const spaceName = pathSegments[pathSegments.length - 1];


  const space = await spaces.get(spaceName);
  await space.leave();
}

const SpaceContextProvider = ({ example, children }) => {
  const [space, setSpace] = useState(undefined);

  const spaces = useMemo(() => {
    return new Spaces(client);
  }, [example]);

  useEffect(() => {
    let ignore = false;
    const spaceName = getSpaceNameFromUrl();

    const init = async () => {
      const spaceInstance = await spaces.get(spaceName, {
        offlineTimeout: 10_000,
      });

      if (spaceInstance && !space && !ignore) {
        setSpace(spaceInstance);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, [spaces]);

  return (
    <SpacesContext.Provider value={space}>{children}</SpacesContext.Provider>
  );
};

export { SpaceContextProvider, SpacesContext, LeaveSpace };