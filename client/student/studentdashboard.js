angular.module('Perl.studentDashboard', ['ngMaterial', 'ngMdIcons'])

.controller('studentDashboard',function($mdMedia, $scope, $state, studentFactory, authFactory){
	$scope.invitedTutors;
  $scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));

  console.log('userinfo', $scope.userinfo);

  $scope.getInvitedTutors = function() {
  	console.log('inside get Tutorinfo id', $scope.userinfo.id);
  	studentFactory.getInvitedTutors($scope.userinfo.id)
  	.then(function(data){
  		console.log('tutors', data.data)
  		$scope.invitedTutors = data.data;
  		//need to send null instead of "no invited tutor" when there is no tutor.
  		// $scope.tutors = null;
  	})
  }

  $scope.getAcceptedTutors = function() {
  	studentFactory.getAcceptedTutors($scope.userinfo.id)
  	.then(function(data){
  		$scope.acceptedTutors = data.data;
  	})
  }

  $scope.findTutors = function() {
  	$state.go('tutorFilter')
  }

  $scope.viewProfile = function(id) {
  	$state.go('/tutorProfile/:id')
  }


  $scope.getInvitedTutors();
  $scope.getAcceptedTutors();

})