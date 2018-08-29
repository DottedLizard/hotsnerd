'use strict';

/**
 * @ngdoc service
 * @name HotSNerdApp.dataManager
 * @description
 * # dataManager
 * Service in HotSNerdApp
 */

angular.module('HotSNerdApp').service('dataManager', ['utilities', function(utilities) {

  this.attrDecimalMap = {
    "DPS": 1,
    "AA_Dmg": 1,
    "AA_Speed": 2,
    "AA_Range": 1,
    "HP": 0,
    "HP_Regen": 2,
    "Mana": 0,
    "Mana_Regen": 2,
    "Spell_Power": 0,
    "Physical_Armor": 0,
    "Spell_Armor": 0,
    "Move_Speed": 2,
    "HP_Scaling": 4,
    "HP_Regen_Scaling": 4,
    "Mana_Scaling": 4,
    "Mana_Regen_Scaling": 4,
    "AA_Dmg_Scaling": 4
  };

  this.headers = [];
  this.currentTableData = [];
  this.priorTableData = [];
  this.scaleLevel = 1;
  this.roleFilterDone = false;
  this.dataLoaded = false;
  this.tableViewLoaded = false;
  var manager = this;

  this.initializeScalingHeaders = function(data) {

    manager.scalingHeaders = data;
    manager.scalingHeaderKeys = utilities.extractKeys(manager.scalingHeaders);
  };

  this.initializeHeaders = function(data) {

    manager.headers = data;
    manager.headerKeys = utilities.extractKeys(manager.headers);
    manager.heroHeader = manager.headers.slice(0, 1);
    manager.heroHeaderKey = utilities.extractKeys(manager.heroHeader);
    manager.attrHeaders = manager.headers.slice(1);
    manager.attrHeaderKeys = utilities.extractKeys(manager.attrHeaders);
  };

  this.initializeTableData = function(currentData, priorData) {

    manager.currentTableData = currentData;
    manager.priorTableData = priorData;
  };

  this.mergeTableData = function() {

    manager.mergedTableData = manager.currentTableData;

    manager.mergedTableData.forEach(function(row) {

      var hero = row["Hero"];
      var newHero = true;

      for (var i = 0; i < manager.priorTableData.length; i++) {

        var priorRow = manager.priorTableData[i];
        var priorHero = priorRow["Hero"];

        if (hero === priorHero) {

          manager.attrHeaderKeys.forEach(function(header) {

            if (row[header] !== "N/A") {

              row[header] = Number(row[header]).toFixed(manager.attrDecimalMap[header]);
              row["Prior_" + header] = Number(priorRow[header]).toFixed(manager.attrDecimalMap[header]);

            } else {
              row["Prior_" + header] = "N/A";
            }
          });

          manager.scalingHeaderKeys.forEach(function(header) {

            if (row[header] !== "N/A") {

              row[header] = Number(row[header]);
              row["Prior_" + header] = Number(priorRow[header]);

            } else {
              row["Prior_" + header] = "N/A";
            }
          });

          newHero = false;
          break;
        }
      }

      if (newHero) {

        manager.attrHeaderKeys.forEach(function(header) {

          if (row[header] !== "N/A") {
            row[header] = Number(row[header]).toFixed(manager.attrDecimalMap[header]);
          }

          row["Prior_" + header] = "N/A";
        });

        manager.scalingHeaderKeys.forEach(function(header) {

          if (row[header] !== "N/A") {
            row[header] = Number(row[header]);
          }

          row["Prior_" + header] = "N/A";
        });
      }
    });
  };

  this.getData = function() {
    return manager.mergedTableData;
  };

  this.toggleVarian = function() {

    var roleFilters = utilities.getRoleFilters();
    var names = [];
    var row;

    if (($.inArray("warrior", roleFilters) === -1) && ($.inArray("assassin", roleFilters) === -1)) {
      return;
    }

    if (manager.scaleLevel >= 4) {

      names = [
        {
          "Name": "Varian",
          "Visible": false
        },
        {
          "Name": "Varian (Colossus Smash)",
          "Visible": true
        },
        {
          "Name": "Varian (Taunt)",
          "Visible": true
        },
        {
          "Name": "Varian (Twin Blades)",
          "Visible": true
        }
      ];

    } else {

      names = [
        {
          "Name": "Varian",
          "Visible": true
        },
        {
          "Name": "Varian (Colossus Smash)",
          "Visible": false
        },
        {
          "Name": "Varian (Taunt)",
          "Visible": false
        },
        {
          "Name": "Varian (Twin Blades)",
          "Visible": false
        }
      ];
    }

    names.forEach(function(item) {

      var obj = {};
      obj[manager.heroHeaderKey] = item["Name"];

      row = utilities.where(manager.currentTableData, obj);

      if (row.length) {
        row[0]["Visible"] = item["Visible"];
      }
    });
  };

  this.reSort = function() {

    var $faAsc = $("i.fa-sort-asc").filter(":visible");
    var $faDesc = $("i.fa-sort-desc").filter(":visible");
    var sortAttr;

    if ($faAsc.length > 0) {

      sortAttr = $($faAsc[0]).parent().attr("data-sort");
      utilities.sortAsc(manager.currentTableData, sortAttr);
    }

    if ($faDesc.length > 0) {

      sortAttr = $($faDesc[0]).parent().attr("data-sort");
      utilities.sortDesc(manager.currentTableData, sortAttr);
    }
  };
}]);
