// when click hamburger menu //need to modify
document.querySelector('.navbar-toggler').onclick = function () {
    // if menu is opening, close menu
    if (document.getElementById('navbarNav').classList.contains('show')) {
        document.querySelector('#navbarNav').classList.remove('show');
    } else {
        document.querySelector('#navbarNav').classList.add('show');
    }
}


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
