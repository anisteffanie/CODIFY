angular.module('Perl.studentDashboard', ['ngMaterial', 'ngMdIcons', 'firebase', 'ngMessages', 'material.svgAssetsCache'])

.controller('studentDashboard',function($mdMedia, $mdDialog, $scope, $state, $rootScope, studentFactory, authFactory, tutorFactory){

  $scope.invitedTutors = [];
  $scope.acceptedTutors = [];
  $scope.tutorHistory = [];
  $scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));

  // Chat popup Modal
  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

    $mdDialog.show({
      controller: 'chat',
      templateUrl: '../session/chat.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });

  };


  $scope.getAllStatusTutors = function() {
  	studentFactory.getAllStatusTutors($scope.userinfo.id)
  	.then(function(data){
      for(var i = 0; i < data.data.length; i++) {
        if(data.data[i].status == 1) {
          $scope.invitedTutors.push(data.data[i]);
        } else if(data.data[i].status == 2) {
          $scope.acceptedTutors.push(data.data[i]);
        } else {
          $scope.tutorHistory.push(data.data[i]);
        }
      }
  	})
  }

  $scope.findTutors = function() {
  	$state.go('tutorFilter');
  }

  $scope.viewProfile = function(id) {
  	$state.go('/tutorProfile/:id')
  }

  $scope.cancelInvitation = function(id) {
  	//make cancel in services
  	studentFactory.cancelInvitation($scope.userinfo.id, id);

  	$state.reload();
  }


  $scope.cancelSession = function(id) {
    studentFactory.cancelSession($scope.userinfo.id, id);

    $state.reload();
  }

  $scope.getTutorId = function(tid) {
    studentFactory.getTutorId(tid);
  }

  $scope.showChat = function(id) {
    $state.go('chat');
  }

  $scope.addFavorite = function(tid) {
    tutorFactory.addFavorite($scope.userinfo.id, tid);
  }

  $scope.deleteFavorite = function(tid) {
    tutorFactory.deleteFavorite($scope.userinfo.id, tid);
  }

  $scope.getAllStatusTutors();
})
