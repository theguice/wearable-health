//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

  // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
    };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = _;
	}
	exports._ = _;
    } else {
	root._ = _;
    }

  // Current version.
    _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
	if (obj == null) return obj;
	if (nativeForEach && obj.forEach === nativeForEach) {
	    obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
	    for (var i = 0, length = obj.length; i < length; i++) {
		if (iterator.call(context, obj[i], i, obj) === breaker) return;
	    }
	} else {
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
		if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
	    }
	}
	return obj;
    };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
	var results = [];
	if (obj == null) return results;
	if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	each(obj, function(value, index, list) {
	    results.push(iterator.call(context, value, index, list));
	});
	return results;
    };

    var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
	var initial = arguments.length > 2;
	if (obj == null) obj = [];
	if (nativeReduce && obj.reduce === nativeReduce) {
	    if (context) iterator = _.bind(iterator, context);
	    return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
	}
	each(obj, function(value, index, list) {
	    if (!initial) {
		memo = value;
		initial = true;
	    } else {
		memo = iterator.call(context, memo, value, index, list);
	    }
	});
	if (!initial) throw new TypeError(reduceError);
	return memo;
    };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
	var initial = arguments.length > 2;
	if (obj == null) obj = [];
	if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
	    if (context) iterator = _.bind(iterator, context);
	    return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
	}
	var length = obj.length;
	if (length !== +length) {
	    var keys = _.keys(obj);
	    length = keys.length;
	}
	each(obj, function(value, index, list) {
	    index = keys ? keys[--length] : --length;
	    if (!initial) {
		memo = obj[index];
		initial = true;
	    } else {
		memo = iterator.call(context, memo, obj[index], index, list);
	    }
	});
	if (!initial) throw new TypeError(reduceError);
	return memo;
    };

  // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, predicate, context) {
	var result;
	any(obj, function(value, index, list) {
	    if (predicate.call(context, value, index, list)) {
		result = value;
		return true;
	    }
	});
	return result;
    };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
    _.filter = _.select = function(obj, predicate, context) {
	var results = [];
	if (obj == null) return results;
	if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
	each(obj, function(value, index, list) {
	    if (predicate.call(context, value, index, list)) results.push(value);
	});
	return results;
    };

  // Return all the elements for which a truth test fails.
    _.reject = function(obj, predicate, context) {
	return _.filter(obj, function(value, index, list) {
	    return !predicate.call(context, value, index, list);
	}, context);
    };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
    _.every = _.all = function(obj, predicate, context) {
	predicate || (predicate = _.identity);
	var result = true;
	if (obj == null) return result;
	if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
	each(obj, function(value, index, list) {
	    if (!(result = result && predicate.call(context, value, index, list))) return breaker;
	});
	return !!result;
    };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
    var any = _.some = _.any = function(obj, predicate, context) {
	predicate || (predicate = _.identity);
	var result = false;
	if (obj == null) return result;
	if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
	each(obj, function(value, index, list) {
	    if (result || (result = predicate.call(context, value, index, list))) return breaker;
	});
	return !!result;
    };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
	if (obj == null) return false;
	if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	return any(obj, function(value) {
	    return value === target;
	});
    };

  // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
	var args = slice.call(arguments, 2);
	var isFunc = _.isFunction(method);
	return _.map(obj, function(value) {
	    return (isFunc ? method : value[method]).apply(value, args);
	});
    };

  // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
	return _.map(obj, _.property(key));
    };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
    _.where = function(obj, attrs) {
	return _.filter(obj, _.matches(attrs));
    };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
	return _.find(obj, _.matches(attrs));
    };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
    _.max = function(obj, iterator, context) {
	if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	    return Math.max.apply(Math, obj);
	}
	var result = -Infinity, lastComputed = -Infinity;
	each(obj, function(value, index, list) {
	    var computed = iterator ? iterator.call(context, value, index, list) : value;
	    if (computed > lastComputed) {
		result = value;
		lastComputed = computed;
	    }
	});
	return result;
    };

  // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
	if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	    return Math.min.apply(Math, obj);
	}
	var result = Infinity, lastComputed = Infinity;
	each(obj, function(value, index, list) {
	    var computed = iterator ? iterator.call(context, value, index, list) : value;
	    if (computed < lastComputed) {
		result = value;
		lastComputed = computed;
	    }
	});
	return result;
    };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    _.shuffle = function(obj) {
	var rand;
	var index = 0;
	var shuffled = [];
	each(obj, function(value) {
	    rand = _.random(index++);
	    shuffled[index - 1] = shuffled[rand];
	    shuffled[rand] = value;
	});
	return shuffled;
    };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
    _.sample = function(obj, n, guard) {
	if (n == null || guard) {
	    if (obj.length !== +obj.length) obj = _.values(obj);
	    return obj[_.random(obj.length - 1)];
	}
	return _.shuffle(obj).slice(0, Math.max(0, n));
    };

  // An internal function to generate lookup iterators.
    var lookupIterator = function(value) {
	if (value == null) return _.identity;
	if (_.isFunction(value)) return value;
	return _.property(value);
    };

  // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, iterator, context) {
	iterator = lookupIterator(iterator);
	return _.pluck(_.map(obj, function(value, index, list) {
	    return {
		value: value,
		index: index,
		criteria: iterator.call(context, value, index, list)
	    };
	}).sort(function(left, right) {
	    var a = left.criteria;
	    var b = right.criteria;
	    if (a !== b) {
		if (a > b || a === void 0) return 1;
		if (a < b || b === void 0) return -1;
	    }
	    return left.index - right.index;
	}), 'value');
    };

  // An internal function used for aggregate "group by" operations.
    var group = function(behavior) {
	return function(obj, iterator, context) {
	    var result = {};
	    iterator = lookupIterator(iterator);
	    each(obj, function(value, index) {
		var key = iterator.call(context, value, index, obj);
		behavior(result, key, value);
	    });
	    return result;
	};
    };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
    _.groupBy = group(function(result, key, value) {
	_.has(result, key) ? result[key].push(value) : result[key] = [value];
    });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
    _.indexBy = group(function(result, key, value) {
	result[key] = value;
    });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
    _.countBy = group(function(result, key) {
	_.has(result, key) ? result[key]++ : result[key] = 1;
    });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator, context) {
	iterator = lookupIterator(iterator);
	var value = iterator.call(context, obj);
	var low = 0, high = array.length;
	while (low < high) {
	    var mid = (low + high) >>> 1;
	    iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
	}
	return low;
    };

  // Safely create a real, live array from anything iterable.
    _.toArray = function(obj) {
	if (!obj) return [];
	if (_.isArray(obj)) return slice.call(obj);
	if (obj.length === +obj.length) return _.map(obj, _.identity);
	return _.values(obj);
    };

  // Return the number of elements in an object.
    _.size = function(obj) {
	if (obj == null) return 0;
	return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
	if (array == null) return void 0;
	if ((n == null) || guard) return array[0];
	if (n < 0) return [];
	return slice.call(array, 0, n);
    };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
    _.initial = function(array, n, guard) {
	return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
	if (array == null) return void 0;
	if ((n == null) || guard) return array[array.length - 1];
	return slice.call(array, Math.max(array.length - n, 0));
    };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function(array, n, guard) {
	return slice.call(array, (n == null) || guard ? 1 : n);
    };

  // Trim out all falsy values from an array.
    _.compact = function(array) {
	return _.filter(array, _.identity);
    };

  // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, output) {
	if (shallow && _.every(input, _.isArray)) {
	    return concat.apply(output, input);
	}
	each(input, function(value) {
	    if (_.isArray(value) || _.isArguments(value)) {
		shallow ? push.apply(output, value) : flatten(value, shallow, output);
	    } else {
		output.push(value);
	    }
	});
	return output;
    };

  // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function(array, shallow) {
	return flatten(array, shallow, []);
    };

  // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
	return _.difference(array, slice.call(arguments, 1));
    };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function(array, predicate) {
	var pass = [], fail = [];
	each(array, function(elem) {
	    (predicate(elem) ? pass : fail).push(elem);
	});
	return [pass, fail];
    };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
	if (_.isFunction(isSorted)) {
	    context = iterator;
	    iterator = isSorted;
	    isSorted = false;
	}
	var initial = iterator ? _.map(array, iterator, context) : array;
	var results = [];
	var seen = [];
	each(initial, function(value, index) {
	    if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
		seen.push(value);
		results.push(array[index]);
	    }
	});
	return results;
    };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
    _.union = function() {
	return _.uniq(_.flatten(arguments, true));
    };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
    _.intersection = function(array) {
	var rest = slice.call(arguments, 1);
	return _.filter(_.uniq(array), function(item) {
	    return _.every(rest, function(other) {
		return _.contains(other, item);
	    });
	});
    };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
    _.difference = function(array) {
	var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
	return _.filter(array, function(value){ return !_.contains(rest, value); });
    };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
    _.zip = function() {
	var length = _.max(_.pluck(arguments, 'length').concat(0));
	var results = new Array(length);
	for (var i = 0; i < length; i++) {
	    results[i] = _.pluck(arguments, '' + i);
	}
	return results;
    };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
    _.object = function(list, values) {
	if (list == null) return {};
	var result = {};
	for (var i = 0, length = list.length; i < length; i++) {
	    if (values) {
		result[list[i]] = values[i];
	    } else {
		result[list[i][0]] = list[i][1];
	    }
	}
	return result;
    };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is n to **ECMAScript 5**'s native `Object.keys`
    _.keys = function(obj) {
	if (!_.isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj) if (_.has(obj, key)) keys.push(key);
	return keys;
    };

  // Retrieve the values of an object's properties.
    _.values = function(obj) {
	var keys = _.keys(obj);
	var length = keys.length;
	var values = new Array(length);
	for (var i = 0; i < length; i++) {
	    values[i] = obj[keys[i]];
	}
	return values;
    };

  // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
	var keys = _.keys(obj);
	var length = keys.length;
	var pairs = new Array(length);
	for (var i = 0; i < length; i++) {
	    pairs[i] = [keys[i], obj[keys[i]]];
	}
	return pairs;
    };

  // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
	var result = {};
	var keys = _.keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
	    result[obj[keys[i]]] = keys[i];
	}
	return result;
    };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
    _.functions = _.methods = function(obj) {
	var names = [];
	for (var key in obj) {
	    if (_.isFunction(obj[key])) names.push(key);
	}
	return names.sort();
    };

  // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
	each(slice.call(arguments, 1), function(source) {
	    if (source) {
		for (var prop in source) {
		    obj[prop] = source[prop];
		}
	    }
	});
	return obj;
    };

  // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
	var copy = {};
	var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	each(keys, function(key) {
	    if (key in obj) copy[key] = obj[key];
	});
	return copy;
    };

   // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj) {
	var copy = {};
	var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	for (var key in obj) {
	    if (!_.contains(keys, key)) copy[key] = obj[key];
	}
	return copy;
    };

  // Fill in a given object with default properties.
    _.defaults = function(obj) {
	each(slice.call(arguments, 1), function(source) {
	    if (source) {
		for (var prop in source) {
		    if (obj[prop] === void 0) obj[prop] = source[prop];
		}
	    }
	});
	return obj;
    };

  // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
	if (!_.isObject(obj)) return obj;
	return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
	interceptor(obj);
	return obj;
    };

  // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
	if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
	if (a instanceof _) a = a._wrapped;
	if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
	var className = toString.call(a);
	if (className != toString.call(b)) return false;
	switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
	case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
            return a == String(b);
	case '[object Number]':
        // `NaN`s are equiva(aCtor) && (aCtor instanceof aCtor) &&
            _.isFunction(bCtor) && (bCtor instanceof bCtor))
            && ('constructor' in a && 'constructor' in b)) {
	return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
	size = a.length;
	result = size == b.length;
	if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
            while (size--) {
		if (!(result = eq(a[size], b[size], aStack, bStack))) break;
            }
	}
    } else {
      // Deep compare objects.
	for (var key in a) {
            if (_.has(a, key)) {
          // Count the expected number of properties.
		size++;
          // Deep compare each member.
		if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
            }
	}
      // Ensure that both objects contain the same number of properties.
	if (result) {
            for (key in b) {
		if (_.has(b, key) && !(size--)) break;
            }
            result = !size;
	}
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
};

  // Perform a deep comparison to check if two objects are equal.
 _.isEqual = function(a, b) {
     return eq(a, b, [], []);
 };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
 _.isEmpty = function(obj) {
     if (obj == null) return true;
     if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
     for (var key in obj) if (_.has(obj, key)) return false;
     return true;
 };

  // Is a given value a DOM element?
 _.isElement = function(obj) {
     return !!(obj && obj.nodeType === 1);
 };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
 _.isArray = nativeIsArray || function(obj) {
     return toString.call(obj) == '[object Array]';
 };

  // Is a given variable an object?
 _.isObject = function(obj) {
     return obj === Object(obj);
 };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
 each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
     _['is' + name] = function(obj) {
	 return toString.call(obj) == '[object ' + name + ']';
     };
 });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
 if (!_.isArguments(arguments)) {
     _.isArguments = function(obj) {
	 return !!(obj && _.has(obj, 'callee'));
     };
 }

  // Optimize `isFunction` if appropriate.
 if (typeof (/./) !== 'function') {
     _.isFunction = function(obj) {
	 return typeof obj === 'function';
     };
 }

  // Is a given object a finite number?
 _.isFinite = function(obj) {
     return isFinite(obj) && !isNaN(parseFloat(obj));
 };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
 _.isNaN = function(obj) {
     return _.isNumber(obj) && obj != +obj;
 };

  // Is a given value a boolean?
 _.isBoolean = function(obj) {
     return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
 };

  // Is a given value equal to null?
 _.isNull = function(obj) {
     return obj === null;
 };

  // Is a given variable undefined?
 _.isUndefined = function(obj) {
     return obj === void 0;
 };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
 _.has = function(obj, key) {
     return hasOwnProperty.call(obj, key);
 };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
 _.noConflict = function() {
  
  // Regexes containing the keys and values listed immediately above.
     var entityRegexes = {
	 escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
	 unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
     };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
     _.each(['escape', 'unescape'], function(method) {
	 _[method] = function(string) {
	     if (string == null) return '';
	     return ('' + string).replace(entityRegexes[method], function(match) {
		 return entityMap[method][match];
	     });
	 };
     });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
     _.result = function(object, property) {
	 if (object == null) return void 0;
	 var value = object[property];
	 return _.isFunction(value) ? value.call(object) : value;
     };

  // Add your own custom functions to the Underscore object.
     _.mixin = function(obj) {
	 each(_.functions(obj), function(name) {
	     var func = _[name] = obj[name];
	     _.prototype[name] = function() {
		 var args = [this._wrapped];
		 push.apply(args, arguments);
		 return result.call(this, func.apply(_, args));
	     };
	 });
     };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
     var idCounter = 0;
     _.uniqueId = function(prefix) {
	 var id = ++idCounter + '';
	 return prefix ? prefix + id : id;
     };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
     _.templateSettings = {
	 evaluate    : /<%([\s\S]+?)%>/g,
	 interpolate : /<%=([\s\S]+?)%>/g,
	 escape      : /<%-([\s\S]+?)%>/g
     };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
     var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
     var escapes = {
	 "'":      "'",
	 '\\':     '\\',
	 '\r':     'r',
	 '\n':     'n',
	 '\t':     't',
	 '\u2028': 'u2028',
	 '\u2029': 'u2029'
     };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
	 _.template = function(text, data, settings) {
	     var render;
	     settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
	     var matcher = new RegExp([
		 (settings.escape || noMatch).source,
		 (settings.interpolate || noMatch).source,
		 (settings.evaluate || noMatch).source
	     ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
	     var index = 0;
	     var source = "__p+='";
	     text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
		 source += text.slice(index, offset)
		     .replace(escaper, function(match) { return '\\' + escapes[match]; });

		 if (escape) {
		     source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
		 }
		 if (interpolate) {
		     source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
		 }
		 if (evaluate) {
		     source += "';\n" + evaluate + "\n__p+='";
		 }
		 index = offset + match.length;
		 return match;
	     });
	     source += "';\n";

    // If a variable is not specified, place data values in local scope.
	     if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
		 source + "return __p;\n";

	     try {
		 render = new Function(settings.variable || 'obj', '_', source);
	     } catch (e) {
		 e.source = source;
		 throw e;
	     }

	     if (data) return render(data, _);
	     var template = function(data) {
		 return render.call(this, data, _);
	     };

    // Provide the compiled function source as a convenience for precompilation.
	     template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

	     return template;
	 };

  // Add a "chain" function, which will delegate to the wrapper.
     _.chain = function(obj) {
	 return _(obj).chain();
     };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
     var result = function(obj) {
	 return this._chain ? _(obj).chain() : obj;
     };

  // Add all of the Underscore functions to the wrapper object.
     _.mixin(_);

  // Add all mutator Array functions to the wrapper.
     each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	 var method = ArrayProto[name];
	 _.prototype[name] = function() {
	     var obj = this._wrapped;
	     method.apply(obj, arguments);
	     if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
	     return result.call(this, obj);
	 };
     });

  // Add all accessor Array functions to the wrapper.
     each(['concat', 'join', 'slice'], function(name) {
	 var method = ArrayProto[name];
	 _.prototype[name] = function() {
	     return result.call(this, method.apply(this._wrapped, arguments));
	 };
     });

     _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
	 chain: function() {
	     this._chain = true;
	     return this;
	 },

    // Extracts the result from a wrapped and chained object.
	 value: function() {
	     return this._wrapped;
	 }

     });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
     if (typeof define === 'function' && define.amd) {
	 define('underscore', [], function() {
	     return _;
	 });
     }
 }).call(this)