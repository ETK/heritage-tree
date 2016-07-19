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

			var svg = d3.select("svg")
					.attr("width", width)
					.attr("height", height);

			var g = svg.append("g").attr("transform", "translate(40,0)");

			var tree = d3.tree()
					.size([height, width - 160]);

			// var stratify = d3.stratify()
			//   .id(function(d) {
			//     return d.name;//This position
			//   })
			//   .parentId(function(d) {
			//     return d.parent; //What position this position reports to
			//   });
			//
			// var root = stratify(data);

			var root = d3.hierarchy(data);
			root.x0 = height / 2;
			root.y0 = 0;
			update(root);

			var i = 0,
					duration = 750;

			function update(source) {

				// Compute the new tree layout
				var nodes = tree(root).descendants(),
						links = nodes.slice(1);

				// Normalize for fixed-depth
				nodes.forEach(function(d) { d.y = d.depth * 180; });

				// Update the nodes…
			  var node = svg.selectAll("g.node")
			      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				// Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			      .on("click", click);

				nodeEnter.append("circle")
			      .attr("r", 1e-6)
			      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeEnter.append("text")
			      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
			      .attr("dy", ".35em")
			      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
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
			  var link = svg.selectAll("path.link")
			      .data(links);

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


						//=====


				// var g = svg.append("g").attr("transform", "translate(40,0)");

				// tree = d3.tree()
				//     .size([height, width - 160]);
				//
				// root = d3.hierarchy(data);
				//
			  // tree(root);

			  // var link = g.selectAll(".link")
			  //     .data(root.descendants().slice(1))
			  //   .enter().append("path")
			  //     .attr("class", "link")
			  //     .attr("d", function(d) {
			  //       return "M" + d.y + "," + d.x
			  //           + "C" + (d.y + d.parent.y) / 2 + "," + d.x
			  //           + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
			  //           + " " + d.parent.y + "," + d.parent.x;
			  //     });

			  // var node = g.selectAll(".node")
			  //     .data(root.descendants())
			  //   .enter().append("g")
			  //     .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
			  //     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				// 		// .attr("transform", function(d) {
        //     //     return "translate(" + source.y0 + "," + source.x0 + ")";
        //     // })
				// 		.on('click', click);

			  // node.append("circle")
			  //     .attr("r", 5);
				//
			  // node.append("text")
			  //     .attr("dy", 3)
			  //     .attr("x", function(d) { return d.children ? -8 : 8; })
			  //     .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
			  //     .text(function(d) { return d.data.name; });

			}

			// Define the zoom function for the zoomable tree

	    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	    }
			var zoomListener = d3.zoom()
					.scaleExtent([0.1, 3])
					.on("zoom", zoom);

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

			// // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
			// function centerNode(source) {
      //   scale = zoomListener.scale();
      //   x = -source.y0;
      //   y = -source.x0;
      //   x = x * scale + viewerWidth / 2;
      //   y = y * scale + viewerHeight / 2;
      //   d3.select('g').transition()
      //       .duration(duration)
      //       .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
      //   zoomListener.scale(scale);
      //   zoomListener.translate([x, y]);
    	// }

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
					// centerNode(d);
			}

			function connector(d) {
			  return "M" + d.y + "," + d.x +
			    "C" + (d.y + d.parent.y) / 2 + "," + d.x +
			    " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
			    " " + d.parent.y + "," + d.parent.x;
			}

			// Layout the tree initially and center on the root node.
			// root = d3.hierarchy(data);
			// update(root);
			// centerNode(root);

    }
  }
});
