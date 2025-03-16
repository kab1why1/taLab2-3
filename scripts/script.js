// --- Existing constants and graph definition ---
const placeId = {
  "Red Univesity": 1,                  
  "St. Andrew's Church": 2,              
  "St. Michael's Golden-Domed Monastery": 3, 
  "Golden Gates": 4,                     
  "Lyadski Gate": 5,                     
  "Funicular": 6,                        
  "KPI": 7,                              
  "Fountain on Khreschatyk": 8,          
  "The Sophia Cathedral": 9,             
  "National Philharmonic": 10,           
  "One street museum": 11                
};

const idPlace = {
  1: "Red Univesity",
  2: "St. Andrew's Church",
  3: "St. Michael's Golden-Domed Monastery",
  4: "Golden Gates",
  5: "Lyadski Gate",
  6: "Funicular",
  7: "KPI",
  8: "Fountain on Khreschatyk",
  9: "The Sophia Cathedral",
  10: "National Philharmonic",
  11: "One street museum"
};

const graph = {
  1: [
    { node: 7, dist: 4.0 },
    { node: 4, dist: 0.66 }
  ],
  2: [
    { node: 9, dist: 0.71 },
    { node: 3, dist: 0.7 },
    { node: 11, dist: 0.6 }
  ],
  3: [
    { node: 9, dist: 0.65 },
    { node: 6, dist: 0.6 },
    { node: 10, dist: 0.75 }
  ],
  4: [
    { node: 1, dist: 0.66 },
    { node: 9, dist: 0.44 },
    { node: 8, dist: 0.8 }
  ],
  5: [
    { node: 3, dist: 0.7 },
    { node: 10, dist: 0.6 }
  ],
  6: [
    { node: 3, dist: 0.6 }
  ],
  7: [
    { node: 1, dist: 4.0 }
  ],
  8: [
    {node: 5, dist: 0.8}
  ], // 5
  9: [
    { node: 4, dist: 0.44 },
    { node: 2, dist: 0.71 },
    { node: 5, dist: 0.6 }
  ],
  10: [
    { node: 3, dist: 0.75 },
    { node: 5, dist: 0.6 }
  ],
  11: [
    { node: 2, dist: 0.6 },
    { node: 6, dist: 0.5 }
  ]
};

function createTarjanGraph(simpleGraph) {
  const vertices = [];
  const neighbourVertices = {};

  // Create vertices and neighbour lists
  for (let key in simpleGraph) {
    const id = parseInt(key);
    vertices.push({ sign: id });
    // For each vertex, map to an array of neighboring vertex ids (ignoring distances)
    neighbourVertices[id] = simpleGraph[key].map(edge => edge.node);
  }

  // Provide a method to retrieve vertex by its sign
  return {
    vertices: vertices,
    neighbourVertices: neighbourVertices,
    get: function(sign) {
      return vertices.find(v => v.sign === sign);
    }
  };
}

// --- Existing event listener for route calculation ---
document.getElementById("calculateBtn").addEventListener("click", () => {
  const allSelects = document.getElementsByTagName("select");
  for (let select of allSelects) {
    if (!select.value) {
      alert("Будь ласка, оберіть всі необхідні варіанти!");
      return;
    }
  }
  
  const selectedFunction = document.getElementById("functionSelect").value;
  const selectedAlgorithm = document.getElementById("algorithmSelect").value;

  const startSelect = document.getElementById("startSelect");
  const endSelect = document.getElementById("endSelect");
  const startNode = placeId[startSelect.value];
  const endNode = placeId[endSelect.value];

  if (startNode === endNode) {
    document.getElementById("result").innerHTML = `
      <p>Start and end points are the same: <strong>${startSelect.value}</strong></p>
      <p>Distance = 0 km</p>
      <p>Path = ${startSelect.value}</p>
    `;
    return;
  }

  let resultObj;
  if (selectedAlgorithm === "dijkstra") {
    resultObj = dijkstra(graph, startNode, endNode);
  } else if (selectedAlgorithm === "terri") {
    resultObj = terriAlgorithm(graph, startNode, endNode);
  } else {
    document.getElementById("result").innerHTML = `
      <p>Algorithm <strong>${selectedAlgorithm}</strong> not implemented.</p>
    `;
    return;
  }

  if (resultObj.distance === Infinity) {
    document.getElementById("result").innerHTML = `
      <p>No path found from <strong>${startSelect.value}</strong> 
      to <strong>${endSelect.value}</strong>.</p>
    `;
    return;
  }

  const distText = `<p>Distance = ${resultObj.distance.toFixed(2)} km</p>`;

  if (selectedFunction === "distance") {
    document.getElementById("result").innerHTML = `
      <p>Shortest route by <strong>${selectedAlgorithm}</strong> from 
      <strong>${startSelect.value}</strong> to 
      <strong>${endSelect.value}</strong>:</p>
      ${distText}
      <p>(No path list requested)</p>
    `;
  } else {
    const pathNames = resultObj.path.map(id => idPlace[id]);
    const pathStr = pathNames.join(" → ");
    document.getElementById("result").innerHTML = `
      <p>Route by <strong>${selectedAlgorithm}</strong> from 
      <strong>${startSelect.value}</strong> to 
      <strong>${endSelect.value}</strong>:</p>
      ${distText}
      <p>Path: ${pathStr}</p>
    `;
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("result").innerHTML = "";
});

// --- New event listener for Tarjan's (SCC) algorithm ---
document.getElementById("ScccalculateBtn").addEventListener("click", () => {
  const sccFunctionSelect = document.getElementById("sccFunctionSelect").value;
  if (!sccFunctionSelect) {
    alert("Будь ласка, оберіть функцію пошуку сильної зв'язності!");
    return;
  }
  
  const tarjanGraph = createTarjanGraph(graph);
  
  let sccs = [];
  if (sccFunctionSelect === "tarianAlgorightm") {
    sccs = tarjanAlgorithm(tarjanGraph);
  } else if (sccFunctionSelect === "AlgorightmOfScc") {
    sccs = algorithmCCS(tarjanGraph);
  } else {
    document.getElementById("result").innerHTML = `
      <p>Функція <strong>${sccFunctionSelect}</strong> не реалізована.</p>
    `;
    return;
  }
  
  const resultStr = printSccs(sccs);
  document.getElementById("result").innerHTML = `<pre>${resultStr}</pre>`;
});
