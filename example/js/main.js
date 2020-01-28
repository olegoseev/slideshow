

'use strict';

window.addEventListener('load', onload);

var onload = () => {
    // init all the slideshows at once
    // slideshow.init(3000, 0);
    
    // init evry show with individual settings
   slideshow.initContainer('#showOne', 2500, 0);
   slideshow.initContainer('#showTwo', 0, 0);
   slideshow.initContainer('#showThree', 3000, 0);
   slideshow.initContainer('#showFour', 3500, 0);
   slideshow.initContainer('#showFive', 4000, 0);
   slideshow.initContainer('#showSix', 4500, 0);
}
