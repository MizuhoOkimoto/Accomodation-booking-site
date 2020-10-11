//--- DETAIL PAGE -----------------------------------------------------------------//
var details= [
  {caption:"Room", main: "/images/room_image/room2.jpg", sub1: "/images/room6.jpg",sub2: "/images/room7.jpg"}
];

window.onload = function(){
  console.log("cagdas is a dummy")
var detailContainer = document.querySelector(".detail");
    var detail = "";
    for(var i = 0; i < details.length; i++){ 
        detail +='<div class="detail_page">' 
        + "<img src=" + details[i].main + " />"
        + "<img src=" + details[i].sub1 + " />"
        + "<img src=" + details[i].sub2 + " />"
        + '<h2 class="caption">' + detail[i].caption + '</h2>' 
        +"</div>";
    }
    detailContainer.innerHTML += detail; 
};

    //-----------------------------------------------------------------
    document.querySelector(".sign_up").addEventListener("click",function() {
      // document.querySelector(".header-right").classList.remove("hidden");
      document.querySelector(".header-right").classList.add("open");
      
    })
    
    document.querySelector(".cancelbtn").addEventListener("click",function() {
      document.querySelector(".header-right").classList.remove("open");
      
    })
    //------------------------------------------------------------------------------