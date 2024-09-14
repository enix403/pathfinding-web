import "./styles/reset.css";
import "./styles/load-fonts";
import "./styles/global.css";

import whenDomReady from "when-dom-ready";

import Application from "./Application.svelte";

whenDomReady(() => {
  const root = document.getElementById("root")!;
  let _app = new Application({
    target: root
  });
});
