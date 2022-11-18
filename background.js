var mapping = {};

function diffTab(newData, prevData) {
  console.log("Comparing and displaying.");
  
  resemble(newData).compareTo(prevData).onComplete(
    function(data) {
      console.log("Mismatch percentage: ", data.misMatchPercentage);

      if(data.misMatchPercentage > 0.3) {
        console.log("There is a mismatch.")
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, 
        function(tabs) {
          chrome.tabs.sendMessage(id,
            { greeting: "yoo", data: data.getImageDataUrl() }, 
            function(response) {
                console.log('working');
                icon={tabId:id, path:"image/red-hazard.png"};
                chrome.pageAction.setIcon(icon);
            });
        });
      }
    }
  );
}

function storeSS(tabId, changeInfo, tabInfo) {
  if(changeInfo.attention || changeInfo.url) {
    console.log("Captured ");
    // chrome.tabs.captureVisibleTab(null,{},function(dataUrl){console.log(dataUrl);});
    
    chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
      if(chrome.runtime.lastError) return;
      mapping[tabId] = dataUrl;
    });
  }
}

function checkTabNabbing(activeInfo) {
  if(activeInfo.tabId in mapping) {
    console.log("This is an older tab.");

    chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
      console.log("Should go to comparing.")
      // if(chrome.runtime.lastError) return;
      diffTab(dataUrl, mapping[activeInfo.tabId]);
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
