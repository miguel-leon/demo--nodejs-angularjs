/**
 * Dependency Loader - version 2.2
 * (c) Miguel Leon. 2014.
 */
var DependencyLoader = new (function (document) {'use strict';
	var _readystates = {}; // undefined: unverified; false: loading; true: loaded. For external scripts.
	var _paths = {};
	var _dependencies = {};
	var _scripts = {};

	this.paths = function(paths) {
		if (objectType.call(paths) != '[object Object]') throw badObjectError;
		Object.keys(paths).forEach(function(id) {
			if (typeof paths[id] != 'string' && typeof paths[id] != 'function') throw badPathTypeErrorFor(id);
		});

		_paths = paths;
		return this;
	};

	this.dependencies = function(dependencies) {
		if (objectType.call(dependencies) != '[object Object]') throw badObjectError;
		Object.keys(dependencies).forEach(function(id) {
			if (typeof dependencies[id] == 'string') dependencies[id] = [dependencies[id]];
			else {
				if (objectType.call(dependencies[id]) != '[object Array]') throw badDependencyTypeErrorFor(id);
				if (dependencies[id].length == 0) delete dependencies[id];
				else dependencies[id].forEach(function(id) {
					if (typeof id != 'string') throw badIdTypeError;
				});
			}
		});

		_dependencies = dependencies;
		return this;
	};

	this.load = function(id) {
		if (typeof id != 'string') throw badIdTypeError;
		if (!(id in _paths)) throw badIdErrorFor(id);

		nonCircularValidation(id, {});
		loadAsynchronously(id);
		return this;
	};

	this.loadAll = function() {
		var roots = findRoots();
		roots.forEach(function(root) { loadAsynchronously(root); });
	};

	this.asyncRequire = function(src, callback) {
		if (typeof src != 'string') throw badPathTypeErrorFor('src');

		addScriptTag(src, undefined, callback);
	};


	function loadAsynchronously(id, callback) {
		if (!(id in _paths)) throw badIdErrorFor(id);
		var path = _paths[id];
		var loadThis = function() {
			if (typeof path == 'function') {
				// function dependencies might get executed multiple times in contrast to external scripts.
				setTimeout(function(){
					path();
					if (callback) callback();
				}, 0);
			}
			else {
				if (path === "") _readystates[id] = true;
				if (id in _readystates) {
					if (callback) {
						if (_readystates[id]) setTimeout(callback, 0);
						else addScriptListener(id, callback);
					}
				}
				else addScriptTag(path, id, callback);
			}
		};

		setTimeout(function() {
			if (id in _dependencies) {
				var dependencies_remaining = _dependencies[id].length;
				_dependencies[id].forEach(function(dependencyId) {
					loadAsynchronously(dependencyId, function() {
						dependencies_remaining--;
						if (dependencies_remaining == 0) loadThis();
					});
				});
			}
			else loadThis();
		}, 0);
	}

	function addScriptTag(src, id, callback) {
		var script = document.createElement('script');
		//script.type = 'text/javascript';
		script.src = src;
		if (id) {
			_readystates[id] = false;
			_scripts[id] = script;
			script.addEventListener('load', function() { _readystates[id] = true; });
		}
		if(callback) script.addEventListener('load', callback);
		document.body.appendChild(script);
	}

	function addScriptListener(id, callback) {
		_scripts[id].addEventListener('load', callback);
	}

	function nonCircularValidation(id, nodes, roots) { // nodes must be at least an empty object.
		// attributes for object nodes (undefined: unseen; false: seen; true: checking children)
		// if roots is used, it's supposed to initially contain all nodes.
		if (nodes[id]) throw circularDependencyError;
		if (id in nodes) return;
		if (id in _dependencies) {
			nodes[id] = true;
			_dependencies[id].forEach(function(dependencyId) {
				nonCircularValidation(dependencyId, nodes);
				if (roots) delete roots[dependencyId];
			});
		}
		nodes[id] = false;
	}

	function findRoots() {
		var roots = {};
		Object.keys(_paths).forEach(function(id) { roots[id] = true }); // populating roots.
		var nodes = {};

		for (var id in roots) { nonCircularValidation(id, nodes, roots); }
		return Object.keys(roots);
	}

	// ERROR MESSAGES
	var circularDependencyError = 'Circular dependency found!';
	var badIdTypeError = 'Dependency identifier is not a string!';
	var badObjectError = 'Argument is not an object!';
	function badPathTypeErrorFor(id) { return 'Path for "' + id + '" is not a string or a function!' }
	function badDependencyTypeErrorFor(id) { return 'Dependencies for "' + id + '" are not an array or a string!' }
	function badIdErrorFor(id) { return 'Path or function for dependency "' + id + '" not found!' }

	// OBJECT TYPE CHECKING
	var objectType = {}.toString;
})(document);