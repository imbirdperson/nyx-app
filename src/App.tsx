import React from "react";
import MainWindow from "./components/panels/MainPanel";
import LeftPanel from "./components/panels/LeftPanel";
import { readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { invoke } from "@tauri-apps/api/core";

import { readDir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

// const home = await path.homeDir();
// const contents = await readFile(await path.join(home, 'dev_root/pink/thumbnail.png'));

function App() {

  return (
    <main className="container">
      <LeftPanel>
        <div className="left-panel-content">

        </div>
      </LeftPanel>
      <MainWindow>
         <div className="">
          <img src="/Users/deepakrajan/dev_root/pink/thumbnail.png" alt="thumbnail" />
         </div>
      </MainWindow>
    </main>
  );
}

export default App;


