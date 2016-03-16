angular.module('med.controllers', ['med.services', 'ngResource'])

.controller("usersCtrl", function($scope, Users, Hours, $state, $stateParams, $window, $ionicPopup, $ionicModal, $http){


  /* MODAL DíaAS*/
  $ionicModal.fromTemplateUrl('templates/days.html',{
      scope:$scope
  })
  .then(function(modal){
      $scope.modalDays = modal;
  })

  $scope.openDaysForm = function(user){

      $scope.user = user;

      if (angular.isDefined( $scope.user ) && angular.isDefined( $scope.user.days )) {
        var days = $scope.user.days;
        $scope.days =
             { "l": days.indexOf("L") > -1,
               "m": days.indexOf("M") > -1,
               "x": days.indexOf("X") > -1,
               "j": days.indexOf("J") > -1,
               "v": days.indexOf("V") > -1,
               "s": days.indexOf("S") > -1,
               "d": days.indexOf("D") > -1
             };
      }

      $scope.modalDays.show();
  }

  $scope.closeDaysForm = function(){
      $scope.modalDays.hide();
  }

  /* MODAL LISTA HORAS*/

  $ionicModal.fromTemplateUrl('templates/hours.html',{
      scope:$scope
  })
  .then(function(modal){
      $scope.modalHours = modal;
  })

  $scope.openHoursForm = function(hours){

      if(hours == null){
          hours = [];
      }
      $scope.user.hours = hours;

      if (angular.isDefined($scope.user) && angular.isDefined($scope.user.hours)) {
      //  var days = $scope.user.hours;
        /*$scope.days =
             { "l": days.indexOf("L") > -1,
               "m": days.indexOf("M") > -1,
               "x": days.indexOf("X") > -1,
               "j": days.indexOf("J") > -1,
               "v": days.indexOf("V") > -1,
               "s": days.indexOf("S") > -1,
               "d": days.indexOf("D") > -1
             };*/
      }

      $scope.modalHours.show();
  }

  $scope.closeHoursForm = function(){
      $scope.modalHours.hide();
  }

  /*****/

  $scope.initUsers = function(){


    Users.all().then(function(users){
      $scope.users = users;
      console.log(users);

/*
       for(var u = 0; u < users.length; u++){

            var usrId = users[u].id;
             console.log(JSON.stringify(users[usrId]));

             Hours.getByMed(usrId).then(function(res, $timeout){
                console.log("uir id "+usrId);
                var hours = [];
                for(var i = 0; i < res.length; i++){
                  hours.push(res[i].hour);
                  //console.log(JSON.stringify(hours));

                  console.log("user -> "+ $scope.users[1].name);
                  //usr.hours.push(res[i].hour);
                }

             });

       }
*/
    })



    $scope.remove = function(userId){

      $ionicPopup.confirm({
            title: "Eliminar",
            template: "¿Esta seguro que quiere eliminar este medicamento?",
            scope: $scope,
            buttons: [
              {
                text: "Aceptar",
                type: "button-positive",
                onTap: function(e){

                      Users.remove(userId).then(
                        function(res){
                          $window.location.reload();
                        },
                        function(error){
                          console.log(error);
                        }
                      )
                }
              },
              {
                text: "Cancelar"
              }
            ]
        })

    }


  }

  $scope.initAddUsers = function(){


      if(!angular.isDefined($scope.user)){
         var user = {
            name : "",
            days : "",
            //daycodes : "",
            hours : ["11:20","13:10"]
          }

        $scope.user = user;
      }


      $scope.save = function(user){


               if(!angular.isDefined(user) || user.name==""){
                    alert("No se ha especificado el nombre");
               }else{

                 if(!angular.isDefined(user.days)){
                   user.days="";
                 }

                 if(!angular.isDefined(user.hours)){
                   user.hours=[];
                 }


                 console.log("save "+ JSON.stringify(user));
                 for(var i=0; i < user.hours.length; i++){
                    console.log("Hora-> "+user.hours[i]);
                 }

                 alert(JSON.stringify(user));

                  Users.add(user).then(
                      function(res){

                      //alert("lastId "+res.insertId);

                        for(var i=0; i < user.hours.length; i++){
                           var hora = user.hours[i];
                            console.log("Va a guarda hora-> "+hora);
                            Hours.add(res.insertId, hora).then(
                                function(res){
                                  console.log("guardo hora ok ");
                                    //$state.go("users");
                                },
                                function(error){
                                    console.log(error);
                                }
                            );
                        }

                        $state.go("users");
                      },
                      function(error){
                          console.log(error);
                      }
                  );


                 /*
                  var hour = {
                    med_id : user.id,
                    hour: "33:33"
                  }

                  Hours.add(hour).then(
                      function(res){
                          $state.go("users");
                      },
                      function(error){
                          console.log(error);
                      }
                  );
                 */

                }
          }

      }

      $scope.initEditUsers = function(){

          var id = $stateParams.userId;
          Users.get(id).then(function(user){
            $scope.user = user;

              //Recupera las horas guardadas y las añade al objeto
              Hours.getByMed(user.id).then(function(res){
                 var hours = [];
                 for(var i = 0; i < res.length; i++){
                   hours.push(res[i].hour);
                 }
                 $scope.user.hours = hours;

                 console.log("hours-> "+JSON.stringify($scope.user));

              });


          });







          $scope.update = function(user){

            Users.update(user).then(
              function(res){
                /*
                console.log("Guarda hora-> "+user.name);
                Hours.add(user.id, user.hour).then(
                    function(res){
                        $state.go("users");
                    },
                    function(error){
                        console.log(error);
                    }
                );
                */
                $state.go("users");
              },
              function(error){
                consoloe.log(error);
              }
            )
          }
      }

      $scope.initDays = function(){

          $scope.setDays = function(days){

             var selectedDays = "";
             if(days){
               if(days.l) selectedDays = selectedDays+"L";
               if(days.m) selectedDays = selectedDays+"M";
               if(days.x) selectedDays = selectedDays+"X";
               if(days.j) selectedDays = selectedDays+"J";
               if(days.v) selectedDays = selectedDays+"V";
               if(days.s) selectedDays = selectedDays+"S";
               if(days.d) selectedDays = selectedDays+"D";
             }

            $scope.user.daycodes = selectedDays;
            $scope.user.days = selectedDays.split("") ;
            $scope.closeDaysForm();
          }

      }


      $scope.initHours = function(){

          $scope.addHour = function(){

             /*
              var hours = [];
              hours = $scope.user.hours;
              var dd = hours.concat(["fdfd"]);
              */
              var hours = [];
              var dd = hours.concat($scope.user.hours);
              dd.push("15:50");

            //  alert($scope.user.hours);

              $scope.user.hours = dd;

            //  alert($scope.user.hours);

          }

      }


})
