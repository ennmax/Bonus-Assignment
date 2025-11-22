// IIFE
(function () {
  function start() {
    console.log('BookTrack app started');
  }

  // Delete confirmation helper
  window.confirmDelete = function (itemName) {
    return confirm('Are you sure you want to delete "' + itemName + '"?');
  };

  window.addEventListener('load', start);
})();