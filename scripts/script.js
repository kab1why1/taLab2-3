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
    // (1) Red University
    1: [
      { node: 7, dist: 4.0 },   // 1 <-> 7
      { node: 4, dist: 0.66 }   // 1 <-> 4
    ],
    // (2) St. Andrew's Church
    2: [
      { node: 9, dist: 0.71 },  // 2 <-> 9
      { node: 3, dist: 0.7 },   // 2 -> 3 (односторонній)
      { node: 11, dist: 0.6 }   // 2 <-> 11
    ],
    // (3) St. Michael's Golden-Domed Monastery
    3: [
      { node: 9, dist: 0.65 },  // 3 -> 9 (односторонній)
      { node: 6, dist: 0.6 },   // 3 <-> 6
      { node: 10, dist: 0.75 }  // 3 <-> 10
    ],
    // (4) Golden Gates
    4: [
      { node: 1, dist: 0.66 },  // 4 <-> 1
      { node: 9, dist: 0.44 },  // 4 <-> 9
      { node: 8, dist: 0.8 }    // 4 -> 8 (односторонній)
    ],
    // (5) Lyadski Gate
    5: [
      { node: 3, dist: 0.7 },   // 5 -> 3 (односторонній)
      { node: 10, dist: 0.6 }   // 5 <-> 10
    ],
    // (6) Funicular
    6: [
      { node: 3, dist: 0.6 }    // 6 <-> 3
    ],
    // (7) KPI
    7: [
      { node: 1, dist: 4.0 }    // 7 <-> 1
    ],
    // (8) Fountain on Khreschatyk
    8: [
      // (4)->(8) односторонній, назад немає
    ],
    // (9) The Sophia Cathedral
    9: [
      { node: 4, dist: 0.44 },  // 9 <-> 4
      { node: 2, dist: 0.71 },  // 9 <-> 2
      { node: 5, dist: 0.6 }    // 9 -> 5 (односторонній)
    ],
    // (10) National Philharmonic
    10: [
      { node: 3, dist: 0.75 },  // 10 <-> 3
      { node: 5, dist: 0.6 }    // 10 <-> 5
    ],
    // (11) One street museum
    11: [
      { node: 2, dist: 0.6 },   // 11 <-> 2
      { node: 6, dist: 0.5 }    // 11 -> 6 (односторонній)
    ]
  };
  
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const allSelects = document.getElementsByTagName("select");
    const selectedFunction = allSelects[0].value;
    const selectedAlgorithm = allSelects[1].value;
  
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
  