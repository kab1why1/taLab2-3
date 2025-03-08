// tarjan.js

/**
 * @param {Object} graph - Об'єкт графа.
 * @returns {Array<Array<number>>} - Масив компонент, де кожна компонента – масив чисел.
 */
function tarjanAlgorithm(graph) {
    const sccs = [];
    const notVisited = graph.vertices.map(v => v.sign);
    while (notVisited.length > 0) {
      const stack = [];
      const firstSign = notVisited[0];
      stack.push(graph.get(firstSign));
  
      while (stack.length > 0) {
        const vertex = stack[stack.length - 1];
        const neighbours = (graph.neighbourVertices[vertex.sign] || []).filter(vSign => {
          const inStack = stack.some(item => item.sign === vSign);
          return !inStack && notVisited.includes(vSign);
        });
        
        const idx = notVisited.indexOf(vertex.sign);
        if (idx !== -1) {
          notVisited.splice(idx, 1);
        }
        
        if (neighbours.length === 0) {
          break;
        } else {
          stack.push(graph.get(neighbours[0]));
        }
      }
      const component = stack.map(v => v.sign);
      sccs.push(component);
    }
    
    return sccs;
  }
  
  /**
   * Метод, що викликає алгоритм Тар'яна для пошуку компонент сильної зв’язності.
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
  