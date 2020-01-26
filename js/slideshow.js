
'use strict';

var slideshow = (function () {

  let slideShowContainers = new Map();

  const init = () => {

    let showContainers = document.querySelectorAll('.slideshow-container');
    showContainers.forEach(container => setUpContainer(container));

    let prevSlideBtn = document.querySelectorAll('.slide-control-prev');
    let nextSlideBtn = document.querySelectorAll('.slide-control-next');
    prevSlideBtn.forEach(btn => btn.addEventListener('click', onclick, { passive: true }));
    nextSlideBtn.forEach(btn => btn.addEventListener('click', onclick, { passive: true }));
    let playBtn = document.querySelectorAll(' .play-pause');
    playBtn.forEach(btn => btn.addEventListener('click', play, { passive: true }));
  }


  const setUpContainer = (container) => {
    let id = '#' + container.id;
    let selector = id.concat(' ','.slide-content');
    let slides = document.querySelectorAll(selector);
    slides[0].style.opacity = 1;
    let captionText = document.querySelector(id.concat(' ', '.slideshow-caption .caption'));
    captionText.innerHTML = slides[0].querySelector(id.concat(' ', '.slide-caption')).innerHTML;

    let containerObj = {
      containerId: id,
      slideIndex: 0,
      timer: null
    }
    slideShowContainers.set(id, containerObj);
  }


  const onclick = (event) => {

    event = event || window.event;
    let element = event.target || event.srcElement;
    // if the element is not a div with class slide-control-*. clime up. we need div
    while(element.className.match(/slide-control-(prev|next)/) == null){
      element = element.parentNode;
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
    if(typeof ref == 'undefined') {
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
    let n = containerObj.slideIndex + dir;
    moveSlide(containerObj, n);
  }

  const moveSlide = (containerObj, n) => {
    let current, next;
    let animationClass = {
      current: '',
      next: ''
    }
    let id = containerObj.containerId;
    let slides = document.querySelectorAll(id.concat(' ', '.slide-content'));
    if(typeof slides == 'undefined') {
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
      var captionText = document.querySelector(id.concat(' ', '.slideshow-caption .caption'));
      captionText.innerHTML = next.querySelector(id.concat(' ', '.slide-caption')).innerHTML;
      slideIndex = n;
    }
    containerObj.slideIndex = slideIndex;
  }


  const play = (event) => {
    event = event || window.event;
    let element = event.target || event.srcElement;

    let containerId = extractId(element.dataset.ref);

    if(containerId === ''){
      console.error('containerId is undefined');
      return;
    }
    let containerObj = slideShowContainers.get(containerId);

    if(containerObj.timer === null) {
      setTimer(containerObj);
      playPauseBtn(containerObj.containerId, 'bottom');
    }else {
      stopTimer(containerObj);
      playPauseBtn(containerObj.containerId, 'top');
    }

  }

  const playPauseBtn = (containerId, position) => {
    let btn = document.querySelector(containerId.concat(' ', '.play-pause'));
    btn.style.backgroundPosition = position;
  }

  const setTimer = (containerObj) => {
    containerObj.timer = setInterval(() => plusSlides(containerObj.containerId, 1), 3000);
  }

  const stopTimer = (containerObj) => {
    clearInterval(containerObj.timer);
    containerObj.timer = null;
  }

  init();

})();
