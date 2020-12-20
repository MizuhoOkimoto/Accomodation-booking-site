//HOME SECTION ---------------------------------------------------------------------//
// var sections = [
//   { caption: "Share room / Room rent", url: "/images/room_image/room2.jpg" },
//   { caption: "Enjoy with a pool", url: "/images/room_image/house3.jpg" },
//   { caption: "Resort / Unique houses", url: "/images/room_image/house6.jpg" },
// ];
// var sectionContainer = document.querySelector(".section");
// var section = "";
// for (var i = 0; i < sections.length; i++) {
//   section +=
//     '<div class="section_item">' +
//     '<a href="/listing">' +
//     "<img src=" +
//     sections[i].url +
//     " />" +
//     '<h2 class="caption">' +
//     sections[i].caption +
//     "</h2>" +
//     "</div>";
// }
// sectionContainer.innerHTML += section;

//Booking price calculation
// $("#calculate").on("click", function () {
//     let checkIn = req.body.checkIn;
//     // let checkOut = req.body.checkOut;
//     // let days = checkOut.diff(checkIn, 'days');
//     // let price = days * req.body.price
//     // console.log("price:" + price);
//     console.log('checkIn');
// })
function daysDifference(perDayPrice) {
    //define two variables and fetch the input from HTML form  
    var dateI1 = document.getElementById("checkin").value;
    var dateI2 = document.getElementById("checkout").value;

    //define two date object variables to store the date values  
    var date1 = new Date(dateI1);
    var date2 = new Date(dateI2);

    //calculate time difference  
    var time_difference = date2.getTime() - date1.getTime();

    //calculate days difference by dividing total milliseconds in a day  
    var totalDays = time_difference / (1000 * 60 * 60 * 24);
    console.log(totalDays);
    console.log(perDayPrice);

    return document.getElementById("result").innerHTML = "Total Price: " + perDayPrice * totalDays;
}
