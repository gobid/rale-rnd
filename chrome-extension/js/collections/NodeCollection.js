/*
- relevant documentation: https://backbonejs.org/ (reduce, map)
- this.reduce - boils down a list into a single value 
  - this is the list (object oriented style)
  - iteree is the function(memo, nodeModel)
  - [memo]=[] (the initial state of the reduction)
  - [context] ?
  - each successive step (state) of it (memo) should be returned by iteree
  - iteree is passed (1) the memo and (2) the value and index (or key) of the iteration (3) a ref to the entire list (?)
- get the active nodes of a NodeModel (hits > 0)
- or get it as an array
  - list = this.getActiveNodes()
  - iteratee = the function(nodeModel)
  - [context] ? 
  - Produces a new array of values by mapping each value in list through a transformation function (iteratee). 
  - so in this case each member is the JSON version of the old list's member
  - here the iteree is passed the value nodeModel
*/

define([
  "backbone",
  "underscore",
  "../models/NodeModel"
], function (Backbone, _, NodeModel) {
  return Backbone.Collection.extend({
    model: NodeModel,

    idAttribute: "id",

    getActiveNodes: function () {
      return this.reduce(function (memo, nodeModel) {
        var id = nodeModel.get("id");
        if (id && id.split("-").length > 5 && nodeModel.get("hits") > 0) {
          memo.push(nodeModel);
        }

        return memo;
      }, []);
    },

    getActiveNodeArr: function () {
      return _(this.getActiveNodes()).map(function (nodeModel) {
        return nodeModel.toJSON();
      });
    },


  });
});