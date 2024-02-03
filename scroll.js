(function() {const headerEl = document.querySelector("header");
window.addEventListener('scroll', function(){
    this.requestAnimationFrame(scrollCheck);
});
function scrollCheck(){
    let browerScrollY = window.scrolly ? window.scrollY : window.pageYOffset;
    if(browerScrollY >0){
        headerEl.classList.add("active");
    }else{
        headerEl.classList.remove("active");
    }

    }
})();