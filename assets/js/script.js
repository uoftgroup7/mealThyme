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

//target for cards to be created into
var results = document.getElementById("resultBody");

//search button history 
var searchHistoryBtn = document.getElementById("searchHistoryBtn");

//indicate if searching for restaurant or recipe
var state = 0;

//addded here
var incStart = 0;
var incEnd = 5;
var savRec;
var searchArray=[];

// Local storage
searchLS = window.localStorage.getItem('search');
if (!searchLS) {
  searchArray = [];
}else {
  searchArray = JSON.parse(searchLS);
}
//done

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
  showHistoryBtn();
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
      searchBtnClick();
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

//get user location from IP address
var locationCheck = function (input1, input2, search) {
  var apiUrl = 'https://ipfind.co/me?auth=bfa145bd-e61e-42ba-9201-cba8041120d7'

  fetch(apiUrl).then(function(response) {
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
    var restApi = 'https://api.edamam.com/api/menu-items/v2/search?q=' + value + '&lat=' + lat + '&lon=' + lon + '&dist=' + dist + '&app_id=8288af20&app_key=e13b76e5858a79ab9d586980b305da5a';

    fetch(restApi).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          clearScreen();
          listRestaurants(data);
        })
      } else {
        errorMsg1.textContent = "Not a restuarants found, please try again.";
      }
    })
  } else {
    //call recipe api
    var recApi = 'https://api.edamam.com/search?q=' + value + '&app_id=ec473133&app_key=5833503478a5c1d972dd59f1df3396f0';

    fetch(recApi).then(function (response) {
      console.log(response)
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          if (data.count > 0) {
            clearScreen();
            listRecipes(data);
          } else {
            errorMsg1.textContent = "No foods found, please try again.";
          }
        })
      }
    })
  }
}


  var listRestaurants = function (data) {
    //run through and list first 10 restaurants found
    for (var i = 0; i < 5; i++) {
      var card = document.createElement('div');
      card.classList = 'card';

      //two p tags for restaurant name and location
      var restName = document.createElement('p');
      var restLoc = document.createElement('p');
      //define where to get information from
      restName = data.hints[i].food.restaurant.address;
      restLoc = data.hints[i].food.restaurant.postal;
      var text1 = document.createTextNode(restName);
      var text2 = document.createTextNode(restLoc);

      //add to card element created above
      card.appendChild(text1);
      card.appendChild(text2);
      //add card to hero body
      results.appendChild(card);
      deactivateModal();
    }

  }

  var listRecipes = function (data) {
    for (var i = 0; i < 5; i++) {
      var cals = Math.ceil(data.hits[i].recipe.calories);
      var name = data.hits[i].recipe.label;
      var imgUrl = data.hits[i].recipe.image;
      var recUrl = data.hits[i].recipe.url;
      results.innerHTML += `
    <div class="card">
      <div class="card-image">
        <figure class="image is-128x128px">
        <img src=` + imgUrl + ` alt="Cover Image">
        </p>
        </figure>
      </div>
      <div class="card-content">
        <div class="content" id="` + name + `">
          <div id="recpText"> `
        + `${name}  - </br> ${cals} Calories` + `
          </div>
          <div>
            <a href="` + recUrl + `" target="_blank">Click here for recipe</a>
          </div>
        </div>
      </div>
    </div>`
    }
    deactivateModal();
  }

  //function to remove all elements in the body
  var clearScreen = function () {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  //added here
  function searchBtnClick () {
    searchHistoryBtn.innerHTML += `<button class="button is-primary is-rounded" id="historyButton">`+searchStuff.value+`</button>`
  }
  
  function goNext (){
    incStart = 5;
    incEnd = 10;
    listRecipes(savRec,incStart,incEnd,1)
    incStart = 0;
    incEnd = 5;
  }

  //done
  
  function showHistoryBtn (){
    //clear previous
    searchHistoryBtn.innerHTML="";
    histLen = searchArray.length;
    for (i=0;i<histLen;i++){
      searchHistoryBtn.innerHTML += 
      `<button class="button is-primary is-rounded" id="historyButton">`
      +searchArray[i]
      +`</button>`
    }
  }
  

  restBtn.addEventListener("click", activateModal);
  restBtn.addEventListener("click", restaurantModal);
  recipeBtn.addEventListener("click", activateModal);
  recipeBtn.addEventListener("click", recipeModal);
  modalClose1.addEventListener("click", deactivateModal);
  modalClose2.addEventListener("click", deactivateModal);
  searchBtn.addEventListener("click", searchCall);
  //nextBtn.addEventListener("click", goNext);
  document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'historyButton' ) {
    alert("click")
  };
});









