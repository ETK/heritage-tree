app.directive('verticalTreeChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {
			data: '='
		},
		controller: function($scope, $state) {

			var data = $scope.data;

			var width = window.innerWidth,
          height = window.innerHeight,
					textWrapWidth = 100;

			var svg = d3.select("svg")
					.attr("width", width)
					.attr("height", height);

			var g = svg.append("g").attr("transform", "translate(40,0)");

			var tree = d3.tree()
					// .size([height, width - 160])
					.nodeSize([150,0]);

			var root = d3.hierarchy(data);
			root.x0 = width / 2;
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
				nodes.forEach(function(d) { d.y = d.depth * 75; });

				// Update the nodes…
			  var node = g.selectAll("g.node")
			      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				// Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
			      .on("click", click);

				nodeEnter.append("circle")
			      .attr("r", 1e-6)
			      .style("fill", function(d) { return d._children ? "#000000" : "#fff"; });

			  nodeEnter.append("text")
						.attr("y", function(d) { return -10; })
			      .attr("dy", ".35em")
						.attr("text-anchor", function(d) { return "middle"; })
				      .text(function(d) { return d.data.name; })
			      .style("fill-opacity", 1e-6)
						.call(wrap, textWrapWidth);


				// Transition nodes to their new position.
			  var nodeUpdate = node.merge(nodeEnter).transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  nodeUpdate.select("circle")
			      .attr("r", 4.5)
			      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeUpdate.select("text")
			      .style("fill-opacity", 1)
      			.call(wrap, textWrapWidth);

				// Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
			      .remove();

			  nodeExit.select("circle")
			      .attr("r", 1e-6);

			  nodeExit.select("text")
			      .style("fill-opacity", 1e-6)
						.call(wrap, textWrapWidth);

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
        var x = -source.x0;
        var y = -source.y0;
        x = x * scale + width / 2;
        y = y * scale + height / 10; //  center at +10% of screen
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
			  return "M" + d.x + "," + d.y +
			    "C" + (d.x + d.parent.x) / 2 + "," + d.y +
			    " " + (d.x + d.parent.x) / 2 + "," + d.parent.y +
			    " " + d.parent.x + "," + d.parent.y;
			}

			// Wrap text
			function wrap(text, width) {
			  text.each(function() {
			    var text = d3.select(this),
			        words = text.text().split(/\s+/).reverse(),
			        word,
			        line = [],
			        lineNumber = 0,
			        lineHeight = 1.1, // ems
			        y = text.attr("y"),
			        dy = parseFloat(text.attr("dy")),
			        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			    while (word = words.pop()) {
			      line.push(word);
			      tspan.text(line.join(" "));
			      if (tspan.node().getComputedTextLength() > width) {
			        line.pop();
			        tspan.text(line.join(" "));
			        line = [word];
			        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			      }
			    }
			  });
			}

    }
  }
});
