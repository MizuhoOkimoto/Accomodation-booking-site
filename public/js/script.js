//HOME SECTION ---------------------------------------------------------------------//
var sections= [
  {caption:"Room", url: "/images/room_image/room2.jpg"},
  {caption:"With pool", url: "/images/room_image/house3.jpg"},
  {caption:"cottage", url: "/images/room_image/room5.jpg"}
];
var imageContainer = document.querySelector(".section");
    var section = "";
    for(var i = 0; i < sections.length; i++){ 
        section +='<div class="section_item">' 
        + "<img src=" + sections[i].url + " />"
        + '<h2 class="caption">' + sections[i].caption + '</h2>' 
        +"</div>";
    }
      imageContainer.innerHTML += section; 


//INSERT PROPERTIES ----------------------------------------------------------------//
var index = [
    {caption:"Modern house with a big pool ", location:"Toronto", category:"Entire house", price:"100", url: "./room_image/house1.jpg"},
    {caption:"Relax on the hill of the house", location:"Edmonton", category:"Entire house", price:"150", url: "./room_image/house2.jpg"},
    {caption:"Feeling resort atmosphere", location:"Toronto", category:"Entire house", price:"100", url: "./room_image/house3.jpg"},
    {caption:"Tiny house beside river", location:"Toronto", category:"Entire house", price:"80", url: "./room_image/house4.jpg"},
    {caption:"Nice view from the roof", location:"Toronto", category:"Entire house", price:"100", url: "./room_image/house5.jpg"},
    {caption:"Amazing vacation with beautiful view - ", location:"Toronto", category:"Entire house", price:"200", url: "./room_image/house6.jpg"}
  ];

window.onload = function(){
    
    var imageContainer = document.getElementById("search-result");
    var result = "";
    for(var i = 0; i < index.length; i++){ 
        result +='<div class="property">' 
        + "<img src=" + index[i].url + " />"
        + '<h2 class="caption">' + index[i].caption + '</h2>' 
        + '<p class="location category">' + index[i].location + " / "
        + index[i].category + '</p>'
        + '<p class="price">' + "Per night: $" + index[i].price + '</p>'
        +"</div>";
    }
      // imageContainer.innerHTML += result; 
};
//SIGN IN POP UP---------------------------------------------------------------------------//
document.querySelector(".sign_up").addEventListener("click",function() {
  // document.querySelector(".header-right").classList.remove("hidden");
  document.querySelector(".header-right").classList.add("open");
  
})

document.querySelector(".cancelbtn").addEventListener("click",function() {
  document.querySelector(".header-right").classList.remove("open");
  
})
//----------------------------------------------------------------------------------------//

function validateForm(){
  var name = document.signup_form.name.value;
  var password = document.signup_form.password.value;
  if(name == null || name == ""){
    alert("Name can't be blank");
    return false;
  }
  else if(password.length < 6){
    alert("Password must be at least 6 characters long.");  
    return false;
  }
  else{


  }
}
function ValidateEmail(inputText)
{
var mailformat = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
if(inputText.value.match(mailformat))
{
alert("Valid email address!");
document.form1.text1.focus();
return true;
}
else
{
alert("You have entered an invalid email address!");
document.form1.text1.focus();
return false;
}
}
//--- DETAIL PAGE -----------------------------------------------------------------//
var details= [
  {caption:"Room", url: "/images/room_image/room2.jpg"}
];

var imageContainer = document.querySelector(".section");
    var section = "";
    for(var i = 0; i < sections.length; i++){ 
        section +='<div class="section_item">' 
        + "<img src=" + sections[i].url + " />"
        + '<h2 class="caption">' + sections[i].caption + '</h2>' 
        +"</div>";
    }
      imageContainer.innerHTML += section; 

