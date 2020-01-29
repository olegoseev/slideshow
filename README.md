
# Slideshow

Simple lightweight slideshow (carousel) for displaying a list of items in horizontal order. No third party libraries. The slideshow using javascript to initialize slides and CSS3 transitions to move the slides.

## Features
-- Supports multiple slide shows on one page.
-- Play pause mode.
-- Navigate to a slide
-- Caption

# Setup

Include CSS and js files into HTML document.

```html
<link href="/path/to/slideshow.css" rel="stylesheet">
.
.
.
<script type="text/javascript" src="/path/to/slideshow.js"></script>
```


### HTML markup
Full HTML markup structure inside your HTML document:
```html
<div id="showOne" class="slideshow-container">
  <div class="play-pause-control" data-ref="#showOne"><span class="play-btn"></span></div>
  <!-- bullets to access to slide-->
  <ul class="slide-nav-control" data-ref="#showOne">
    <li class="slide-bullet active" data-slide="0"></li>
    <li class="slide-bullet" data-slide="1"></li>
...
    <li class="slide-bullet" data-slide="n"></li>
  </ul>
  <!-- navigation buttons -->
  <div class="slide-control-prev" data-ref="#showOne" role="button"  data-slide="prev"><span class="arrow-left"></span></div>
  <div class="slide-control-next" data-ref="#showOne" role="button" data-slide="next"><span class="arrow-right"></span></div>
  <div class="slideshow-caption"><p class="caption"></p></div>
  <!-- slides -->
  <div class="slide-content">
    <img src="https://picsum.photos/id/136/800/300" alt="...">
    <p class="slide-caption"><a href="#">This is a link</a></p>
  </div>
  <div class="slide-content">
      <img src="https://picsum.photos/id/155/800/300" alt="...">
      <p class="slide-caption">Slide 1 Caption 2</p>
  </div>
...
  <div class="slide-content">
    <img src="https://picsum.photos/id/182/800/300" alt="...">
    <p class="slide-caption">Slide n Caption</p>
  </div>
</div>
```
Controls can be ommited if not needed. Minimum HTML markup supported:
```html
<div id="showOne" class="slideshow-container">
  <!-- slides -->
  <div class="slide-content">
    <img src="https://picsum.photos/id/136/800/300" alt="...">
    <p class="slide-caption"><a href="#">This is a link</a></p>
  </div>
  <div class="slide-content">
      <img src="https://picsum.photos/id/155/800/300" alt="...">
      <p class="slide-caption">Slide 1 Caption 2</p>
  </div>
...
  <div class="slide-content">
    <img src="https://picsum.photos/id/182/800/300" alt="...">
    <p class="slide-caption">Slide n Caption</p>
  </div>
</div>
```

# Download
All files are located in the dist/ directory. CSS styles include CSS and SCSS versions.

# Example
