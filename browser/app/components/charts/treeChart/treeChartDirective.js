app.directive('treeChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {
			data: '='
		},
		controller: function($scope, $state, $rootScope) {

			var data = $scope.data;

			var width = getWindowSize().width,
          height = getWindowSize().height;

			var svg = d3.select("svg")
					.attr("width", width)
					.attr("height", height);

			var g = svg.append("g");

			var tree = d3.tree()
					// distance between sets of parents = 1/2 the distance between parents themselves
					.separation( function(a,b) { return a.parent === b.parent ? 1 : .5; } )
					.size([width, height])
					.nodeSize([25,1]);

			// Initialize tree
			var root = setupHierarchy(data);
			update(root);
			centerNode(root);

			var i = 0, // used to set node ids
					duration = 750; // node transition duration in ms

			function setupHierarchy(newData) {
				let newHierarchy = d3.hierarchy(newData, function(d) { return d.nextPeople });
				newHierarchy.x0 = height / 2;
				newHierarchy.y0 = 0;
				return newHierarchy;
			}

			function update(source) {

				// Compute the new tree layout
				var nodes = tree(root).descendants(),
						links = nodes.slice(1);

				// Normalize for fixed-depth
				nodes.forEach(function(d) { d.y = d.depth * 250 });

				// Update the nodes

			  var node = g.selectAll("g.node")
			      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				// Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			      .on("click", click);

				nodeEnter.append("circle")
			      .attr("r", 1e-6)
						.attr("class", function(d) { return d._children ? "collapsed" : "open" });

				// Append text for name
			  nodeEnter.append("text")
						.attr("x", 15)
						.attr("y", -5)
			      .attr("dy", ".35em")
						.attr("text-anchor", function(d) { return "start"; })
						.attr("class", "name")
			      .text(function(d) { return d.data.name; })
			      .style("fill-opacity", 1e-6);

				// Append text for birth/death dates + location
				nodeEnter.append("text")
						.attr("x", 15)
						.attr("y", 6)
						.attr("dy", ".35em")
						.attr("text-anchor", function(d) { return "start"; })
						.attr("class", "details")
						.text(function(d) { return d.data.dates + (d.data.birth_location ? ' ' + d.data.birth_location : ''); });

				// Transition nodes to their new position
			  var nodeUpdate = node.merge(nodeEnter).transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			  nodeUpdate.select("circle")
			      .attr("r", 8)
						.attr("class", function(d) { return d._children ? "collapsed" : "open" });

			  nodeUpdate.select("text")
			      .style("fill-opacity", 1);

				// Transition exiting nodes to the parent's new position
			  var nodeExit = node.exit().transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			      .remove();

			  nodeExit.select("circle")
			      .attr("r", 1e-6);

			  nodeExit.select("text")
			      .style("fill-opacity", 1e-6);

				// Update the links
			  var link = g.selectAll("path.link")
						.data(links, function(link) { var id = link.id + '->' + link.parent.id; return id; });

				// Transition links to their new position.
			  link.transition()
			      .duration(duration)
			      .attr("d", connector);

			  // Enter any new links at the parent's previous position.
			  var linkEnter = link.enter().insert("path", "g")
			                        .attr("class", "link")
			                        .attr("d", function(d) {
			        var o = {x: source.x0, y: source.y0, parent:{x: source.x0, y: source.y0}};
			        return connector(o);
			      });

			  // Transition links to their new position.
			  link.merge(linkEnter).transition()
			      .duration(duration)
			      .attr("d", connector);

			  // Transition exiting links to the parent's new position.
			  link.exit().transition()
			      .duration(duration)
			      .attr("d",  function(d) {
			        var o = {x: source.x, y: source.y, parent:{x: source.x, y: source.y}};
			        return connector(o);
			      })
			      .remove();

				// Stash the old positions for transition.
			  nodes.forEach(function(d) {
			    d.x0 = d.x;
			    d.y0 = d.y;
			  });

			}

			// Define the zoom function for the zoomable tree
	    function zoom() {
				g.attr("transform", "translate("
														+ d3.event.transform.x
														+ ','
														+ d3.event.transform.y
														+ ")scale("
														+ d3.event.transform.k + ")");
	    }

			var zoomListener = d3.zoom()
					.scaleExtent([0.1, 3])
					.on("zoom", zoom);
			svg.call(zoomListener);


			// Calculate window size
			function getWindowSize() {
				return {
					width: window.innerWidth ,
					height: window.innerHeight - 60
				};
			}

			// Handle window resize
			d3.select(window).on("resize", resize);

			function resize() {
		    svg.attr("width", getWindowSize().width)
						.attr("height", getWindowSize().height);
		  }

			// Center node when clicked/dropped
			function centerNode(source) {
        var scale = d3.zoomTransform(source).k; // TODO: not working properly
        var x = -source.y0;
        var y = -source.x0;
        x = x * scale + width / 2;
        y = y * scale + height / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    	}

			// Expand/collapse children
			function toggleChildren(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else if (d._children) {
					d.children = d._children;
					d._children = null;
				}
				return d;
			}

			// Toggle children on click
			function click(d) {
				if (d3.event.defaultPrevented) return; // click suppressed
				d = toggleChildren(d);
				update(d);
				centerNode(d);
			}

			// Draw connectors between nodes
			function connector(d) {
			  return "M" + d.y + "," + d.x +
			    "C" + (d.y + d.parent.y) / 2 + "," + d.x +
			    " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
			    " " + d.parent.y + "," + d.parent.x;
			}

			// Handle changes to data set (i.e., new starting person)
			$rootScope.$on('new-tree-chart-data', function(event, newTreeData) {
				root = d3.hierarchy(newTreeData, function(d) { return d.nextPeople });
				root.x0 = height / 2;
				root.y0 = 0;
				update(root);
				centerNode(root);
			});

    }
  }
});
