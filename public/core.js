var nodeTodo = angular.module("nodeTodo", []);
function mainController($scope, $http) {
  $scope.formData = {};
  $scope.todos = [];
  $scope.cos = "";

  // when landing on the page, get all todos and show them
  $http
    .get("/api/todos")
    .success(function (data) {
      $scope.todos = data;
    })
    .error(function (data) {
      console.log("Error: " + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function () {
    $http
      .post("/api/todos", $scope.formData)
      .success(function (data) {
        document.getElementById("newTodo").value = "";
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // update a todo after checking it
  $scope.updateTodo = function (id) {
    var todo = $scope.todos.find(function (item) {
      return item._id === id;
    });

    if (todo) {
      todo.done = !todo.done;

      $http
        .put("/api/todos/" + id, { done: todo.done })
        .success(function (data) {
          $scope.todos = data;
        })
        .error(function (data) {
          console.log("Error: " + data);
        });
    }
  };

  $scope.getActiveTodos = function () {
    return $scope.todos.filter(function (todo) {
      return !todo.done;
    });
  };

  $scope.getCompletedTodos = function () {
    return $scope.todos.filter(function (todo) {
      return todo.done;
    });
  };

  // delete a todo after checking it
  $scope.deleteTodo = function (id) {
    $http
      .delete("/api/todos/" + id)
      .success(function (data) {
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };
}
