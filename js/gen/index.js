(function() {
  var Donut, Sphere, patternVM;

  Donut = (function() {

    function Donut() {
      this.rows = ko.observable(25);
      this.innerStitches = ko.observable(12);
      this.snap = ko.observable(true);
      this.instructions = ko.computed({
        read: function() {
          var counts, i, inst, _len, _ref, _results;
          counts = Crocad.torus(this.innerStitches(), this.rows());
          if (this.snap()) {
            counts = Crocad.roundToNearest(counts, 6, this.innerStitches());
          }
          _ref = Crocad.rows(counts);
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            inst = _ref[i];
            _results.push({
              num: i + 1,
              instructions: inst
            });
          }
          return _results;
        },
        owner: this
      });
    }

    return Donut;

  })();

  Sphere = (function() {

    function Sphere() {
      this.rows = ko.observable(14);
      this.snap = ko.observable(true);
      this.instructions = ko.computed({
        read: function() {
          var counts, i, inst, _len, _ref, _results;
          counts = Crocad.sphere(this.rows());
          if (this.snap()) counts = Crocad.roundToNearest(counts, 6, 6);
          _ref = Crocad.rows(counts);
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            inst = _ref[i];
            _results.push({
              num: i + 1,
              instructions: inst
            });
          }
          return _results;
        },
        owner: this
      });
    }

    return Sphere;

  })();

  patternVM = {
    donut: new Donut(),
    sphere: new Sphere(),
    toString: function() {
      return "PatternVM";
    }
  };

  this.patternVM = patternVM;

  $(function() {
    ko.applyBindings(patternVM);
    return $('.nav-tabs a:first').tab('show');
  });

}).call(this);
