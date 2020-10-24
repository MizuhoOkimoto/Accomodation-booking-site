//INSERT PROPERTIES ----------------------------------------------------------------//
var index = [
  {
    caption: 'Modern house with a big pool',
    location: 'Toronto',
    category: 'Entire house',
    price: '100',
    rate: '4.2',
    url: 'images/room_image/house1.jpg',
  },
  {
    caption: 'Relax on the hill of the house',
    location: 'Edmonton',
    category: 'Entire house',
    price: '150',
    rate: '4.1',
    url: 'images/room_image/house2.jpg',
  },
  {
    caption: 'Feeling resort atmosphere',
    location: 'Toronto',
    category: 'Entire house',
    price: '100',
    rate: '3.9',
    url: 'images/room_image/house3.jpg',
  },
  {
    caption: 'Tiny house beside river',
    location: 'Toronto',
    category: 'Entire house',
    price: '80',
    rate: '4.6',
    url: 'images/room_image/house4.jpg',
  },
  {
    caption: 'Nice view from the roof',
    location: 'Toronto',
    category: 'Entire house',
    price: '100',
    rate: '3.7',
    url: 'images/room_image/house5.jpg',
  },
  {
    caption: 'Amazing vacation with beautiful view - ',
    location: 'Toronto',
    category: 'Entire house',
    price: '200',
    rate: '4.2',
    url: 'images/room_image/house6.jpg',
  },
];

window.onload = function () {
  var imageContainer = document.getElementById('search-result');
  var result = '';
  for (var i = 0; i < index.length; i++) {
    result +=
      '<div class="property">' +
      '<a href="room' +
      i +
      '.html" >' +
      '<img src=' +
      index[i].url +
      ' />' +
      '<h2 class="caption">' +
      index[i].caption +
      '</h2>' +
      '<p class="location category">' +
      index[i].location +
      ' / ' +
      index[i].category +
      '</p>' +
      '<p class="price">' +
      '$' +
      index[i].price +
      'CAD/night' +
      '</p>' +
      '<p class="rate">' +
      '★' +
      index[i].rate +
      '</p>' +
      '</a>' +
      '</div>';
  }
  imageContainer.innerHTML += result;
};

//LOG IN POP UP---------------------------------------------------------------------------//
document.querySelector('.login').addEventListener('click', function () {
  document.querySelector('.header-container').classList.add('open');
});

document.querySelector('.log_cancelbtn').addEventListener('click', function () {
  document.querySelector('.header-container').classList.remove('open');
});
//----------------------------------------------------------------------------------------//

//SIGN IN POP UP---------------------------------------------------------------------------//
document.querySelector('.sign_up').addEventListener('click', function () {
  document.querySelector('.header-container2').classList.add('open');
});

document.querySelector('.cancelbtn').addEventListener('click', function () {
  document.querySelector('.header-container2').classList.remove('open');
});
//----------------------------------------------------------------------------------------//
