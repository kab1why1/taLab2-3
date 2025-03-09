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

// Граф для алгоритмів маршруту (Dijkstra, Terri)
// (залишаємо без змін)
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
  8: [],
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

// Обробка подій для розрахунку маршруту та інших алгоритмів (залишаємо існуючу логіку)
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



document.getElementById("ScccalculateBtn").addEventListener("click", () => {
  // Створюємо приклад графа з числовими позначеннями, що формує 2 SCC:
  //
  // SCC1: 8 → 5 → 9 → 4 → 1 → 7 → (повернення до 8)
  // SCC2: 10 → 3 → 6 → 11 → 2 → (повернення до 10)
  const graphObj = {
    vertices: [
      { sign: 8 },
      { sign: 5 },
      { sign: 9 },
      { sign: 4 },
      { sign: 1 },
      { sign: 7 },
      { sign: 10 },
      { sign: 3 },
      { sign: 6 },
      { sign: 11 },
      { sign: 2 }
    ],
    neighbourVertices: {
      "8": [5],
      "5": [9],
      "9": [4],
      "4": [1],
      "1": [7],
      "7": [8],
      "10": [3],
      "3": [6],
      "6": [11],
      "11": [2],
      "2": [10]
    },
    get(sign) {
      return this.vertices.find(v => v.sign === sign);
    }
  };

  const sccFuncSelect = document.getElementById("sccFunctionSelect").value;
  let sccs;
  if (sccFuncSelect === "tarianAlgorightm") {
    sccs = tarjanAlgorithm(graphObj);
    var resultStr = printSccs(sccs) + "tarjan was used.";
  } else if (sccFuncSelect === "AlgorightmOfScc") {
    sccs = algorithmByPaths(graphObj);
    var resultStr = printSccsByPaths(sccs) + "byParts was used";
  } else {
    resultStr = "Не обрано алгоритм для пошуку SCC.";
  }
  document.getElementById("result").innerHTML = `<pre>${resultStr}</pre>`;
});


