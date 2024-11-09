import React, { useEffect, useState } from "react";
import MainWindow from "./components/panels/MainPanel";
import LeftPanel from "./components/panels/LeftPanel";
import NotificationContainer from "./components/elements/Notification";
import RootList from "./components/items/RootList";

// const home = await path.homeDir();
// const contents = await readFile(await path.join(home, 'dev_root/pink/thumbnail.png'));

function App() {

  return (
    <>
    <main className="container">
      <LeftPanel>
        <div className="left-panel-content">
          <RootList/>
        </div>
      </LeftPanel>
      <MainWindow>
         <div className="">
          {/* <CreateRoot/> */}
         </div>
      </MainWindow>
      </main>
      <NotificationContainer />
    </>
  );
}

export default App;

