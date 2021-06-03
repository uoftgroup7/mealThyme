//navbar search buttons
var restBtn = document.getElementById("restSearch");
var recipeBtn = document.getElementById("recipeSearch");

//modal setup
var modal1 = document.getElementById("modal");
var modalTitle = document.querySelector("modal-card-title");
var modalClose1 = document.getElementById("close1");
var modalClose2 = document.getElementById("close2");
var errorMsg1 = document.getElementById("errorMsg1");
var errorMsg2 = document.getElementById("errorMsg2");
var guideMsg1 = document.getElementById("inputGuide1");
var guideMsg2 = document.getElementById("inputGuide2");

//input search fields
var typeSearch = document.getElementById("searchType");
var inputOne = document.getElementById("searchStuff");
var cardTwo = document.getElementById("cardTwo")
var inputTwo = document.getElementById("distance");
var searchBtn = document.getElementById("searchBtn");

var btnContainer = document.querySelector(".btnContainer");
var containerRest = document.querySelector(".containerRest");
var searchRest = document.querySelector(".searchRest");
var containerRecipe = document.querySelector(".containerRecipe")
var searchRecipe = document.querySelector(".searchRecipe");
var restResult = document.querySelector(".restResult")
var recipeResult = document.querySelector(".recipeResult")
var goback = document.querySelector("#goback");

//indicate if searching for restaurant or recipe
var state = 0;

//open and close modal
var activateModal = function () {
  modal1.classList.add("is-active", "is-clipped");
}

var deactivateModal = function () {
  modal1.classList.remove("is-active", "is-clipped");
  inputOne.value = "";
  inputTwo.value = "";
  errorMsg1.textContent = "";
  errorMsg2.textContent = "";
  guideMsg1.textContent = "";
  guideMsg2.textContent = "";
  cardTwo.style.display = "block";
}

//change display within modal depending on which button was clicked
var restaurantModal = function () {
  typeSearch.textContent = "Search for a Restaurant Near You";
  guideMsg1.textContent = "Search for a type of food";
  inputTwo.style.display = "block";
  guideMsg2.textContent = "Enter a distance (in miles)";
  state = 0;
}

var recipeModal = function () {
  typeSearch.textContent = "Search for a Recipe";
  guideMsg1.textContent = "Search for a food";
  cardTwo.style.display = "none";
  state = 1;
}

//search function called when search button is pressed
var searchCall = function () {
  errorMsg1.textContent = "";
  errorMsg2.textContent = "";
  if (state === 0) {
    //error checking that user entered values
    if (inputOne.value && inputTwo.value) {
      var inputTextRest = inputOne.value;
      var inputTextRest2 = inputTwo.value;
      locationCheck(inputTextRest, inputTextRest2, 0);
    } else if (inputOne.value && !inputTwo.value) {
      errorMsg2.textContent = "Please enter a distance!";
    } else if (!inputOne.value && inputTwo.value) {
      errorMsg1.textContent = "Please enter a type of food!";
    }
  } else {
    if (inputOne.value) {
      var inputTextRec = inputOne.value;
      locationCheck(inputTextRec, 0, 1);
    }
  }
}

var locationCheck = function (input1, input2, search) {
  var apiUrl = 'https://ipfind.co/me?auth=77b4c1d8-deba-4157-a707-5c0d63e2d0a7'

  //get user location from IP address
  fetch(apiUrl).then(function (response) {
    //if response was successful
    if (response.ok) {
      response.json().then(function (data) {
        var lon = data.longitude;
        var lat = data.latitude;
        //console.log(lon);
        //console.log(lat);
        selectSearch(input1, input2, search, lat, lon);
      })
    }
  })
}

var selectSearch = function (value, dist, search, lat, lon) {
  //change which search is used depending on restaurant or recipe clicked
  if (search === 0) {
    //call restaurant api
    var restApi = 'https://api.edamam.com/api/menu-items/v2/search?q=$' + value + '&lat=$' + lat + '&lon=$' + lon + '&dist=$' + dist + '&app_id=$8288af20&app_key=$e13b76e5858a79ab9d586980b305da5a';

    fetch(restApi).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        })
      } else {

      }
  })
} else {
  //call recipe api
  var recApi = '';
  }
}

restBtn.addEventListener("click", activateModal);
restBtn.addEventListener("click", restaurantModal);
recipeBtn.addEventListener("click", activateModal);
recipeBtn.addEventListener("click", recipeModal);
modalClose1.addEventListener("click", deactivateModal);
modalClose2.addEventListener("click", deactivateModal);
searchBtn.addEventListener("click", searchCall);