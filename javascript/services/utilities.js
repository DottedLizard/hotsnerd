'use strict';

/**
 * @ngdoc service
 * @name HotSNerdApp.utilities
 * @description
 * # utilities
 * Service in HotSNerdApp
 */

angular.module('HotSNerdApp').service('utilities', function() {

  var utilities = this;

  this.filterKeys = function(data, keys) {

    var result = [];
    var tmpDict = {};

    data.forEach(function(item) {

      tmpDict = {};

      keys.forEach(function(key) {
        tmpDict[key] = item[key];
      });

      result.push(tmpDict);
    });

    return result;
  }

  this.extractKeys = function(data) {

    var result = [];

    data.forEach(function(item) {
      result.push(Object.keys(item)[0]);
    });

    return result;
  }

  this.where = function(list, properties) {

    var newArr = [];

    for (var i = 0; i < list.length; i++) {

      var match = true;
      var item = list[i];

      for (var prop in properties) {

        if ((!item.hasOwnProperty(prop)) || (item[prop] !== properties[prop])) {

          match = false;
          break;
        }
      }

      if (match) {
        newArr.push(item);
      }
    }

    return newArr;
  };

  this.formatData = function(data, heroHeader, headers, map) {

    data.forEach(function(row) {

      row[heroHeader] = row[heroHeader].replace("!", "'");

      headers.forEach(function(header) {

        if (row[header] !== "N/A") {

          if (header === "HP_Regen") {
            row[header] = utilities.convertToPercent(row[header], row["HP"], map, header);
          } else if (header === "Mana_Regen") {
            row[header] = utilities.convertToPercent(row[header], row["Mana"], map, header);
          } else {
            row[header] = Number(row[header]).toFixed(map[header]);
          }
        }
      });

      row["Visible"] = true;
    });
  };

  this.convertToPercent = function(numerator, denominator, map, header) {
    return ((Number(numerator) / Number(denominator)) * 100).toFixed(map[header]);
  }

  this.getRoleFilters = function() {

    var filterRoles = [];
    var $selected = $("div#role_filters").find("div").filter(".selected");

    if ($selected.length !== 0) {

      $selected.each(function(idx, item) {
        filterRoles.push($(item).attr("data-role"));
      });

    } else {
      filterRoles = ["warrior", "assassin", "support", "specialist"];
    }

    return filterRoles;
  };

  this.resetSort = function() {

    $(".sort").find("i").filter(".fa-sort-desc, .fa-sort-asc").hide();
    $(".sort").find("i").filter(".fa-sort").show();
  }

  this.sortAsc = function(data, sortAttr) {

    data.sort(function(a, b) {

      var aVal = a[sortAttr];
      var bVal = b[sortAttr];
      var aHero = a["Hero"];
      var bHero = b["Hero"];


      if (aVal === bVal) {

        if (aHero > bHero) {
          return 1;
        }

        return -1;

      } else {

        if (aVal === "N/A") {
          return 1;
        }

        if (bVal === "N/A") {
          return -1;
        }

        if (sortAttr === "Hero") {

          if (aVal > bVal) {
            return -1;
          }

          return 1;
        }

        return aVal - bVal;
      }
    });
  }

  this.sortDesc = function(data, sortAttr) {

    data.sort(function(a, b) {

      var aVal = a[sortAttr];
      var bVal = b[sortAttr];
      var aHero = a["Hero"];
      var bHero = b["Hero"];

      if (aVal === bVal) {

        if (aHero > bHero) {
          return 1;
        }

        return -1;

      } else {

        if (aVal === "N/A") {
          return 1;
        }

        if (bVal === "N/A") {
          return -1;
        }

        if (sortAttr === "Hero") {

          if (aVal > bVal) {
            return 1;
          }

          return -1;
        }

        return bVal - aVal;
      }
    });
  }

  this.sfgt = function(val1, val2) {
    return Number.parseFloat(val1) > Number.parseFloat(val2);
  };
});
