//HOME SECTION ---------------------------------------------------------------------//
var sections= [
  {caption:"Room", url: "/images/room_image/room2.jpg"},
  {caption:"With pool", url: "/images/room_image/house3.jpg"},
  {caption:"cottage", url: "/images/room_image/room5.jpg"}
];
var sectionContainer = document.querySelector(".section");
    var section = "";
    for(var i = 0; i < sections.length; i++){ 
        section +='<div class="section_item">' 
        + "<img src=" + sections[i].url + " />"
        + '<h2 class="caption">' + sections[i].caption + '</h2>' 
        +"</div>";
    }
      sectionContainer.innerHTML += section; 



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