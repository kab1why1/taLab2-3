/**
 * @param {Object} graph
 * @returns {Array<Array<number>>} 
 */
function tarjanAlgorithm(graph) {
  let index = 0;
  const indices = {};    
  const lowlink = {};    
  const stack = [];     
  const onStack = {};    
  const sccs = [];      

  /**
   * @param {Object} vertex - Вершина графа.
   */
  function strongConnect(vertex) {
    const vSign = vertex.sign;
    indices[vSign] = index;
    lowlink[vSign] = index;
    index++;
    stack.push(vertex);
    onStack[vSign] = true;

    const neighbours = graph.neighbourVertices[vSign] || [];
    neighbours.forEach(nSign => {
      const neighbourVertex = graph.get(nSign);
      if (indices[nSign] === undefined) {
        // Сусід ще не відвіданий — запускаємо рекурсивний виклик
        strongConnect(neighbourVertex);
        lowlink[vSign] = Math.min(lowlink[vSign], lowlink[nSign]);
      } else if (onStack[nSign]) {
        // Сусід знаходиться в стеку — оновлюємо lowlink поточної вершини
        lowlink[vSign] = Math.min(lowlink[vSign], indices[nSign]);
      }
    });

    if (lowlink[vSign] === indices[vSign]) {
      const component = [];
      let w;
      do {
        w = stack.pop();
        onStack[w.sign] = false;
        component.push(w.sign);
      } while (w.sign !== vSign);
      sccs.push(component);
    }
  }

  graph.vertices.forEach(vertex => {
    if (indices[vertex.sign] === undefined) {
      strongConnect(vertex);
    }
  });

  return sccs;
}

/**
 * @param {Object} graph - Об'єкт графа.
 * @returns {Array<Array<number>>} - Масив компонент.
 */
function algorithmCCS(graph) {
  return tarjanAlgorithm(graph);
}

/**
 * @param {Array<Array<number>>} sccs - Масив компонент (масив масивів чисел).
 * @returns {string} - Форматований рядок для виводу.
 */
function printSccs(sccs) {
  let result = "";
  sccs.forEach((component, idx) => {
    if (component && component.length > 0) {
      result += `SCC${idx + 1}: ${component.join(", ")}\n`;
    }
  });
  return result;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { tarjanAlgorithm, algorithmCCS, printSccs };
}
