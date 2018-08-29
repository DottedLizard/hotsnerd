'use strict';

/**
 * @ngdoc function
 * @name HotSNerdApp.controller:ScalerCtrl
 * @description
 * # ScalerCtrl
 * Controller of the HotSNerdApp
 */

angular.module('HotSNerdApp').controller('ScalerCtrl', ['$scope', 'utilities', 'dataManager', function($scope, utilities, dataManager) {

  var scaler = this;
  $scope.levels = [];
  this.currentLevel = 1;

  for (var i = 1; i < 31; i++) {
    $scope.levels.push({ "id": i, "name": "Hero Level " + i });
  }

  $scope.levelSelection = $scope.levels[0];

  function isManaAttr(attr) {
    return (attr === "Mana_Scaling") || (attr === "Mana_Regen_Scaling");
  }

  this.scaleAttrTable = function() {

    var $tableWatchers = angular.element($("#table")[0]).scope().$$watchers;

    if ($tableWatchers.length === 0) {
      return;
    }

    var level = $scope.levelSelection.id;
    var delta = level - scaler.currentLevel;
    var factor = 1;
    var priorFactor = 1;
    var scale = 0;
    var priorScale = 0;
    var attr = "";

    dataManager.mergedTableData.forEach(function(row) {

      scaler.headerKeys.forEach(function(header) {

        scale = row[header];
        priorScale = row["Prior_" + header];

        if (isManaAttr(header)) {

          factor = delta * Number(scale);
          priorFactor = delta * Number(priorScale);

        } else {

          factor = Math.pow((1 + Number(scale)), delta);
          priorFactor = Math.pow((1 + Number(priorScale)), delta);
        }

        attr = header.replace("_Scaling", "");

        if (row[attr] !== "N/A") {

          if (isManaAttr(header)) {
            row[attr] = (Number(row[attr]) + factor).toFixed(dataManager.attrDecimalMap[attr]);
          } else {
            row[attr] = (Number(row[attr]) * factor).toFixed(dataManager.attrDecimalMap[attr]);
          }
        }

        if (row["Prior_" + attr] !== "N/A") {

          if (isManaAttr(header)) {
            row["Prior_" + attr] = (Number(row["Prior_" + attr]) + priorFactor).toFixed(dataManager.attrDecimalMap[attr]);
          } else {
            row["Prior_" + attr] = (Number(row["Prior_" + attr]) * priorFactor).toFixed(dataManager.attrDecimalMap[attr]);
          }
        }
      });

      if (row["AA_Dmg"] !== "N/A") {
        row["DPS"] = (row["AA_Dmg"] * row["AA_Speed"]).toFixed(dataManager.attrDecimalMap["DPS"]);
      }

      if (row["Prior_AA_Dmg"] !== "N/A") {
        row["Prior_DPS"] = (row["Prior_AA_Dmg"] * row["Prior_AA_Speed"]).toFixed(dataManager.attrDecimalMap["DPS"]);
      }
    });

    scaler.currentLevel = level;
    dataManager.scaleLevel = level;

    dataManager.toggleVarian();
    dataManager.reSort();
  };

  $.get('/javascript/json/scaling_headers.json').then(function(data) {

    dataManager.initializeScalingHeaders(data);

    scaler.headerKeys = dataManager.scalingHeaderKeys;
  });
}]);
