
/* Controllers */

netStatsApp.controller('StatsCtrl', function($scope, $filter, $localStorage, socket, _, toastr) {

	var MAX_BINS = 40;

	// Main Stats init
	// ---------------
	$scope.reports = [];

	$scope.predicate = $localStorage.predicate || ['-createdAt'];
	$scope.reverse = $localStorage.reverse || false;

	$scope.originalPredicate = ['-createdAt'];

	$scope.orderTable = function(predicate, reverse)
	{
		if(!_.isEqual(predicate, $scope.originalPredicate))
		{
			$scope.reverse = reverse;
			$scope.originalPredicate = predicate;
			$scope.predicate = $scope.originalPredicate;
		}
		else
		{
			$scope.reverse = !$scope.reverse;

			if($scope.reverse === true){
				_.forEach(predicate, function (value, key) {
					predicate[key] = (value[0] === '-' ? value.replace('-', '') : '-' + value);
				});
			}

			$scope.predicate = predicate;
		}

		$localStorage.predicate = $scope.predicate;
		$localStorage.reverse = $scope.reverse;
	}

	// Socket listeners
	// ----------------

	socket.on('open', function open() {
		socket.emit('ready');
		console.log('The connection has been opened.');
	})
	.on('end', function end() {
		console.log('Socket connection ended.')
	})
	.on('error', function error(err) {
		console.log(err);
	})
	.on('reconnecting', function reconnecting(opts) {
		console.log('We are scheduling a reconnect operation', opts);
	})
	.on('data', function incoming(data) {
		$scope.$apply(socketAction(data.action, data.data));
	})
	.on('init', function(data)
	{
		$scope.$apply(socketAction("init", data.reports));
	});

	function socketAction(action, data)
	{
		// console.log('Action: ', action);
		// console.log('Data: ', data);

		switch(action)
		{
			case "init":
				$scope.reports = data;

				if( $scope.reports.length > 0 )
					toastr['success']("Got report list", "Got reports!");

				break;

			case "add":
				$scope.reports.push(data);
				toastr['success']("Report for block "+ data.block +" received!", "New report!");

				break;
		}
	}
});