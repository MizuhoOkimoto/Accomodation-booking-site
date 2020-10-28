//HOME SECTION ---------------------------------------------------------------------//
var sections = [
  { caption: 'Share room / Room rent', url: '/images/room_image/room2.jpg' },
  { caption: 'Enjoy with a pool', url: '/images/room_image/house3.jpg' },
  { caption: 'Resort / Unique houses', url: '/images/room_image/house6.jpg' },
];
var sectionContainer = document.querySelector('.section');
var section = '';
for (var i = 0; i < sections.length; i++) {
  section +=
    '<div class="section_item">' +
    '<a href="/listing">' +
    '<img src=' +
    sections[i].url +
    ' />' +
    '<h2 class="caption">' +
    sections[i].caption +
    '</h2>' +
    '</div>';
}
sectionContainer.innerHTML += section;

//Log in Modal
$('#login_myBtn').on('click', function () {
  $('#login_Modal').modal('show');
});

//Sign up Modal
$('#signup_myBtn').on('click', function () {
  $('#signup_Modal').modal('show');
});

//FORM VALIDATION
$(document).ready(function () {
  var validator = $('#signup-form').bootstrapValidator({
    fields: {
      email: {
        message: 'Email address is required',
        validators: {
          notEmpty: {
            message: 'Please Enter your email address',
          },
          stringLength: {
            min: 6,
            max: 32,
            message: 'Email address must be between 6 and 32 characters',
          },
        },
      },
    },
  });
});

//LOG IN POP UP---------------------------------------------------------------------------//
// document.querySelector('.login').addEventListener('click', function () {
//   document.querySelector('.header-container').classList.add('open');
// });

// document.querySelector('.log_cancelbtn').addEventListener('click', function () {
//   document.querySelector('.header-container').classList.remove('open');
// });
//----------------------------------------------------------------------------------------//

//SIGN IN POP UP---------------------------------------------------------------------------//
// document.querySelector('.sign_up').addEventListener('click', function () {
//   document.querySelector('.header-container2').classList.add('open');
// });

// document.querySelector('.cancelbtn').addEventListener('click', function () {
//   document.querySelector('.header-container2').classList.remove('open');
// });
//----------------------------------------------------------------------------------------//

// function validateForm() {
//   var name = document.signup_form.name.value;
//   var password = document.signup_form.password.value;
//   if (name == null || name == '') {
//     alert("Name can't be blank");
//     return false;
//   } else if (password.length < 6) {
//     alert('Password must be at least 6 characters long.');
//     return false;
//   } else {
//   }
// }
// function ValidateEmail(inputText) {
//   var mailformat = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
//   if (inputText.value.match(mailformat)) {
//     alert('Valid email address!');
//     document.form1.text1.focus();
//     return true;
//   } else {
//     alert('You have entered an invalid email address!');
//     document.form1.text1.focus();
//     return false;
//   }
// }
