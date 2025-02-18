function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const visited = new Set();
  
    for (let node in graph) {
      distances[node] = Infinity;
      prev[node] = null;
    }
    distances[start] = 0;
  
    while (true) {
      let currentNode = null;
      let currentMinDist = Infinity;
  
      for (let node in distances) {
        if (!visited.has(node) && distances[node] < currentMinDist) {
          currentMinDist = distances[node];
          currentNode = node;
        }
      }
  
      if (currentNode === null) {
        break;
      }
  
      if (parseInt(currentNode) === end) {
        break;
      }
  
      visited.add(currentNode);
  
      for (let edge of graph[currentNode]) {
        const neighbor = edge.node;
        const dist = edge.dist;
  
        if (!visited.has(neighbor)) {
          let newDist = distances[currentNode] + dist;
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            prev[neighbor] = currentNode;
          }
        }
      }
    }
  
    const path = [];
    let temp = end;
  
    if (distances[end] === Infinity) {
      return { distance: Infinity, path: [] };
    }
  
    while (temp !== null) {
      path.unshift(temp);
      temp = prev[temp];
    }
  
    return {
      distance: distances[end],
      path: path
    };
  }
  