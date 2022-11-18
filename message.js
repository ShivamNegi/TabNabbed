chrome.runtime.onMessage.addListener(diffTab);

function diffTab(request, sender, sendResponse) {
    console.log("Comparing and displaying.");
    prevData = request.prevData;
    newData = request.newData;
    
    console.log(request);
    
    resemble(newData).compareTo(prevData).onComplete(
      function(data) {
        console.log("Mismatch percentage: ", data.misMatchPercentage);
  
        if(data.misMatchPercentage > 0.3) {
          console.log("There is a mismatch.")
          showMismatch(data.getImageDataUrl())
          // data.getDiffImage().pack().pipe(fs.createWriteStream( './diff.png'));
        }

        sendResponse({status: 'ok'});
      }
    );

    return true;
}

function showMismatch(dataUrl) {
    var result = document.createElement('div');
    result.id="result";
    result.style.width = "100%";
    result.style.height = "100%";
    result.style.top = "0px";
    result.style.left = "0px";
    result.style.backgroundImage = "url(" + dataUrl + ")";
    result.style.backgroundSize = "100% 100%"
    result.style.position = "fixed";

    result.addEventListener("click", function(){
        var temp = document.getElementById('result')
            temp.parentNode.removeChild(temp);
        });
    
    document.body.appendChild(result);
}
