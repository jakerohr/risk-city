$( document ).ready(function(){

  //collapsible sidebar.
  $(".button-collapse").sideNav();

 // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    in_duration: 300, // Transition in duration
    out_duration: 200, // Transition out duration
    ready: function() {
      console.log('Modal open');
    }, // Callback for Modal open
    complete: function() {
      console.log('Closed');
    } // Callback for Modal close
  });
});
