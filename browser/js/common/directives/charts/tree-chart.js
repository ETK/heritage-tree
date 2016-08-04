app.directive('treeChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {
			data: '='
		},
		controller: function($scope, $state) {
			// console.log($scope.data)

			var data = $scope.data;

			var width = window.innerWidth,
          height = window.innerHeight;

			// variables for drag/drop
			var selectedNode = null;
			var draggingNode = null;
			// panning variables
			var panSpeed = 200;
			var panBoundary = 20; // Within 20px from edges will pan when dragging.

			var svg = d3.select("svg")
					.attr("width", width)
					.attr("height", height);

			var g = svg.append("g").attr("transform", "translate(40,0)");

			var tree = d3.tree()
					.size([height, width - 160]);

			var root = d3.hierarchy(data);
			root.x0 = height / 2;
			root.y0 = 0;
			update(root);
			centerNode(root);

			var i = 0,
					duration = 750;

			function update(source) {

				// Compute the new tree layout
				var nodes = tree(root).descendants(),
						links = nodes.slice(1);

				// Normalize for fixed-depth
				nodes.forEach(function(d) { d.y = d.depth * 180; });

				// Update the nodes…
			  var node = g.selectAll("g.node")
			      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				// Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			      .on("click", click);

				nodeEnter.append("circle")
			      .attr("r", 1e-6)
			      .style("fill", function(d) { return d._children ? "#000000" : "#fff"; });

			  nodeEnter.append("text")
						.attr("x", function(d) { return -10; })
			      // .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
			      .attr("dy", ".35em")
						.attr("text-anchor", function(d) { return "end"; })
			      // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			      .text(function(d) { return d.data.name; })
			      .style("fill-opacity", 1e-6);


				// Transition nodes to their new position.
			  var nodeUpdate = node.merge(nodeEnter).transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			  nodeUpdate.select("circle")
			      .attr("r", 4.5)
			      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeUpdate.select("text")
			      .style("fill-opacity", 1);

				// Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			      .remove();

			  nodeExit.select("circle")
			      .attr("r", 1e-6);

			  nodeExit.select("text")
			      .style("fill-opacity", 1e-6);

				// Update the links…
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

			// Handle node expansion/collapse
	    function collapse(d) {
	        if (d.children) {
	            d._children = d.children;
	            d._children.forEach(collapse);
	            d.children = null;
	        }
	    }

	    function expand(d) {
	        if (d._children) {
	            d.children = d._children;
	            d.children.forEach(expand);
	            d._children = null;
	        }
	    }

			// Handle window resize
			d3.select(window).on("resize", resize);

			function resize() {
		    width = window.innerWidth, height = window.innerHeight;
		    svg.attr("width", width).attr("height", height);
		  }

			// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
			function centerNode(source) {
        var scale = d3.zoomTransform(source).k; // not working properly
        var x = -source.y0;
        var y = -source.x0;
        x = x * scale + width / 2;
        y = y * scale + height / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    	}

			// Toggle children function
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

			// Toggle children on click.
			function click(d) {
					if (d3.event.defaultPrevented) return; // click suppressed
					d = toggleChildren(d);
					update(d);
					centerNode(d);
			}

			function connector(d) {
			  return "M" + d.y + "," + d.x +
			    "C" + (d.y + d.parent.y) / 2 + "," + d.x +
			    " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
			    " " + d.parent.y + "," + d.parent.x;
			}

    }
  }
});
