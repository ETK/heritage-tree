app.directive('forceChart', function(){

	return {
		restrict: 'E',
    template: '<svg></svg>',
		scope: {
			data: '='
		},
		controller: function($scope, $state) {

      var width = window.innerWidth,
          height = window.innerHeight;

			var lineColors = {
				'parent-child': '#000000',
				'spouse': '#FF0000'
			};

			var circleColors = {
				'LINCOLN': '#0000FF',
				'HUBBARD': '#FF0000',
				'PETERS': '#00FF00',
				'NEWCOMB': '#FFFF00',
				'SZYMANOWSKI': '#00FFFF'
			};

      var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody().strength(function() { return -20; }))
          .force("center", d3.forceCenter(width / 2, height / 2));

      var link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data($scope.data.links)
          .enter().append("line")
						.attr("stroke", function(d) { return lineColors[d.type]; })
            .attr("stroke-width", 1);

      var node = svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data($scope.data.nodes)
          .enter().append("circle")
            .attr("r", 10)
						.style("fill", function(d) { return circleColors[d.last_name] || '#000000'; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on('dblclick', function(d){ $state.go('person', { personId: d.id }) });
            // .on('click', connectedNodes); // highlight connected nodes

			var label = svg.append("g")
          .attr("class", "labels")
        .selectAll("text")
        .data($scope.data.nodes)
        .enter().append("text")
					.attr("text-anchor", "middle")
					.attr("x", function(d) { return d.x })
					.attr("y", function(d) { return d.y })
					.text(function(d) { return d.name });



			// Simulation
      simulation
          .nodes($scope.data.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links($scope.data.links);


			// Allow for zoom + pan
			svg.call(d3.zoom()
				.scaleExtent([1 / 2, 4])
				.on("zoom", zoomed));

			function zoomed() {
				svg.selectAll("g").attr("transform", d3.event.transform);
			}

			// Handle window resize
			d3.select(window).on("resize", resize);

			function resize() {
		    width = window.innerWidth, height = window.innerHeight;
		    svg.attr("width", width).attr("height", height);
		    simulation
					.stop()
					.force("center", d3.forceCenter(width / 2, height / 2))
					.restart();
		  }

			// Helper functions
      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

				label
						.attr("x", function(d) { return d.x; })
						.attr("y", function(d) { return d.y; });
      }

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

    }
  }
});
