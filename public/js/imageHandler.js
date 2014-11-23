var replaceImageOnScreen = function() {
    //get the div which should hold the image

    var imageDiv = document.getElementById('containerOfMotherFuckingDooom');
    //clear the content
    imageDiv.innerHTML = '';
    //create the new image
    var img = '<img src= "mosaic.jpeg" class="resultImage"></img>';
    //insert it into the div
    imageDiv.innerHTML = img;
}

var spinner;
var startSpinningIndicator = function() {
    var opts = {
        lines: 9, // The number of lines to draw
        length: 50, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#36AC29', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '100%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var target = document.getElementById('inputFFields');
    spinner = new Spinner(opts).spin(target);
}

var stopSpinningIndicator = function ()
{
    spinner.stop();
}
