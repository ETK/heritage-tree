app.directive('forceChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {},
		controller: function($scope) {
      var width = window.innerWidth,
          height = window.innerHeight;

      var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width / 2, height / 2));

      d3.json("/miserables.json", function(error, graph) {
        if (error) throw error;

        var link = svg.append("g")
              .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
              .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
              .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
              .attr("r", 5)
              .attr("fill", function(d) { return color(d.group); })
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))
              .on('dblclick', function(d){ console.log(d.id) })
              // .on('click', connectedNodes); // highlight connected nodes

			var label = svg.append("g")
            .attr("class", "labels")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
						.attr("text-anchor", "middle")
					 .attr("x", function(d) { return d.x })
					 .attr("y", function(d) { return d.y })
					 .text(function(d) { return d.id });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
          link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });

          // From Grok
          d3.selectAll("text")
	          .attr("x", function(d) { return d.x; })
	          .attr("y", function(d) { return d.y; });
        }
      });

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      //-----------------Highlighting connected nodes------------//
      // From Grok

      //Toggle stores whether the highlighting is on
      // var toggle = 0;

      //Create an array logging what is connected to what
      // var linkedByIndex = {};
      // for ( var i = 0; i < $scope.topics.length; i++) {
      //     linkedByIndex[i + "," + i] = 1;
      // };
      // dataLinks.forEach(function (d) {
      //     linkedByIndex[d.source.index + "," + d.target.index] = 1;
      // });

      //This function looks up whether a pair are neighbours
      // function neighboring(a, b) {
      //     return linkedByIndex[a.index + "," + b.index];
      // }
      //
      // function connectedNodes() {
      //   if (toggle == 0) {
      //     //Reduce the opacity of all but the neighbouring nodes
      //      var d = d3.select(this).node().__data__;
      //     node.style("opacity", function (o) {
      //         return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
      //     });
      //     link.style("opacity", function (o) {
      //         return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
      //     });
      //     //Reduce the opacity
      //     toggle = 1;
      //   } else {
      //     //Put them back to opacity=1
      //     node.style("opacity", 1);
      //     link.style("opacity", 1);
      //     toggle = 0;
      //   }
      // }

    }
  }
});
