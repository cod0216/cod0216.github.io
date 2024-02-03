(function(){
    const spanEl = document.querySelector("main h2 span")
    const txtArr = ['Supreme Leader of North Korea', 'Dictator', 'Despot', 'Democratic People\'s Republic of Korea'];
    let index=0;
    let currentTxt = txtArr[index].split("");

    function writeTxt() {
        spanEl.textContent +=currentTxt.shift();
        if(currentTxt.length !==0){
            setTimeout(writeTxt, Math.floor(Math.random() *100));
        }else{
            currentTxt = spanEl.textContent.split("");
            setTimeout(deleteTxt, 2000);
        }
    }
    writeTxt();

    function deleteTxt(){
        currentTxt.pop();
        spanEl.textContent = currentTxt.join("");
        if(currentTxt.length !==0){
            setTimeout(deleteTxt, Math.floor(Math.random()*100));
        }else{
            index = (index + 1) % txtArr.length;
            currentTxt = txtArr[index].split("");
            writeTxt();
        }
    }
})();