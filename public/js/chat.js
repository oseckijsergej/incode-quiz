angular.module('chatApp', ['ui.bootstrap', 'ui.select', 'ngSelectable'])
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    })
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }).controller('ModalInstanceCtrl', function ($scope, socket, $uibModalInstance, accounts) {
        $scope.accounts = {};
        $scope.all = accounts;
        $scope.accounts.selected;

        $scope.ok = function () {
            $uibModalInstance.close($scope.accounts.selected);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('ChatCtrl', function ($scope, socket, $uibModal, $log) {

        var account;

        $scope.messages = [];

        $scope.accounts = [];

        $scope.rooms = [];

        $scope.activeRoom;

        $scope.acitveRoomAccounts;

        $scope.open = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'accountsModal',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    accounts: function () {
                        return $scope.accounts;
                    }
                }
            });

            modalInstance.result.then(function (selectedAccounts) {
                roomCreate(selectedAccounts);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        socket.on('init', function (data) {
            account = data.account;
            $scope.accounts = data.accounts;
            $scope.rooms = data.rooms.map(function (room) {
                if (room.name === '') {

                    room.name = $scope.accounts.filter(function (member) {
                        if(room.members[    0] !== account._id){
                            return room.members[0] === member._id;
                        } else {
                            return room.members[1] === member._id;
                        }
                    })[0].login;
                }
                return room;
            });
        });

        socket.on('room:created', function (chatRoom) {
            if (chatRoom.name === '') {
                chatRoom.name = $scope.accounts.filter(function (member) {
                    return chatRoom.members[1] === member._id;
                })[0].login;
            }
            $scope.rooms.push(chatRoom);
        });

        socket.on('message:send', function (message) {
            $scope.messages.push(message);
        });

        socket.on('account:join', function (account) {
            $scope.accounts.push(account);
        });

        // Методы
        $scope.sendMessage = function () {
            socket.emit('message:create', {
                    room: $scope.activeRoom,
                    message: $scope.message
                }, function (message) {
                    // add the message to our model locally
                    $scope.messages.push(message);

                    // clear message box
                    $scope.message = '';
                });


        };

        $scope.$watch('activeRoom', function (activeRoom, lastActiveRoom) {
            if (typeof activeRoom === 'undefined') return;
            $scope.activeRoomAccounts = activeRoom.members.map(function (member) {
                return $scope.accounts.filter(function (item) {
                    return item._id === member;
                })[0];
            });
            socket.emit("message:get", activeRoom._id, function (messages) {
                $scope.messages = messages;
            });
        });

        var roomCreate = function (selectedAccounts) {

            var name = [account.login];
            var params = {
                name: '',
                members: [account._id]
            };

            selectedAccounts.forEach(function (item) {
                params.members.push(item._id);
                name.push(item.login);
            });

            // Если в комнате больше двух - это групповой чат.
            // Если двое - приватный.
            if (name.length > 2) {
                params.name = name.join(', ', name);
            }

            socket.emit('room:create', params, function (room) {

            });
        };

        $scope.roomSelected = function (selected) {
            $scope.activeRoom = selected[0];
        }

    });