var enableTakePicture = function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 640;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = $(".take_picture_page .video_container")[0];
    canvas = $(".take_picture_page .canvas_container")[0];
    photo = $(".take_picture_page .photo_container")[0];
    // startbutton = $(".take_picture_page .btn-takepicture")[0];
    startbutton = $(".take_picture_page .btn-takepicture");


    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4/3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    // startbutton.addEventListener('click', function(ev){
    //   takepicture(ev);
    //   ev.preventDefault();
    // }, false);
    startbutton.on('click', function(ev) {
      takepicture(ev);
      ev.preventDefault();
    });

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture(evt) {
    var context = canvas.getContext('2d');
    if (width && height) {

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      // var trimLeft = $(".take_picture_page .guiding_rectangle").position().left;
      // var trimTop = $(".take_picture_page .guiding_rectangle").position().top;
      // var trimWidth = ($(".take_picture_page .guiding_rectangle").width());
      // var trimHeight = ($(".take_picture_page .guiding_rectangle").height());
      // context.drawImage(video, trimLeft, trimTop, trimWidth, trimHeight);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      // console.log(data);
      // console.log($(evt.target).closest(".id_verify_buttons").attr("data-camera-container-step-visible") == 6);
      if($(evt.target).closest(".id_verify_buttons").hasClass("frontImageMode")) {
        localStorage.setItem("frontImage", data);
      }
      if($(evt.target).closest(".id_verify_buttons").hasClass("backImageMode")) {
        localStorage.setItem("backImage", data);
      }
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  // window.addEventListener('load', startup, false);
  startup();
}
