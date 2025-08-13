export default {
  manifest_version: 3,
  name: "Big(O)wl",
  version: "1.0.0",
  description: "Get instant time and space complexity for any code!",
  action: {
    default_popup: "src/popup/index.html",
    default_icon: "icons/icon128.png"
  },
  background: {
    service_worker: "src/background/index.js",
    type: "module"
  },
  web_accessible_resources: [
  {
    resources: ["src/content/leetcode-overlay.css" , "src/assets/catty.webp"],
    matches: ["<all_urls>"]
  }
],
  content_scripts: [
    {
      matches: [
        "<all_urls>"
      ],
      js: ["src/content/index.js","src/content/leetcode-injector.js" ],
      run_at: "document_idle",
      all_frames: true
    }
  ],
  permissions: ["scripting", "activeTab", "storage", "contextMenus", "declarativeNetRequest",
    "declarativeNetRequestFeedback","tabs"],
  host_permissions: ["<all_urls>"],
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png"
  },
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules.json"
      }
    ]
  }
};
