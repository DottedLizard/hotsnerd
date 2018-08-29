'use strict';

/**
 * @ngdoc function
 * @name HotSNerdApp.controller:PatchCtrl
 * @description
 * # PatchCtrl
 * Controller of the HotSNerdApp
 */

angular.module('HotSNerdApp').controller('PatchCtrl', ['utilities', 'dataManager', function(utilities, dataManager) {

  var patch = this;

  this.initialize = function() {

    patch.current = dataManager.currentTableData[0]["Patch"];
    patch.prior = dataManager.priorTableData[0]["Patch"];
  };
}]);
