import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import MainWindow from "./components/panels/MainWindow";
import LeftPanel from "./components/panels/LeftPanel";

function App() {

  return (
    <main className="container">
        <LeftPanel>
        <div className="side-panel-content">
          <h3>Today</h3>
          <ul>
            <li>Resizable CSS Grid Component</li>
            <li>Import SCSS in Svelte</li>
            <li>SurrealDB Rust Database</li>
          </ul>
        </div>
        <div className="drag-handle"/>
        </LeftPanel>
      <MainWindow>
        Main event
      </MainWindow>
    </main>
  );
}

export default App;
