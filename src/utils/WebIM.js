

// import { EaseApp } from "chat-uikit";
import { EaseApp } from "agora-chat-uikit";

const WebIM = EaseApp.getSdk({ appkey: "61501494#1077360" })
EaseApp.thread.setHasThreadEditPanel(true)

export default WebIM;
