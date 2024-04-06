// Get all elements with the 'clickable-image' class
var clickableImages = document.querySelectorAll('.clickable-image');

// Loop through each clickable image and attach a click event listener
clickableImages.forEach(function(image) {
  image.addEventListener('click', function() {
    // Get the source of the clicked image
    var imageUrl = image.src;
    
    // Set the source of the modal image
    var modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;

    // Open the modal
    $('#imageModal').modal('show');
  });
});
