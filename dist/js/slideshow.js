
var slideshow = (function () {

  class Container {
    constructor(id, slideIndex, timeout, timer) {
      this.id = id;
      this.slideIndex = slideIndex;
      this.timeout = timeout;
      this.timer = timer;
    }
  }
  
  const slideShowContainers = new Map();

  const init = (timeout = 3000, startIndex = 0) => {
    let slideShow = document.querySelectorAll('.slideshow-container');
    if(slideShow && slideShow.length > 0) {
      slideShow.forEach(container => initContainer('#'.concat(container.id), timeout, startIndex));
    }
  }

  const initContainer = (id, timeout = 3000, startIndex = 0) => {
    let element = document.querySelector(id);
    if(element) {

      let container = new Container(id, startIndex, timeout, null);
 
      slideShowContainers.set(id, container);
      initShow(id);
      initControls(id);
      initPlayer(id);
    }
  }

  const initShow = (id) => {
    let selector = id.concat(' .slide-content');
    let slides = document.querySelectorAll(selector);
    if(slides == null || slides.length == 0) {
      console.error('no slides found for container id: ', id);
    }
    let container = slideShowContainers.get(id);
    if(container) {
      let slideIndex = container.slideIndex < slides.length ? container.slideIndex : slides.length;
      slides[slideIndex].style.opacity = 1;
      let captionText = document.querySelector(id.concat(' .slideshow-caption .caption'));
      if(captionText != null){
        captionText.innerHTML = slides[slideIndex].querySelector(id.concat(' .slide-content .slide-caption')).innerHTML || '' ;
      }
    }
  }

  const initControls = (id) => {
      let prevBtn = document.querySelector(id.concat(' .slide-control-prev'));
      if(prevBtn) {
        prevBtn.addEventListener('click', onclick, { passive: true });
      }
      let nextBtn = document.querySelector(id.concat(' .slide-control-next'));
      if(nextBtn) {
        nextBtn.addEventListener('click', onclick, { passive: true });
      }
      let playBtn = document.querySelector(id.concat(' .play-pause-control'));
      if(playBtn) {
        playBtn.addEventListener('click', play, { passive: true });
      }
      let navBtn = document.querySelector(id.concat(' .slide-nav-control'));
      if(navBtn) {
        navBtn.addEventListener('click', navigate, {passive: true});
      }
  }

  const initPlayer= (id) => {
    let container  = slideShowContainers.get(id);
    if(container.timeout && container.timeout > 0) {
      startPlayer(container);
    }
  }

  const getElementFromEvent= (event, regex) => {
    event = event || window.event;
    let element = event.target || event.srcElement;
    // if the element is not a div with class slide-control-*. clime up
    while (element.className.match(regex) == null) {
      element = element.parentNode;
    }
    return element;
  }

  const onclick = (event) => {

    let  regex = /slide-control-(prev|next)/;
    let element = getElementFromEvent(event, regex);

    if (typeof element == 'undefined') {
      console.error('cannot find slide-control element');
      return;
    }

    let containerId = extractId(element.dataset.ref);
    let dataSlide = element.dataset.slide;
    let dir = 0;

    if (dataSlide == 'next') {
      dir = 1;
    } else if (dataSlide == 'prev') {
      dir = -1;
    } else if (dir == 0) {
      return;
    }
    plusSlides(containerId, dir);
  }


  const extractId = (ref) => {
    if (typeof ref == 'undefined') {
      console.error('ref property is undefined');
      return '';
    }
    let index = ref.lastIndexOf('#');
    if (index === -1) {
      console.error('ref id not found');
      return '';
    }
    let elmId = ref.substring(index);
    return elmId;
  }

  const plusSlides = (id, dir) => {
    let container = slideShowContainers.get(id);
    let n = parseInt(container.slideIndex) + dir;
    moveSlide(container, n);
  }

  const moveSlide = (container, n) => {
    let current, next;
    let animationClass = {
      current: '',
      next: ''
    }

    let id = container.id;
    let slides = document.querySelectorAll(id.concat(' .slide-content'));
    if (typeof slides == 'undefined') {
      console.error('.slide-content not found');
      return;
    }

    let slideIndex = container.slideIndex;

    if (n > slideIndex) {
      // if reached end of slides, start from begining
      n = n > slides.length - 1 ? 0 : n;
      animationClass.current = 'moveLeftCurrent';
      animationClass.next = 'moveLeftNext';
    } else {
      n = n < 0 ? slides.length - 1 : n;
      animationClass.current = 'moveRightCurrent';
      animationClass.next = 'moveRightNext';
    }
    slides.forEach(slide => {
      slide.className = 'slide-content';
      slide.style.opacity = 0;
    });
    if (n != slideIndex) {
      next = slides[n];
      current = slides[slideIndex];
      current.classList.add(animationClass.current);
      next.classList.add(animationClass.next);
      let captionText = document.querySelector(id.concat(' .slideshow-caption .caption'));
      if(typeof captionText !== 'undefined' && captionText != null){
        captionText.innerHTML = next.querySelector(id.concat(' .slide-caption')).innerHTML;
      }

      slideIndex = n;
    }
    container.slideIndex = slideIndex;
    updateBulletPoint(container, slideIndex);
  }


  const play = (event) => {
    let  regex = /play-pause-control/;
    let element = getElementFromEvent(event, regex);

    if (typeof element == 'undefined') {
      console.error('cannot find play-pause-control element');
      return;
    }

    let id = extractId(element.dataset.ref);

    if (id === '') {
      console.error('id is undefined');
      return;
    }

    let container = slideShowContainers.get(id);

    startPlayer(container);
  }


  const startPlayer = (container) => {

    if (container.timer === null) {
      setTimer(container);
      playPauseBtn(container.id, 'pause-btn');
    } else {
      stopTimer(container);
      playPauseBtn(container.id, 'play-btn');
    } 
  }

  const navigate = (event) => {

    let regex = /slide-bullet/;
    let element = getElementFromEvent(event, regex);

    if(typeof element == 'undefined'){
      console.error('cannot find slide navigation buttons');
    }

    let slideIndex = element.dataset.slide;

    regex = /slide-nav-control/;
    let parentNode = getElementFromEvent(event, regex);
    let id = extractId(parentNode.dataset.ref);
    let container = slideShowContainers.get(id);
    if(typeof container == 'undefined') {
      console.error('container not found ${container.id}');
      return;
    }
    moveSlide(container, slideIndex);
  }

  const updateBulletPoint = (container, slideIndex) => {
    let id = container.id;
    let slideBullets = document.querySelectorAll(id.concat(' .slide-nav-control', ' .slide-bullet'));
    slideBullets.forEach(bullet => bullet.className = 'slide-bullet');
    if(slideBullets[slideIndex]) {
      slideBullets[slideIndex].classList.add('active');
    }
  }

  const playPauseBtn = (id, cls) => {
    let parent = document.querySelector(id.concat(' .play-pause-control'));
    let nodes = parent.childNodes;

    nodes.forEach(node => {
      if (node.className.match(/(play|pause)-btn/) !== null) {
        node.className = cls;
      }
    });
  }

  const setTimer = (container) => {
    container.timer = setInterval(() => plusSlides(container.id, 1), container.timeout);
  }

  const stopTimer = (container) => {
    clearInterval(container.timer); 
    container.timer = null;
  }

  return {
    init: init,
    initContainer: initContainer
  }

})();
