'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', []);


app.controller("MyController", function ($scope, $http) {

    $scope.loggedIn = true;
    $('#myModal').modal({ show: false})



    $scope.getAllUsers = function () {
        $http({method: 'GET', url: 'https://localhost:3000/api/users/all'})
            .success(function (data) {
                $scope.allUsers = data
            });
    }




    $scope.delete = function (id) {
        // $http({method: 'DELETE', url: 'http://localhost:3000/delete'})
        //     .success(function (data) {
        //         $scope.deleteItem = data;
        //
        //
        //     });
        alert("bruger er sletter: " + id)
    }

    $scope.openUpdateModal = function (user) {
        $('#userNameToUpdate').val(user.id)
        $('#userPasswordToUpdate').val(user.name)
        // $('#userNameToUpdate').value = user.id

        console.log(user.id)
        $('#myModal').modal('show');
    }

    $scope.update = function () {
        var a = $('#userPasswordToUpdate').val()  //her sender vi det nye password
        // $http({method: 'PUT', url: 'http://localhost:3000/update'})
        //     .success(function (data) {
        //         $scope.updateItem = data;
        //
        //     });

        alert(a)
       var userName = $('#userNameToUpdate').innerText
        console.log(userName)
    }









    $http({method: 'GET', url: 'https://localhost:3000/activecookie'})
        .success(function (data, status) {

            if(status == 200)
            {
                // får du en status 200 har du en session cookie på serveren og kan derfor logges ind.
                $scope.loginForm = !$scope.loginForm // skal ligge i whatever efter vi er logget ind.
                $scope.loggedIn = !$scope.loggedIn;
                $scope.fejl = "logget ind"
                $scope.loggedInUser = data.userID // få det fra user vi får tilbage fra DB
                //kør get all users
                $scope.getAllUsers()
            }
        });



    $scope.login = function () {

        var un =  $scope.userName
        var pw = $scope.passWord
        console.log("u : " + un + " pw: " + pw)
        var jsonData = {userName : un, password: pw}
        $http.post("https://localhost:3000/login/", JSON.stringify(jsonData))
            .success(function (data) {
                console.log(Object.keys(data));
                $scope.loginForm = !$scope.loginForm // skal ligge i whatever efter vi er logget ind.
                $scope.loggedIn = !$scope.loggedIn;
                $scope.fejl = "logget ind"
                $scope.getAllUsers()

            });

        $scope.loggedInUser = un // få det fra user vi får tilbage fra DB

    }


    $scope.openCreateModal = function () {
        $('#createModal').modal('show');

    }


    $scope.create = function () {
        var un = $('#createUserName').val()
        var pw = $('#createPassword').val()
        // $http({method: 'POST', url: 'http://localhost:3000/update'})
        //     .success(function (data) {
        //         $scope.updateItem = data;
        //
        //     });

        alert(un + ", " + pw)

    }


})
