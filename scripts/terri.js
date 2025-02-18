function terriAlgorithm(graph, start, end) {
    let bestDistance = Infinity;
    let bestPath = null;
  
    /**
     * @param {number} current
     * @param {number} currentDistance
     * @param {Array} path 
     * @param {Set} usedEdges 
     */
    function dfs(current, currentDistance, path, usedEdges) {
      if (current === end) {
        if (currentDistance < bestDistance) {
          bestDistance = currentDistance;
          bestPath = [...path];
        }
        return;
      }
  
      if (currentDistance >= bestDistance) {
        return;
      }
  
      for (let edge of graph[current]) {
        const neighbor = edge.node;
        const d = edge.dist;
        const edgeKey = current + "->" + neighbor;
  
        if (!usedEdges.has(edgeKey)) {
          usedEdges.add(edgeKey);
          path.push(neighbor);
  
          dfs(neighbor, currentDistance + d, path, usedEdges);
  
          path.pop();
          usedEdges.delete(edgeKey);
        }
      }
    }
  
    dfs(start, 0, [start], new Set());
  
    if (bestDistance === Infinity) {
      return { distance: Infinity, path: [] };
    }
    return { distance: bestDistance, path: bestPath };
  }
  