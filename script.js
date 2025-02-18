/**************************************
 * Відповідність назв із select -> ID
 **************************************/
const placeId = {
    "Red Univesity": 1,                    // (1) Червоний університет
    "St. Andrew's Church": 2,              // (2) Андріївська церква
    "St. Michael's Golden-Domed Monastery": 3, // (3) Михайлівський собор
    "Golden Gates": 4,                     // (4) Золоті ворота
    "Lyadski Gate": 5,                     // (5) Лядські ворота
    "Funicular": 6,                        // (6) Фунікулер
    "KPI": 7,                              // (7) Київська політехніка
    "Fountain on Khreschatyk": 8,          // (8) Фонтан на Хрещатику
    "The Sophia Cathedral": 9,             // (9) Софія київська
    "National Philharmonic": 10,           // (10) Національна філармонія
    "One street museum": 11                // (11) Музей однієї вулиці
  };
  
  /*******************************************************
   * Зворотне перетворення: ID -> Назва для зручного виводу
   *******************************************************/
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
  
  /*************************************************************
   * Алгоритм Дейкстри: пошук найкоротшого шляху між двома вершинами
   * Повертає { distance, path } – мінімальна відстань та масив вершин на шляху
   *************************************************************/
  function dijkstra(graph, start, end) {
    // Відстань до кожної вершини (спочатку "нескінченність")
    const distances = {};
    // Відстежуємо, звідки прийшли у вершину (для відновлення шляху)
    const prev = {};
    // Множина відвіданих (з постійною міткою)
    const visited = new Set();
  
    // Ініціалізація
    for (let node in graph) {
      distances[node] = Infinity;
      prev[node] = null;
    }
    distances[start] = 0; // Відстань до старту = 0
  
    // Застосуємо простий варіант: поки не відвідаємо всі вершини
    // або не знайдемо кінцеву вершину
    while (true) {
      // 1. Знаходимо невідвідану вершину з мінімальною відстанню
      let currentNode = null;
      let currentMinDist = Infinity;
  
      for (let node in distances) {
        if (!visited.has(node) && distances[node] < currentMinDist) {
          currentMinDist = distances[node];
          currentNode = node;
        }
      }
  
      // Якщо такої вершини немає (всі відвідані або залишилися недосяжні)
      if (currentNode === null) {
        break;
      }
  
      // Якщо ми дійшли до кінцевої вершини – можна зупинятися
      if (parseInt(currentNode) === end) {
        break;
      }
  
      // 2. Оголошуємо цю вершину відвіданою
      visited.add(currentNode);
  
      // 3. Для всіх "сусідів" поточної вершини оновимо відстані
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
  
    // Відновлюємо шлях, якщо він є
    const path = [];
    let temp = end;
  
    // Якщо відстань до end лишилася Infinity – шляху немає
    if (distances[end] === Infinity) {
      return { distance: Infinity, path: [] };
    }
  
    // Інакше "крутимося" від кінця до початку
    while (temp !== null) {
      path.unshift(temp); // додаємо в початок масиву
      temp = prev[temp];
    }
  
    return {
      distance: distances[end],
      path: path
    };
  }
  
  /***********************************************
   * (Додатково) Шаблон для Floyd-Warshall, якщо треба
   * – можна реалізувати за потреби.
   ***********************************************/
  function floydWarshall() {
    // За бажанням – реалізуйте
    alert("Floyd-Warshall is not implemented in this example.");
  }
  
  /***********************************************
   * Обробник події для кнопки "Calculate"
   ***********************************************/
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const functionSelect = document.getElementById("functionSelect");
    const algoSelect = document.getElementsByTagName("select")[1]; 
    // У вашому html два теги <select> з id=functionSelect, тому
    // для алгоритму беремо другий (або скоригуйте id в HTML)
  
    const startSelect = document.getElementById("startSelect");
    const endSelect = document.getElementById("endSelect");
  
    const selectedFunction = functionSelect.value;      // distance | list
    const selectedAlgorithm = algoSelect.value;         // dijkstra | floydWarshal
    const startNode = placeId[startSelect.value];       // ID старту
    const endNode = placeId[endSelect.value];           // ID фінішу
  
    // Перевірка: якщо startNode == endNode, то відстань = 0, маршрут – одна вершина
    if (startNode === endNode) {
      document.getElementById("result").innerHTML = `
        <p>Start and end points are the same: <strong>${startSelect.value}</strong></p>
        <p>Distance = 0 km</p>
        <p>Path = ${startSelect.value}</p>
      `;
      return;
    }
  
    // Обчислення за вибраним алгоритмом
    let resultObj;
    if (selectedAlgorithm === "dijkstra") {
      resultObj = dijkstra(graph, startNode, endNode);
    } else {
      // Якщо обрано Floyd-Warshall (не реалізовано у прикладі)
      floydWarshall();
      return;
    }
  
    // Якщо шляху немає (Infinity)
    if (resultObj.distance === Infinity) {
      document.getElementById("result").innerHTML = `
        <p>No path found from <strong>${startSelect.value}</strong> 
        to <strong>${endSelect.value}</strong>.</p>
      `;
      return;
    }
  
    // Формуємо вивід
    const distText = `<p>Distance = ${resultObj.distance.toFixed(2)} km</p>`;
  
    // Якщо треба просто відстань
    if (selectedFunction === "distance") {
      document.getElementById("result").innerHTML = `
        <p>Shortest distance (Dijkstra) from 
        <strong>${startSelect.value}</strong> to 
        <strong>${endSelect.value}</strong>:</p>
        ${distText}
      `;
    } 
    // Якщо треба повний маршрут (list)
    else if (selectedFunction === "list") {
      // Перетворюємо ID -> назви
      const pathNames = resultObj.path.map(id => idPlace[id]);
      const pathStr = pathNames.join(" → ");
      document.getElementById("result").innerHTML = `
        <p>Shortest path (Dijkstra) from 
        <strong>${startSelect.value}</strong> to 
        <strong>${endSelect.value}</strong>:</p>
        ${distText}
        <p>Path: ${pathStr}</p>
      `;
    }
  });
  
  /***********************************************
   * Обробник події для кнопки "Reset Result"
   ***********************************************/
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("result").innerHTML = "";
  });
  