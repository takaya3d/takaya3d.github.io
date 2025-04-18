// Generated by CoffeeScript 1.6.3
(function() {
	var BACK, COPLANAR, EPSILON, FRONT, SPANNING, returning,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  __slice = [].slice,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
	EPSILON = 1e-5;
  
	COPLANAR = 0;
  
	FRONT = 1;
  
	BACK = 2;
  
	SPANNING = 3;
  
	returning = function(value, fn) {
	  fn();
	  return value;
	};
  
	window.ThreeBSP = (function() {
	  function ThreeBSP(treeIsh, matrix) {
		this.matrix = matrix;
		this.intersect = __bind(this.intersect, this);
		this.union = __bind(this.union, this);
		this.subtract = __bind(this.subtract, this);
		this.toGeometry = __bind(this.toGeometry, this);
		this.toMesh = __bind(this.toMesh, this);
		this.toTree = __bind(this.toTree, this);
		if (this.matrix == null) {
		  this.matrix = new THREE.Matrix4();
		}
		this.tree = this.toTree(treeIsh);
	  }
  
	  ThreeBSP.prototype.toTree = function(treeIsh) {
		var face, geometry, i, polygons, _fn, _i, _len, _ref,
		  _this = this;
		if (treeIsh instanceof ThreeBSP.Node) {
		  return treeIsh;
		}
		polygons = [];
		geometry = treeIsh instanceof THREE.Geometry ? treeIsh : treeIsh instanceof THREE.Mesh ? (treeIsh.updateMatrix(), this.matrix = treeIsh.matrix.clone(), treeIsh.geometry) : void 0;
		_ref = geometry.faces;
		_fn = function(face, i) {
		  var faceVertexUvs, idx, polygon, vIndex, vName, vertex, _j, _len1, _ref1, _ref2;
		  faceVertexUvs = (_ref1 = geometry.faceVertexUvs) != null ? _ref1[0][i] : void 0;
		  if (faceVertexUvs == null) {
			faceVertexUvs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
		  }
		  polygon = new ThreeBSP.Polygon();
		  _ref2 = ['a', 'b', 'c', 'd'];
		  for (vIndex = _j = 0, _len1 = _ref2.length; _j < _len1; vIndex = ++_j) {
			vName = _ref2[vIndex];
			if ((idx = face[vName]) != null) {
			  vertex = geometry.vertices[idx];
			  vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], new THREE.Vector2(faceVertexUvs[vIndex].x, faceVertexUvs[vIndex].y));
			  vertex.applyMatrix4(_this.matrix);
			  polygon.vertices.push(vertex);
			}
		  }
		  return polygons.push(polygon.calculateProperties());
		};
		for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
		  face = _ref[i];
		  _fn(face, i);
		}
		return new ThreeBSP.Node(polygons);
	  };
  
	  ThreeBSP.prototype.toMesh = function(material) {
		var geometry, mesh,
		  _this = this;
		if (material == null) {
		  material = new THREE.MeshNormalMaterial();
		}
		geometry = this.toGeometry();
		return returning((mesh = new THREE.Mesh(geometry, material)), function() {
		  mesh.position.getPositionFromMatrix(_this.matrix);
		  return mesh.rotation.setFromRotationMatrix(_this.matrix);
		});
	  };
  
	  ThreeBSP.prototype.toGeometry = function() {
		var geometry, matrix,
		  _this = this;
		matrix = new THREE.Matrix4().getInverse(this.matrix);
		return returning((geometry = new THREE.Geometry()), function() {
		  var face, idx, polyVerts, polygon, v, vertUvs, verts, _i, _len, _ref, _results;
		  _ref = _this.tree.allPolygons();
		  _results = [];
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			polygon = _ref[_i];
			polyVerts = (function() {
			  var _j, _len1, _ref1, _results1;
			  _ref1 = polygon.vertices;
			  _results1 = [];
			  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
				v = _ref1[_j];
				_results1.push(v.clone().applyMatrix4(matrix));
			  }
			  return _results1;
			})();
			_results.push((function() {
			  var _j, _ref1, _results1;
			  _results1 = [];
			  for (idx = _j = 2, _ref1 = polyVerts.length; 2 <= _ref1 ? _j < _ref1 : _j > _ref1; idx = 2 <= _ref1 ? ++_j : --_j) {
				verts = [polyVerts[0], polyVerts[idx - 1], polyVerts[idx]];
				vertUvs = (function() {
				  var _k, _len1, _ref2, _ref3, _results2;
				  _results2 = [];
				  for (_k = 0, _len1 = verts.length; _k < _len1; _k++) {
					v = verts[_k];
					_results2.push(new THREE.Vector2((_ref2 = v.uv) != null ? _ref2.x : void 0, (_ref3 = v.uv) != null ? _ref3.y : void 0));
				  }
				  return _results2;
				})();
				face = (function(func, args, ctor) {
				  ctor.prototype = func.prototype;
				  var child = new ctor, result = func.apply(child, args);
				  return Object(result) === result ? result : child;
				})(THREE.Face3, __slice.call((function() {
				  var _k, _len1, _results2;
				  _results2 = [];
				  for (_k = 0, _len1 = verts.length; _k < _len1; _k++) {
					v = verts[_k];
					_results2.push(geometry.vertices.push(v) - 1);
				  }
				  return _results2;
				})()).concat([polygon.normal.clone()]), function(){});
				geometry.faces.push(face);
				_results1.push(geometry.faceVertexUvs[0].push(vertUvs));
			  }
			  return _results1;
			})());
		  }
		  return _results;
		});
	  };
  
	  ThreeBSP.prototype.subtract = function(other) {
		var them, us, _ref;
		_ref = [this.tree.clone(), other.tree.clone()], us = _ref[0], them = _ref[1];
		us.invert().clipTo(them);
		them.clipTo(us).invert().clipTo(us).invert();
		return new ThreeBSP(us.build(them.allPolygons()).invert(), this.matrix);
	  };
  
	  ThreeBSP.prototype.union = function(other) {
		var them, us, _ref;
		_ref = [this.tree.clone(), other.tree.clone()], us = _ref[0], them = _ref[1];
		us.clipTo(them);
		them.clipTo(us).invert().clipTo(us).invert();
		return new ThreeBSP(us.build(them.allPolygons()), this.matrix);
	  };
  
	  ThreeBSP.prototype.intersect = function(other) {
		var them, us, _ref;
		_ref = [this.tree.clone(), other.tree.clone()], us = _ref[0], them = _ref[1];
		them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
		return new ThreeBSP(us.build(them.allPolygons()).invert(), this.matrix);
	  };
  
	  return ThreeBSP;
  
	})();
  
	ThreeBSP.Vertex = (function(_super) {
	  __extends(Vertex, _super);
  
	  function Vertex(x, y, z, normal, uv) {
		this.normal = normal != null ? normal : new THREE.Vector3();
		this.uv = uv != null ? uv : new THREE.Vector2();
		this.interpolate = __bind(this.interpolate, this);
		this.lerp = __bind(this.lerp, this);
		Vertex.__super__.constructor.call(this, x, y, z);
	  }
  
	  Vertex.prototype.clone = function() {
		return new ThreeBSP.Vertex(this.x, this.y, this.z, this.normal.clone(), this.uv.clone());
	  };
  
	  Vertex.prototype.lerp = function(v, alpha) {
		var _this = this;
		return returning(Vertex.__super__.lerp.apply(this, arguments), function() {
		  _this.uv.add(v.uv.clone().sub(_this.uv).multiplyScalar(alpha));
		  return _this.normal.lerp(v, alpha);
		});
	  };
  
	  Vertex.prototype.interpolate = function() {
		var args, _ref;
		args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
		return (_ref = this.clone()).lerp.apply(_ref, args);
	  };
  
	  return Vertex;
  
	})(THREE.Vector3);
  
	ThreeBSP.Polygon = (function() {
	  function Polygon(vertices, normal, w) {
		this.vertices = vertices != null ? vertices : [];
		this.normal = normal;
		this.w = w;
		this.subdivide = __bind(this.subdivide, this);
		this.tessellate = __bind(this.tessellate, this);
		this.classifySide = __bind(this.classifySide, this);
		this.classifyVertex = __bind(this.classifyVertex, this);
		this.invert = __bind(this.invert, this);
		this.clone = __bind(this.clone, this);
		this.calculateProperties = __bind(this.calculateProperties, this);
		if (this.vertices.length) {
		  this.calculateProperties();
		}
	  }
  
	  Polygon.prototype.calculateProperties = function() {
		var _this = this;
		return returning(this, function() {
		  var a, b, c, _ref;
		  _ref = _this.vertices, a = _ref[0], b = _ref[1], c = _ref[2];
		  _this.normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
		  return _this.w = _this.normal.clone().dot(a);
		});
	  };
  
	  Polygon.prototype.clone = function() {
		var v;
		return new ThreeBSP.Polygon((function() {
		  var _i, _len, _ref, _results;
		  _ref = this.vertices;
		  _results = [];
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			v = _ref[_i];
			_results.push(v.clone());
		  }
		  return _results;
		}).call(this), this.normal.clone(), this.w);
	  };
  
	  Polygon.prototype.invert = function() {
		var _this = this;
		return returning(this, function() {
		  _this.normal.multiplyScalar(-1);
		  _this.w *= -1;
		  return _this.vertices.reverse();
		});
	  };
  
	  Polygon.prototype.classifyVertex = function(vertex) {
		var side;
		side = this.normal.dot(vertex) - this.w;
		switch (false) {
		  case !(side < -EPSILON):
			return BACK;
		  case !(side > EPSILON):
			return FRONT;
		  default:
			return COPLANAR;
		}
	  };
  
	  Polygon.prototype.classifySide = function(polygon) {
		var back, front, tally, v, _i, _len, _ref, _ref1,
		  _this = this;
		_ref = [0, 0], front = _ref[0], back = _ref[1];
		tally = function(v) {
		  switch (_this.classifyVertex(v)) {
			case FRONT:
			  return front += 1;
			case BACK:
			  return back += 1;
		  }
		};
		_ref1 = polygon.vertices;
		for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
		  v = _ref1[_i];
		  tally(v);
		}
		if (front > 0 && back === 0) {
		  return FRONT;
		}
		if (front === 0 && back > 0) {
		  return BACK;
		}
		if ((front === back && back === 0)) {
		  return COPLANAR;
		}
		return SPANNING;
	  };
  
	  Polygon.prototype.tessellate = function(poly) {
		var b, count, f, i, j, polys, t, ti, tj, v, vi, vj, _i, _len, _ref, _ref1, _ref2,
		  _this = this;
		_ref = {
		  f: [],
		  b: [],
		  count: poly.vertices.length
		}, f = _ref.f, b = _ref.b, count = _ref.count;
		if (this.classifySide(poly) !== SPANNING) {
		  return [poly];
		}
		_ref1 = poly.vertices;
		for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
		  vi = _ref1[i];
		  vj = poly.vertices[(j = (i + 1) % count)];
		  _ref2 = (function() {
			var _j, _len1, _ref2, _results;
			_ref2 = [vi, vj];
			_results = [];
			for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
			  v = _ref2[_j];
			  _results.push(this.classifyVertex(v));
			}
			return _results;
		  }).call(this), ti = _ref2[0], tj = _ref2[1];
		  if (ti !== BACK) {
			f.push(vi);
		  }
		  if (ti !== FRONT) {
			b.push(vi);
		  }
		  if ((ti | tj) === SPANNING) {
			t = (this.w - this.normal.dot(vi)) / this.normal.dot(vj.clone().sub(vi));
			v = vi.interpolate(vj, t);
			f.push(v);
			b.push(v);
		  }
		}
		return returning((polys = []), function() {
		  if (f.length >= 3) {
			polys.push(new ThreeBSP.Polygon(f));
		  }
		  if (b.length >= 3) {
			return polys.push(new ThreeBSP.Polygon(b));
		  }
		});
	  };
  
	  Polygon.prototype.subdivide = function(polygon, coplanar_front, coplanar_back, front, back) {
		var poly, side, _i, _len, _ref, _results;
		_ref = this.tessellate(polygon);
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		  poly = _ref[_i];
		  side = this.classifySide(poly);
		  switch (side) {
			case FRONT:
			  _results.push(front.push(poly));
			  break;
			case BACK:
			  _results.push(back.push(poly));
			  break;
			case COPLANAR:
			  if (this.normal.dot(poly.normal) > 0) {
				_results.push(coplanar_front.push(poly));
			  } else {
				_results.push(coplanar_back.push(poly));
			  }
			  break;
			default:
			  throw new Error("BUG: Polygon of classification " + side + " in subdivision");
		  }
		}
		return _results;
	  };
  
	  return Polygon;
  
	})();
  
	ThreeBSP.Node = (function() {
	  Node.prototype.clone = function() {
		var node,
		  _this = this;
		return returning((node = new ThreeBSP.Node()), function() {
		  var p, _ref, _ref1, _ref2;
		  node.divider = (_ref = _this.divider) != null ? _ref.clone() : void 0;
		  node.polygons = (function() {
			var _i, _len, _ref1, _results;
			_ref1 = this.polygons;
			_results = [];
			for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
			  p = _ref1[_i];
			  _results.push(p.clone());
			}
			return _results;
		  }).call(_this);
		  node.front = (_ref1 = _this.front) != null ? _ref1.clone() : void 0;
		  return node.back = (_ref2 = _this.back) != null ? _ref2.clone() : void 0;
		});
	  };
  
	  function Node(polygons) {
		this.clipTo = __bind(this.clipTo, this);
		this.clipPolygons = __bind(this.clipPolygons, this);
		this.invert = __bind(this.invert, this);
		this.allPolygons = __bind(this.allPolygons, this);
		this.isConvex = __bind(this.isConvex, this);
		this.build = __bind(this.build, this);
		this.clone = __bind(this.clone, this);
		this.polygons = [];
		if ((polygons != null) && polygons.length) {
		  this.build(polygons);
		}
	  }
  
	  Node.prototype.build = function(polygons) {
		var _this = this;
		return returning(this, function() {
		  var poly, polys, side, sides, _i, _len, _results;
		  sides = {
			front: [],
			back: []
		  };
		  if (_this.divider == null) {
			_this.divider = polygons[0].clone();
		  }
		  for (_i = 0, _len = polygons.length; _i < _len; _i++) {
			poly = polygons[_i];
			_this.divider.subdivide(poly, _this.polygons, _this.polygons, sides.front, sides.back);
		  }
		  _results = [];
		  for (side in sides) {
			if (!__hasProp.call(sides, side)) continue;
			polys = sides[side];
			if (polys.length) {
			  if (_this[side] == null) {
				_this[side] = new ThreeBSP.Node();
			  }
			  _results.push(_this[side].build(polys));
			} else {
			  _results.push(void 0);
			}
		  }
		  return _results;
		});
	  };
  
	  Node.prototype.isConvex = function(polys) {
		var inner, outer, _i, _j, _len, _len1;
		for (_i = 0, _len = polys.length; _i < _len; _i++) {
		  inner = polys[_i];
		  for (_j = 0, _len1 = polys.length; _j < _len1; _j++) {
			outer = polys[_j];
			if (inner !== outer && outer.classifySide(inner) !== BACK) {
			  return false;
			}
		  }
		}
		return true;
	  };
  
	  Node.prototype.allPolygons = function() {
		var _ref, _ref1;
		return this.polygons.slice().concat(((_ref1 = this.front) != null ? _ref1.allPolygons() : void 0) || []).concat(((_ref = this.back) != null ? _ref.allPolygons() : void 0) || []);
	  };
  
	  Node.prototype.invert = function() {
		var _this = this;
		return returning(this, function() {
		  var flipper, poly, _i, _j, _len, _len1, _ref, _ref1, _ref2;
		  _ref = _this.polygons;
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			poly = _ref[_i];
			poly.invert();
		  }
		  _ref1 = [_this.divider, _this.front, _this.back];
		  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
			flipper = _ref1[_j];
			if (flipper != null) {
			  flipper.invert();
			}
		  }
		  return _ref2 = [_this.back, _this.front], _this.front = _ref2[0], _this.back = _ref2[1], _ref2;
		});
	  };
  
	  Node.prototype.clipPolygons = function(polygons) {
		var back, front, poly, _i, _len;
		if (!this.divider) {
		  return polygons.slice();
		}
		front = [];
		back = [];
		for (_i = 0, _len = polygons.length; _i < _len; _i++) {
		  poly = polygons[_i];
		  this.divider.subdivide(poly, front, back, front, back);
		}
		if (this.front) {
		  front = this.front.clipPolygons(front);
		}
		if (this.back) {
		  back = this.back.clipPolygons(back);
		}
		return front.concat(this.back ? back : []);
	  };
  
	  Node.prototype.clipTo = function(node) {
		var _this = this;
		return returning(this, function() {
		  var _ref, _ref1;
		  _this.polygons = node.clipPolygons(_this.polygons);
		  if ((_ref = _this.front) != null) {
			_ref.clipTo(node);
		  }
		  return (_ref1 = _this.back) != null ? _ref1.clipTo(node) : void 0;
		});
	  };
  
	  return Node;
  
	})();
  
  }).call(this);