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
