'use strict';

/**
 * @ngdoc function
 * @name HotSNerdApp.controller:RoleFilterCtrl
 * @description
 * # RoleFilterCtrl
 * Controller of the HotSNerdApp
 */

angular.module('HotSNerdApp').controller('RoleFilterCtrl', ['$scope', 'utilities', 'dataManager', function($scope, utilities, dataManager) {

  var roleFilter = this;

  this.toggleRole = function(e) {

    var $target = $(e.target);

    $target.toggleClass("unselected");
    $target.toggleClass("selected");

    var filterRoles = utilities.getRoleFilters();

    dataManager.currentTableData.forEach(function(row) {

      var heroRoles = row["Role"].split("-");

      for (var i = 0; i < heroRoles.length; i++) {

        var role = heroRoles[i];

        if ($.inArray(role, filterRoles) !== -1) {

          row["Visible"] = true;
          break;

        } else {
          row["Visible"] = false;
        }
      }
    });

    dataManager.toggleVarian();
  };

  dataManager.roleFilterDone = true;

  if (dataManager.dataLoaded && dataManager.roleFilterDone && dataManager.tableViewLoaded) {
    $("#scaler").show();
    $("#role_filters").show();
  }
}]);
