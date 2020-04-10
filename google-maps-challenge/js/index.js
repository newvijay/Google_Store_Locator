
window.onload=()=>{
    box=document.querySelector("#zip-code-input");
     if(box) {
    box.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            searchStores();
        }
    });
}
}

      var map;
      var box;
      var markers = [];
      var infoWindow;
      var directionsService;
      var directionsDisplay;
      var Indiana;
      var pointA;
      var pointB;
      var startaddress;
function initMap() {
    Indiana = {lat: 39.690617, lng: -86.173619};
    startaddress = new google.maps.LatLng(39.690617,-86.173619);
   map = new google.maps.Map(document.getElementById('map'), {
        center: Indiana,
        zoom: 11,
        mapTypeId: 'roadmap',
    })
    infoWindow = new google.maps.InfoWindow();
    searchStores();

}

function setOnClickListener() {
    var storeElements=document.querySelectorAll('.store-container');
storeElements.forEach(function (element,index) {
    element.addEventListener('click',function () {
         google.maps.event.trigger(markers[index], 'click');
    })
})
}


function searchStores() {
    var foundStores=[]
    var zipCode=document.getElementById('zip-code-input').value;
    if(zipCode) {
        for (var store of stores) {
            var postalCode = store['address']['postalCode'].substr(0, 5);
            if (postalCode === zipCode)
                foundStores.push(store);
        }
        if(foundStores.length ==0 ) {
            alert("Sorry, we don't have a store at that zipcode yet. Please try another zip.");
            document.getElementById('zip-code-input').value="";
            foundStores=stores;
        }
    }
    else
        foundStores=stores;
    clearMarkers();
    displayStores(foundStores);
    showMarkers(foundStores);
    setOnClickListener();

}

function clearMarkers(){
     infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
         }
         markers.length = 0;
}


function displayStores(stores) {
    var storesHtml='';
    var address='';
    var phonenum='';
    for(var [index,store] of stores.entries()){
    address=store['addressLines'];
    phonenum=store['phoneNumber'];
        storesHtml +=`
         <div class="store-container">
         <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                        </div>

                        <div class="store-phone-number">
                        
                        ${phonenum}
                        </div>
                    </div>
                    <div class="store-number-container">
                    <div class="store-number">${index+1}</div>
                    </div>
                    </div>
                </div>
        `
        document.querySelector('.stores-list').innerHTML=storesHtml;
    }

}



        function showMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of stores.entries()) {

        var name=store["name"];
        var address=store["addressLines"][0];
        var phonenum=store['phoneNumber'];
        var timing=store['openStatusText'];
    var latlng = new google.maps.LatLng(
                  parseFloat(store["coordinates"]["latitude"]),
                  parseFloat(store["coordinates"]["longitude"]));
                         bounds.extend(latlng);
        createMarker(latlng,name,address,phonenum,timing,index+1);
    }
               map.fitBounds(bounds);

}

        function createMarker(latlng, name, address,phonenum,timing,index) {
        //  var html = "<b>" + name + "</b> <br/>" +timing+ "<br/>"+ address + " <br/>"+ phonenum;

          var html = `
         <div class="store-info-window">
                        <div class="store-info-name">
                        <span>${name}</span></div>
                        <div class="store-info-timing">
                        <span>${timing}</span></div>
                        <div class="store-info-address">
                        <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                        </div>
                      <a href="https://www.google.com/maps?z=15&saddr=${startaddress}&daddr=${latlng}"> ${address}</a>
                        </div>
            <div class="store-info-phone">
            <div class="circle">
                <i class="fas fa-phone-alt"></i>
                </div>
                ${phonenum}
            </div>
          </div>
`
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
              label:index.toString()
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
        }
