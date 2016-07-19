app.directive('treeChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {
			data: '='
		},
		controller: function($scope, $state) {
			console.log($scope.data)

			var data = $scope.data;

			var width = window.innerWidth,
          height = window.innerHeight;

			var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

			var g = svg.append("g").attr("transform", "translate(40,0)");

			var tree = d3.tree()
			    .size([height, width - 160]);

			var stratify = d3.stratify()
			    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

			// d3.csv("flare.csv", function(error, data) {
			//   if (error) throw error;

			var root = d3.hierarchy(data);
			console.log(root);
		  // var root = stratify(data)
		  //     .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

		  tree(root);

		  var link = g.selectAll(".link")
		      .data(root.descendants().slice(1))
		    .enter().append("path")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        return "M" + d.y + "," + d.x
		            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
		            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
		            + " " + d.parent.y + "," + d.parent.x;
		      });

		  var node = g.selectAll(".node")
		      .data(root.descendants())
		    .enter().append("g")
		      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

		  node.append("circle")
		      .attr("r", 5);

		  node.append("text")
		      .attr("dy", 3)
		      .attr("x", function(d) { return d.children ? -8 : 8; })
		      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		      .text(function(d) { return d.name; });
			// });
    }
  }
});
