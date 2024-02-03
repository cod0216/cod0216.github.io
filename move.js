const animationMove = function(selector){
    const targetEl = document.querySelector(selector);
    const browserScrollY = window.pageYOffset;
    const targetScorllY = targetEl.getBoundingClientRect().top + browserScrollY;
    window.scrollTo({ top: targetScorllY, behavior: 'smooth'});
}
const scollMoveEl = document.querySelectorAll("[data-animation-scroll='true']");
for(let i = 0; i < scollMoveEl.length; i++){
    scollMoveEl[i].addEventListener('click', function(e){
        const target = this.dataset.target;
        animationMove(target);
    });
}