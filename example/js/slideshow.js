
'use strict';

var slideshow = (function () {

  let playTimeout = 3000;

  const slideShowContainers = new Map();

  const init = () => {

    let showContainers = document.querySelectorAll('.slideshow-container');
    showContainers.forEach(container => setUpContainer(container));

    let prevSlideBtn = document.querySelectorAll('.slide-control-prev') || [];
    prevSlideBtn.forEach(btn => btn.addEventListener('click', onclick, { passive: true }));
    let nextSlideBtn = document.querySelectorAll('.slide-control-next') || [];
    nextSlideBtn.forEach(btn => btn.addEventListener('click', onclick, { passive: true }));
    let playBtn = document.querySelectorAll(' .play-pause-control') || [];
    playBtn.forEach(btn => btn.addEventListener('click', play, { passive: true }));
    let navBtn = document.querySelectorAll('.slide-nav-control') || [];
    navBtn.forEach(btn => btn.addEventListener('click', navigate, {passive: true}));
  }


  const setUpContainer = (container) => {
    let id = '#' + container.id;
    let selector = id.concat(' .slide-content');
    let slides = document.querySelectorAll(selector);
    slides[0].style.opacity = 1;
    let captionText = document.querySelector(id.concat(' .slideshow-caption .caption'));
    if(typeof captionText !== 'undefined' && captionText != null){
      captionText.innerHTML = slides[0].querySelector(id.concat(' .slide-caption')).innerHTML;
    }

    let containerObj = {
      containerId: id,
      slideIndex: 0,
      timer: null
    }
    slideShowContainers.set(id, containerObj);
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
    let containerObj = slideShowContainers.get(id);
    let n = parseInt(containerObj.slideIndex) + dir;
    moveSlide(containerObj, n);
  }

  const moveSlide = (containerObj, n) => {
    let current, next;
    let animationClass = {
      current: '',
      next: ''
    }

    let id = containerObj.containerId;
    let slides = document.querySelectorAll(id.concat(' .slide-content'));
    if (typeof slides == 'undefined') {
      console.error('.slide-content not found');
      return;
    }
    let slideIndex = containerObj.slideIndex;

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
    containerObj.slideIndex = slideIndex;
    updateBulletPoint(containerObj, slideIndex);
  }


  const play = (event) => {
    let  regex = /play-pause-control/;
    let element = getElementFromEvent(event, regex);

    if (typeof element == 'undefined') {
      console.error('cannot find play-pause-control element');
      return;
    }

    let containerId = extractId(element.dataset.ref);

    if (containerId === '') {
      console.error('containerId is undefined');
      return;
    }
    let containerObj = slideShowContainers.get(containerId);

    if (containerObj.timer === null) {
      setTimer(containerObj);
      playPauseBtn(containerObj.containerId, 'pause-btn');
    } else {
      stopTimer(containerObj);
      playPauseBtn(containerObj.containerId, 'play-btn');
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
    let containerId = extractId(parentNode.dataset.ref);
    let containerObj = slideShowContainers.get(containerId);
    if(typeof containerObj == 'undefined') {
      console.error('container not found');
      return;
    }
    moveSlide(containerObj, slideIndex);
  }

  const updateBulletPoint = (containerObj, slideIndex) => {
    let containerId = containerObj.containerId;
    let slideBullets = document.querySelectorAll(containerId.concat(' .slide-nav-control', ' .slide-bullet'));
    slideBullets.forEach(bullet => bullet.className = 'slide-bullet');
    if(slideBullets[slideIndex]) {
      slideBullets[slideIndex].classList.add('active');
    }
  }

  const playPauseBtn = (containerId, cls) => {
    let parent = document.querySelector(containerId.concat(' .play-pause-control'));
    let nodes = parent.childNodes;

    nodes.forEach(node => {
      if (node.className.match(/(play|pause)-btn/) !== null) {
        node.className = cls;
      }
    });
  }

  const setTimer = (containerObj) => {
    containerObj.timer = setInterval(() => plusSlides(containerObj.containerId, 1), playTimeout);
  }

  const stopTimer = (containerObj) => {
    clearInterval(containerObj.timer);
    containerObj.timer = null;
  }

  // In case if default timeout is too slow/fast
  const setTimeout = (timeout) => {
    playTimeout = timeout;
    slideShowContainers.forEach(containerObj => {
      if(containerObj.timer !== null) {
        stopTimer(containerObj);
        startTimer(containerObj);
      }
    });
  }

  init();

  return {
    setTimeout: setTimeout
  }
})();
