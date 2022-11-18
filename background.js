var mapping = {};

function storeSS(tabId, changeInfo, tabInfo) {
  if(changeInfo.attention || changeInfo.url) {
    console.log("Captured ");
    
    chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
      if(chrome.runtime.lastError) return;
      mapping[tabId] = dataUrl;
    });
  }
}

function checkTabNabbing(activeInfo) {
  if(activeInfo.tabId in mapping) {
    console.log("This is an older tab.");
    
    prevDataUrl = mapping[activeInfo.tabId]

    chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
      console.log("Should go to comparing.")
      if(chrome.runtime.lastError) return;

      chrome.tabs.sendMessage( activeInfo.tabId,
        {prevData: prevDataUrl, newData: dataUrl},
        function(response) {});
    });
  }
  else {
    console.log("This is an new tab. Capturing.");

    chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
      if(chrome.runtime.lastError) return;
      mapping[activeInfo.tabId] = dataUrl;
    });
  }
}

chrome.tabs.onUpdated.addListener(storeSS);
chrome.tabs.onActivated.addListener(function(tab) {
    setTimeout(function () {
    checkTabNabbing(tab);
  }, 100)}
);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  if(tabId in mapping) {
    delete(mapping.tabId)
  }    
});
