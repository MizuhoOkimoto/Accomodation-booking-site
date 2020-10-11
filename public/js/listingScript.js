//INSERT PROPERTIES ----------------------------------------------------------------//
var index = [
    {caption:"Modern house with a big pool ", location:"Toronto", category:"Entire house", price:"100", url: "images/room_image/house1.jpg"},
    {caption:"Relax on the hill of the house", location:"Edmonton", category:"Entire house", price:"150", url: "images/room_image/house2.jpg"},
    {caption:"Feeling resort atmosphere", location:"Toronto", category:"Entire house", price:"100", url: "images/room_image/house3.jpg"},
    {caption:"Tiny house beside river", location:"Toronto", category:"Entire house", price:"80", url: "images/room_image/house4.jpg"},
    {caption:"Nice view from the roof", location:"Toronto", category:"Entire house", price:"100", url: "images/room_image/house5.jpg"},
    {caption:"Amazing vacation with beautiful view - ", location:"Toronto", category:"Entire house", price:"200", url: "images/room_image/house6.jpg"}
  ];

window.onload = function(){
    
    var imageContainer = document.getElementById("search-result");
    var result = "";
    for(var i = 0; i < index.length; i++){ 
        result +='<div class="property">' 
        + '<a href="room' + i + '.html" >'
        + "<img src=" + index[i].url + " />"
        + '<h2 class="caption">' + index[i].caption + '</h2>' 
        + '<p class="location category">' + index[i].location + " / "
        + index[i].category + '</p>'
        + '<p class="price">' + "Per night: $" + index[i].price + '</p>' 
        +"</a>"
        +"</div>";
    }
      imageContainer.innerHTML += result; 
};

document.querySelector(".sign_up").addEventListener("click",function() {
    // document.querySelector(".header-right").classList.remove("hidden");
    document.querySelector(".header-right").classList.add("open");
    
  })
  
  document.querySelector(".cancelbtn").addEventListener("click",function() {
    document.querySelector(".header-right").classList.remove("open");
    
  })