var restBtn = document.querySelector(".restBtn");
var recipeBtn = document.querySelector(".recipeBtn");
var btnContainer =document.querySelector(".btnContainer");
var containerRest = document.querySelector(".containerRest"); 
var searchRest = document.querySelector(".searchRest"); 
var containerRecipe = document.querySelector(".containerRecipe")
var searchRecipe = document.querySelector(".searchRecipe"); 
var restResult = document.querySelector(".restResult")
var recipeResult = document.querySelector(".recipeResult")
var goback = document.querySelector("#goback");

var cardReciepe = document.querySelector(".card-image")

function hideRestaurants(){
    btnContainer.classList.remove("show");
    btnContainer.classList.add("hide");
    containerRest.classList.add("show");
}
function hideRecipe(){
  btnContainer.classList.remove("show");
    btnContainer.classList.add("hide");
    containerRecipe.classList.add("show");

}

function listRestaurants(rest){
  goback.classList.add("show");
  restResult.innerHTML = "";
  for(var i = 0; i< 5; i++){
    var address = rest.hints[i].food.restaurant.address;
    var postalCode = rest.hints[i].food.restaurant.postal;
    restResult.innerHTML += `
    <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
              </figure>
    <li>${address}  -  ${postalCode}</li>`
}

}
function listRecipes(recipe){
  goback.classList.add("show");
  recipeResult.innerHTML = "";
  for(var i = 0; i<5; i++){
    var calorie = Math.ceil(recipe.hits[i].recipe.calories);
    var label = recipe.hits[i].recipe.label;
    var imgR = recipe.hits[i].recipe.image;
    var recLink = recipe.hits[i].recipe.url;
    console.log(imgR)
    recipeResult.innerHTML += `
    <div class="card">
      <div class="card-image">
        <figure class="image is-128x128px">
          <img src=` + imgR +` alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
        <div class="content"> 
          <div id="recpText"> `
          + `${label}  - </br> ${calorie} Calories` + `
          </div>
          <div id="linkContent"><a href="` + `${recLink}` + `" target="_blank">
              Click for more</a>
          </div>
        </div>
      </div>
    </div>`
}
}

function goBack(){
  containerRest.classList.remove("show");
  containerRecipe.classList.remove("show");
  goback.classList.remove("show");
  btnContainer.classList.remove("hide");
}

function bringRestaurants(){

    var apiKey = "77b4c1d8-deba-4157-a707-5c0d63e2d0a7"
    geoUrl = 'https://ipfind.co/me?auth=' + apiKey
    fetch(geoUrl).then(function(response) {
      // request was successful
      if (response.ok) {
          response.json().then(function(data) {
              console.log(data);
             // p.innerHTML = data.longitude
             var id = "8288af20";
             var key = "e13b76e5858a79ab9d586980b305da5a";
             var lon = data.longitude;
             var lat = data.latitude;
             var searchTerm = document.querySelector("#rest").value;
             var distance = document.querySelector("#dist").value;
             var health = document.querySelector('#health').value;
            if (health){
             var apiUrlRest = `https://api.edamam.com/api/menu-items/v2/search?q=${searchTerm}&lat=${lat}&lon=${lon}&dist=${distance}&health=${health}&app_id=${id}&app_key=${key}`
            }else{
                var apiUrlRest = `https://api.edamam.com/api/menu-items/v2/search?q=${searchTerm}&lat=${lat}&lon=${lon}&dist=${distance}&app_id=${id}&app_key=${key}`
            }
             // nested api
            return fetch(apiUrlRest);
             }).then(function(response) {
               return response.json();
             }).then(function(rest){
               console.log(rest)
               listRestaurants(rest);
            });
          } else {
            alert("Error: " + response.statusText);
          }
        });
}

function bringRecipe(recSearch){
 
  var recSearch = document.querySelector("#recipe").value;
  var recipeApiKey = "5833503478a5c1d972dd59f1df3396f0"
  var recipeId = "ec473133"
  apiRecipe = `https://api.edamam.com/search?app_id=${recipeId}&app_key=${recipeApiKey}&q=${recSearch}`;
  fetch(apiRecipe).then(function(response) {
    // request was successful
    if (response.ok) {
        response.json().then(function(recipe) {
            console.log(recipe);
            listRecipes(recipe);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      });
}

restBtn.addEventListener("click", hideRestaurants);
recipeBtn.addEventListener("click", hideRecipe);
searchRest.addEventListener("click", bringRestaurants);
searchRecipe.addEventListener("click", bringRecipe);
goback.addEventListener("click", goBack);