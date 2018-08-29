'use strict';

/**
 * @ngdoc function
 * @name HotSNerdApp.controller:AttrTableCtrl
 * @description
 * # AttrTableCtrl
 * Controller of the HotSNerdApp
 */

angular.module('HotSNerdApp').controller('AttrTableCtrl', ['$scope', '$timeout', 'utilities', 'dataManager', function($scope, $timeout, utilities, dataManager) {

  var attrTable = this;
  this.sfgt = utilities.sfgt;

  this.sortTable = function(e) {

    e.preventDefault();

    var $target = $(e.target);

    if ($target.hasClass("fa")) {
      $target = $target.parent();
    }

    var $faSort = $target.find("i").filter(":visible");
    var sortType = $faSort.attr("class").split(" ")[1];
    var sortAttr = $target.attr("data-sort");

    $faSort.hide();

    if (sortType === "fa-sort") {

      utilities.resetSort();
      $faSort.hide();

      $target.find("i").filter(".fa-sort-desc").show();
      utilities.sortDesc(dataManager.currentTableData, sortAttr);

    } else if (sortType === "fa-sort-desc") {

      $target.find("i").filter(".fa-sort-asc").show();
      utilities.sortAsc(dataManager.currentTableData, sortAttr);

    } else if (sortType === "fa-sort-asc") {

      $target.find("i").filter(".fa-sort-desc").show();
      utilities.sortDesc(dataManager.currentTableData, sortAttr);
    }
  };

  $.get('/javascript/json/headers.json').then(function(data) {

    dataManager.initializeHeaders(data);

    attrTable.headerKeys = dataManager.headerKeys;
    attrTable.heroHeader = dataManager.heroHeader;
    attrTable.heroHeaderKey = dataManager.heroHeaderKey;
    attrTable.attrHeaders = dataManager.attrHeaders;
    attrTable.attrHeaderKeys = dataManager.attrHeaderKeys;

  }).then(function() {

    $.get('/javascript/json/current_data.json').then(function(currentData) {

      $.get('/javascript/json/prior_data.json').then(function(priorData) {

        utilities.formatData(currentData, dataManager.heroHeaderKey, dataManager.attrHeaderKeys, dataManager.attrDecimalMap);
        utilities.formatData(priorData, dataManager.heroHeaderKey, dataManager.attrHeaderKeys, dataManager.attrDecimalMap);

        dataManager.initializeTableData(currentData, priorData);
        dataManager.mergeTableData();

        attrTable.getData = dataManager.getData;

        attrTable.currentPatch = dataManager.currentTableData[0]["Patch"];
        attrTable.priorPatch = dataManager.priorTableData[0]["Patch"];

        dataManager.toggleVarian();
        $scope.$apply();
        
        dataManager.dataLoaded = true;

        if (dataManager.dataLoaded && dataManager.roleFilterDone && dataManager.tableViewLoaded) {
          $("#scaler").show();
          $("#role_filters").show();
        }
      });
    });
  });

  $scope.$watch('$viewContentLoaded', function() {

    dataManager.tableViewLoaded = true;

    if (dataManager.dataLoaded && dataManager.roleFilterDone) {
      $("#scaler").show();
      $("#role_filters").show();
    }
  });
}]);
