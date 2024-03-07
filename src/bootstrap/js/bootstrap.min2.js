
function displayName() {
  var userInput = document.getElementById("textInput").value;
  // Replace spaces with commas and bullets
  var formattedInput = userInput.split(' ').join(', • ');
  // Encode the input to ensure it's URL-safe
  var encodedInput = encodeURIComponent(formattedInput);
  window.location.href = "upload.html?text=" + encodedInput;
}
