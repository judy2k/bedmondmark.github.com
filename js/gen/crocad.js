(function() {
  var Crocad,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Crocad = (function() {

    function Crocad() {}

    Crocad.sum = function(items) {
      var i, result, _i, _len;
      result = 0;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        result += i;
      }
      return result;
    };

    Crocad.divmod = function(x, y) {
      return [Math.floor(x / y), x % y];
    };

    Crocad.gcd = function(num1, num2) {
      var _ref;
      while (num2 !== 0) {
        _ref = [num2, num1 % num2], num1 = _ref[0], num2 = _ref[1];
      }
      return num1;
    };

    Crocad.roundToNearest = function(val, nearest, min_val) {
      var v, _i, _len, _results;
      if (min_val == null) min_val = 0;
      if (typeof val === "number") {
        val = (Math.floor(val / nearest) + Math.round((val % nearest) / nearest)) * nearest;
        return Math.max(min_val, val);
      } else {
        _results = [];
        for (_i = 0, _len = val.length; _i < _len; _i++) {
          v = val[_i];
          _results.push(Crocad.roundToNearest(v, nearest, min_val));
        }
        return _results;
      }
    };

    Crocad.rows = function(counts) {
      var index, result, _ref;
      result = [];
      for (index = 0, _ref = counts.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
        result.push(Crocad.row(index === 0 ? null : counts[index - 1], counts[index]));
      }
      return result;
    };

    Crocad.row = function(prev, count) {
      var abs, diff, divmod, floor, i, part_count, rep, repeats, result, row_rem, sc_rem, scs, stcount, _ref, _ref2;
      prev = typeof prev === "number" ? Math.round(prev) : null;
      count = typeof count === "number" ? Math.round(count) : null;
      result = new Crocad.InstructionGroup();
      if (prev === null) {
        result.append(new Crocad.Instruction(count, 'ch'));
      } else {
        abs = Math.abs;
        floor = Math.floor;
        divmod = Crocad.divmod;
        diff = count - prev;
        if (diff === 0) {
          result.append(new Crocad.Instruction(count));
        } else {
          repeats = Crocad.gcd(count, prev);
          row_rem = 0;
          if (repeats === 1) repeats = abs(diff);
          prev = floor(prev / repeats);
          _ref = divmod(count, repeats), count = _ref[0], row_rem = _ref[1];
          diff = count - prev;
          scs = Math.min(prev, count) - abs(diff);
          _ref2 = divmod(scs, abs(diff)), stcount = _ref2[0], sc_rem = _ref2[1];
          if (repeats > 1) {
            rep = new Crocad.InstructionGroup();
            rep.repeats = repeats;
            result.append(rep);
          } else {
            rep = result;
          }
          part_count = floor(abs(diff));
          for (i = 0; 0 <= part_count ? i < part_count : i > part_count; 0 <= part_count ? i++ : i--) {
            rep.append(diff > 0 ? new Crocad.MultipleStitches() : new Crocad.StitchTogether());
            if (i < abs(diff) - 1) {
              if (stcount > 0) rep.append(new Crocad.Instruction(stcount));
            } else {
              if ((stcount + sc_rem) > 0) {
                rep.append(new Crocad.Instruction(stcount + sc_rem));
              }
            }
          }
          if (row_rem > 0) result.append(new Crocad.Instruction(row_rem));
        }
      }
      return result;
    };

    Crocad.sphere = function(rows) {
      var rad, result, row, row_angle, row_rad;
      rows = parseInt(rows);
      rad = (rows + 1) / Math.PI;
      row_angle = Math.PI / (rows + 1);
      result = [];
      for (row = 0; 0 <= rows ? row < rows : row > rows; 0 <= rows ? row++ : row--) {
        row_rad = rad * Math.sin((row + 1) * row_angle);
        result.push(Math.round(2 * Math.PI * row_rad));
      }
      return result;
    };

    Crocad.torus = function(init_stitches, rows, initial_angle) {
      var circ, hole_rad, rad, result, row, row_angle, xrad;
      if (initial_angle == null) initial_angle = 0;
      init_stitches = parseInt(init_stitches);
      rows = parseInt(rows);
      initial_angle = parseInt(initial_angle);
      hole_rad = init_stitches / (2 * Math.PI);
      xrad = rows / (2 * Math.PI);
      row_angle = 2 * Math.PI / rows;
      result = [];
      for (row = 0; 0 <= rows ? row < rows : row > rows; 0 <= rows ? row++ : row--) {
        rad = hole_rad + (xrad - (xrad * Math.cos(row * row_angle + initial_angle)));
        circ = rad * 2 * Math.PI;
        result.push(Math.round(circ));
      }
      return result;
    };

    Crocad.prototype.toString = function() {
      return "Crocad instance";
    };

    return Crocad;

  })();

  Crocad.Instruction = (function() {

    function Instruction(_multiple, _stitchType) {
      this._multiple = _multiple != null ? _multiple : 1;
      this._stitchType = _stitchType != null ? _stitchType : 'sc';
    }

    Instruction.prototype.merge = function(ob) {
      if (ob.constructor === this.constructor && ob._stitchType === this._stitchType) {
        return this._merge(ob) !== false;
      } else {
        return false;
      }
    };

    Instruction.prototype._merge = function(ob) {
      return this._multiple += ob._multiple;
    };

    Instruction.prototype.stitches = function() {
      return this._multiple;
    };

    Instruction.prototype.stitchesInto = Instruction.prototype.stitches;

    Instruction.prototype.toString = function() {
      if (this._multiple > 1) {
        return "" + this._multiple + this._stitchType;
      } else {
        return this._stitchType.toString();
      }
    };

    return Instruction;

  })();

  Crocad.StitchTogether = (function(_super) {

    __extends(StitchTogether, _super);

    function StitchTogether(_multiple, _togetherCount, _stitchType) {
      this._multiple = _multiple != null ? _multiple : 1;
      this._togetherCount = _togetherCount != null ? _togetherCount : 2;
      this._stitchType = _stitchType != null ? _stitchType : 'sc';
    }

    StitchTogether.prototype._merge = function(ob) {
      if (ob._togetherCount === this._togetherCount) {
        return this._multiple += ob._multiple;
      } else {
        return false;
      }
    };

    StitchTogether.prototype.stitchesInto = function() {
      return this._multiple * this._togetherCount;
    };

    StitchTogether.prototype.toString = function() {
      var inst;
      inst = "" + this._stitchType + this._togetherCount + "tog";
      if (this._multiple > 1) inst += " in next " + this._multiple;
      return inst;
    };

    return StitchTogether;

  })(Crocad.Instruction);

  Crocad.MultipleStitches = (function(_super) {

    __extends(MultipleStitches, _super);

    function MultipleStitches(_multiple, _stitchesInto, _stitchType) {
      this._multiple = _multiple != null ? _multiple : 1;
      this._stitchesInto = _stitchesInto != null ? _stitchesInto : 2;
      this._stitchType = _stitchType != null ? _stitchType : 'sc';
    }

    MultipleStitches.prototype._merge = function(ob) {
      if (ob._stitchesInto === this._stitchesInto) {
        return this._multiple += ob._multiple;
      } else {
        return false;
      }
    };

    MultipleStitches.prototype.stitches = function() {
      return this._multiple * this._stitchesInto;
    };

    MultipleStitches.prototype.stitchesInto = function() {
      return this._multiple;
    };

    MultipleStitches.prototype.toString = function() {
      var inst;
      inst = "" + this._stitchesInto + this._stitchType;
      if (this._multiple === 1) {
        inst += " into stitch";
      } else {
        inst += " into next " + this._multiple + " stitches";
      }
      return inst;
    };

    return MultipleStitches;

  })(Crocad.Instruction);

  Crocad.InstructionGroup = (function(_super) {

    __extends(InstructionGroup, _super);

    function InstructionGroup(_instructions, repeats) {
      this.repeats = repeats != null ? repeats : 1;
      this._instructions = _instructions ? _instructions : [];
    }

    InstructionGroup.prototype._merge = function(ob) {
      return false;
    };

    InstructionGroup.prototype.append = function(instruction) {
      var last;
      last = this._instructions[this._instructions.length - 1];
      if (last !== void 0 && last.merge(instruction)) {} else {
        return this._instructions.push(instruction);
      }
    };

    InstructionGroup.prototype.stitches = function() {
      var x;
      return Crocad.sum((function() {
        var _i, _len, _ref, _results;
        _ref = this._instructions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x.stitches());
        }
        return _results;
      }).call(this)) * this.repeats;
    };

    InstructionGroup.prototype.stitchesInto = function() {
      var x;
      return Crocad.sum((function() {
        var _i, _len, _ref, _results;
        _ref = this._instructions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x.stitchesInto());
        }
        return _results;
      }).call(this)) * this.repeats;
    };

    InstructionGroup.prototype.toString = function() {
      var x;
      if (this.repeats === 1) {
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = this._instructions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push(x.toString());
          }
          return _results;
        }).call(this)).join(', ');
      } else {
        return '[' + ((function() {
          var _i, _len, _ref, _results;
          _ref = this._instructions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push(x.toString());
          }
          return _results;
        }).call(this)).join(', ') + (". Repeat " + this.repeats + " times.]");
      }
    };

    return InstructionGroup;

  })(Crocad.Instruction);

  this.Crocad = Crocad;

}).call(this);
