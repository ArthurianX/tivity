angular.module( 'tivity.search', [
  'ui.router.state',
  'foursquare',
  'geolocation',
  'fetchLocations',
  'ajoslin.promise-tracker'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */

  .controller( 'SearchCtrl', function SearchController( $scope, geolocation, foursquare, $stateParams, promiseTracker, $rootScope ) {
    $scope.queryParam = $stateParams.queryVenue;

    //Create / get our tracker with unique ID
    $scope.loadingTracker = promiseTracker('loadingTracker');

    geolocation.getLocation().then(function(data){

      //When location data is ready, we populate the scope.
      $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
      var location = data.coords.latitude + ',' + data.coords.longitude;

      //With the location at hand, we're calling the foursquare service.
      foursquare.searchVenue(location, $stateParams.queryVenue).then(function(data){

        //when the data is ready, populate the $scope variables.
        if ($rootScope.debugStatus === true) {
          console.log('Search Page: Results Objects');
          console.log(data[0].response.venues);
        }



        $scope.locations = data[0].response.venues;

        //console.log($scope.locations);

        //Check to see if the venue has a photo, if not display a default one.
        var nrLocations = data[0].response.venues.length;
        for( var i=0 ; i < nrLocations; i++ ) {
          //Create a category name in the scope for each venue to add it in the link
          var categoryName = data[0].response.venues[i].categories[0].shortName;
          data[0].response.venues[i].categories[0].categoryName = categoryName.toLowerCase();
          var venueName = encodeURI(data[0].response.venues[i].name.toLowerCase().replace(/ /g,"-").replace(/[&'<>"0123456789]/g,""));
          data[0].response.venues[i].venueName = venueName;
          if ($rootScope.debugStatus === true) {
            console.log('Search Page: Search term');
            console.log(venueName.toLowerCase());
          }


          //Call for each venue foursquare for the image
          /*var venueID = data[0].response.venues[i].id;

          foursquare.getImage(venueID).then(function(data){
            console.log('image data');
            console.log(data);
          });*/
          //TODO: need to rewrite this in a different way so I can fetch images for all the venues in the search result.

        }
        //If there is only one result, redirect to the venue page automatically.
        if (data[0].response.venues.length == '1') {
          window.location = "/section/" + data[0].response.venues[0].categories[0].categoryName + "/" + data[0].response.venues[0].id + "/" + data[0].response.venues[0].venueName;
        }

      });
    });

  })

;

