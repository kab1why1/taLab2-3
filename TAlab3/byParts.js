/**
 * @param {Object} graph 
 * @returns {Array<Array<number>>}
 */
function algorithmByPaths(graph) {
    let index = 0;
    const indices = new Map();
    const S = [];
    const P = [];
    const sccs = [];
  
    function dfs(v) {
      indices.set(v.sign, index);
      index++;
      S.push(v);
      P.push(v);
      
      for (const wSign of (graph.neighbourVertices[v.sign] || [])) {
        const w = graph.get(wSign);
        if (!indices.has(w.sign)) {
          dfs(w);
        } else if (S.includes(w)) {
          while (P.length && indices.get(P[P.length - 1].sign) > indices.get(w.sign)) {
            P.pop();
          }
        }
      }
      
      if (P.length && P[P.length - 1] === v) {
        P.pop();
        const component = [];
        let w;
        do {
          w = S.pop();
          component.push(w.sign);
        } while (w !== v);
        sccs.push(component);
      }
    }

    for (const v of graph.vertices) {
      if (!indices.has(v.sign)) {
        dfs(v);
      }
    }
    return sccs;
  }
  
  /**
   * @param {Array<Array<number>>} sccs - Масив компонент.
   * @returns {string} - Форматований рядок.
   */
  function printSccsByPaths(sccs) {
    let result = "";
    sccs.forEach((component, idx) => {
      if (component && component.length > 0) {
        result += `SCC${idx + 1}: ${component.join(", ")}\n`;
      }
    });
    return result;
  }
  
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { algorithmByPaths, printSccsByPaths };
  }
  