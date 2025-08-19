// background.js
const MAX_RULES = 50000;
let currentRuleIds = [];

/**
 * Updates blocking rules and closes/redirects already-open tabs on blocked sites.
 * @param {string[]} blockedSites - List of hostnames to block (e.g., 'chat.openai.com')
 */
function updateBlockingRules(blockedSites) {
  if (currentRuleIds.length > 0) {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: currentRuleIds
    });
    currentRuleIds = [];
  }

  // If no sites to block, we're done
  if (!blockedSites || blockedSites.length === 0) {
    console.log('🎯 No sites to block. Auto restriction disabled.');
    return;
  }

  // === STEP 1: Redirect already-open tabs on blocked domains ===
  const blockedHosts = new Set(blockedSites);

  chrome.tabs.query({ url: ['https://*/*', 'http://*/*'] }, (tabs) => {
    tabs.forEach((tab) => {
      try {
        const url = new URL(tab.url);
        const hostname = url.hostname;

        if (blockedHosts.has(hostname)) {
          console.log(`🎯 Redirecting open tab on blocked site: ${hostname}`, tab);

          // Redirect to our block page
          chrome.tabs.update(tab.id, {
            url: chrome.runtime.getURL('block.html?from=auto-restriction')
          }).catch((err) => {
            console.warn(`Failed to redirect tab ${tab.id}:`, err.message);
          });
        }
      } catch (e) {
        // Invalid URL (e.g., chrome://, about:blank)
        console.debug('Skipping invalid tab URL:', tab.url);
      }
    });
  });

  // === STEP 2: Apply new declarative rules for future navigations ===
  const newRules = blockedSites
    .map((site, index) => {
      const ruleId = 1000 + index;
      if (ruleId >= MAX_RULES) {
        console.error('❌ Rule ID exceeds limit:', ruleId);
        return null;
      }

      return {
        id: ruleId,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: chrome.runtime.getURL('block.html')
          }
        },
        condition: {
          urlFilter: `||${site}`,
          resourceTypes: ['main_frame']
        }
      };
    })
    .filter(Boolean); // Remove any nulls

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules
  });

  currentRuleIds = newRules.map((r) => r.id);
  console.log('✅ Applied blocking rules:', newRules);
}

// === Load saved blocked sites on startup ===
chrome.storage.sync.get(['blockedSites'], (result) => {
  updateBlockingRules(result.blockedSites || []);
});

// === Listen for changes (e.g., user enables/disables restriction) ===
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.blockedSites) {
    const newBlockedSites = changes.blockedSites.newValue || [];
    updateBlockingRules(newBlockedSites);
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});