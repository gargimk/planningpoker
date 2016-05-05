var pokerApp = angular.module("planningPoker", ["ngMaterial","ngRoute","ngMessages"]);

pokerApp.controller("PokerCtrl",["$scope","$http","$location", function ($scope, $http, $location) {
    $scope.user = { name : ""};
    var imagePath = "img/list/60.jpeg";
    $scope.userStories = [{
        face: imagePath,
        title: "Brunch this weekend?",
        description: " I'll be in your neighborhood doing errands"
    },
    {
        face: imagePath,
        title: "Brunch this weekend?",
        description: " I'll be in your neighborhood doing errands. I'll be in your neighborhood doing errands"
    }];

    $scope.cards = [{ value: 0.5, imagePath: "b-0.png" }, { value: 1, imagePath: "b-1.png" }, { value: 2, imagePath: "b-2.png" }, { value: 3, imagePath: "b-3.png" }, { value: 5, imagePath: "b-5.png" }, { value: 8, imagePath: "b-8.png" }, { value: 13, imagePath: "b-13.png" }, { value: 20, imagePath: "b-20.png" }, { value: 40, imagePath: "b-40.png" }, { value: 100, imagePath: "b-100.png" }, { value: "?", imagePath: "b-noidea.png" }];
    
    $scope.newuser = {
      email : "",
      username : "",
      password : ""
    }
    
    $scope.showLogin = function(){
      $location.path("/");
    };
    $scope.showSignUp = function(){
      $location.path("/signup");
    };
    
    $scope.callSignUp = function(){
      $http({
            method: "POST",
            url: "/api/user",
            data: $scope.newuser
        }).then(function successCallback(response) {
            console.log(response.data);
            if(response.data.username){
                $scope.user = response.data;
                $location.path("/poker");
            }else{
                window.alert(response.data.result);
            }
        }, function errorCallback(response) {
            console.error(response);
        });
    }
    
    $scope.credential = {
      username : "",
      password : ""
    }
    
    $scope.callLogin = function(){
      $http({
            method: "POST",
            url: "/api/userlogin",
            data: $scope.credential
        }).then(function successCallback(response) {
            console.log(response.data);
            if(response.data.username){
                $scope.user = response.data;
                $location.path("/poker");
            }else{
                window.alert(response.data.result);
            }
        }, function errorCallback(response) {
            console.error(response);
        });
    }
    
     /*********   Themes   ************* */
    $scope.themes = ["default","purple","red"];
    $scope.dynamicTheme = "default";
    $scope.getSelectedText = function () {
        if ($scope.selectedItem !== undefined) {
            return $scope.selectedItem;
        } else {
            return "Please select a theme";
        }
    };
    /***********   Cookie   ******************** */
    function setCookie(cname, cvalue, exmins) {
      var d = new Date();
      d.setTime(d.getTime() + (exmins*60*1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(";");
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
}]);

pokerApp.config(["$mdThemingProvider","$routeProvider","$compileProvider", function($mdThemingProvider,$routeProvider,$compileProvider) {
    $compileProvider.debugInfoEnabled(false);
    $mdThemingProvider.theme("default")
        .primaryPalette("blue")
        .accentPalette("orange");
    $mdThemingProvider.theme("purple")
        .primaryPalette("purple");
    $mdThemingProvider.theme("red")
        .primaryPalette("red");
            
    $mdThemingProvider.setDefaultTheme("default");
    $mdThemingProvider.alwaysWatchTheme(true);
    
    /******************************** */
    $routeProvider
    .when("/", {
        templateUrl:"Client/templates/login.html",
        //controller: "mainController"
    })
    .when("/signup", {
        templateUrl:"Client/templates/signup.html",
    })
    .when("/poker", {
        templateUrl:"Client/templates/poker.html",
        //controller: "fileupload"
    })
    .otherwise({
        redirectTo:"/"
    });     
}]);

pokerApp.service("socket", ["$location", "$timeout",
    function ($location, $timeout) {
        this.initiate = function () {
            // this.socket = io();
            this.socket = io.connect("http://localhost:5000");
        };

        this.on = function (eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function (data) {
                    $timeout(function () {
                        callback(data);
                    });
                });
            }
        };

        this.emit = function (eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        this.removeListener = function (eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);

pokerApp.service("auth",["$scope", "$http", function($scope, $http){
    $scope.authorized = false;
    $scope.user;
    this.isAuthorized = function(){
        return $scope.authorized;
    }
  
    this.authenticate = function(credential, callback){
        $http({
            method: "POST",
            url: "/api/userlogin",
            data: credential
        }).then(function successCallback(response) {
            console.log(response.data);
            if(response.data.username){
                $scope.authorized = true;
                $scope.user = response.data;
                callback(response.data);
            }else{
                window.alert(response.data.result);
                $scope.authorized = false;
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Sorry the password doesn't match.")
                        .position("top right")
                        .hideDelay(3000)
                        .parent("md-content.md-padding")
                );
                callback(response.data);
            }
        }, function errorCallback(response) {
            console.error(response);
        });
    }
  
}]);