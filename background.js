chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: false },
    files: ['clean-and-download.js']
  });
});
