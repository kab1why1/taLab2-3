// tarjan.js

// TarjanGraph class implementing strongly connected components search
class TarjanGraph {
  constructor(v) {
    this.V = v;
    this.adj = new Array(v);
    for (let i = 0; i < v; i++) {
      this.adj[i] = [];
    }
    this.Time = 0;
    this.resultComponents = [];
  }

  addEdge(v, w) {
    this.adj[v].push(w);
  }

  // Recursive function to find SCCs starting from vertex u
  SCCUtil(u, low, disc, stackMember, st) {
    disc[u] = this.Time;
    low[u] = this.Time;
    this.Time++;
    stackMember[u] = true;
    st.push(u);

    for (let n of this.adj[u]) {
      if (disc[n] === -1) {
        this.SCCUtil(n, low, disc, stackMember, st);
        low[u] = Math.min(low[u], low[n]);
      } else if (stackMember[n]) {
        low[u] = Math.min(low[u], disc[n]);
      }
    }

    if (low[u] === disc[u]) {
      let component = [];
      let w = -1;
      while (w !== u) {
        w = st.pop();
        component.push(w);
        stackMember[w] = false;
      }
      this.resultComponents.push(component);
    }
  }

  SCC() {
    let disc = new Array(this.V).fill(-1);
    let low = new Array(this.V).fill(-1);
    let stackMember = new Array(this.V).fill(false);
    let st = [];

    for (let i = 0; i < this.V; i++) {
      if (disc[i] === -1) {
        this.SCCUtil(i, low, disc, stackMember, st);
      }
    }
    return this.resultComponents;
  }
}

// This function converts your project graph (1-indexed)
// to a 0-indexed graph for Tarjan's algorithm, runs it,
// and then outputs the result into the "result" element.
function runTarjan() {
  // Total number of nodes (assuming idPlace has keys 1..11)
  const V = Object.keys(idPlace).length; // 11
  let tg = new TarjanGraph(V);

  // Transform the project graph (global "graph" object) into our TarjanGraph.
  // We subtract 1 from each key and edge to work with 0-indexing.
  for (let key in graph) {
    let u = parseInt(key) - 1;
    let edges = graph[key];
    for (let edge of edges) {
      let v = edge.node - 1;
      tg.addEdge(u, v);
    }
  }

  // Get the list of SCCs (each component is an array of 0-indexed node numbers)
  const sccs = tg.SCC();

  // Build an HTML string with the results, converting back to place names.
  let resultHTML = `<h3>Strongly Connected Components (Tarjan's Algorithm):</h3>`;
  sccs.forEach((component, idx) => {
    // Convert each 0-indexed node back to the 1-indexed id then to a place name.
    let compNames = component.map(index => idPlace[index + 1]);
    resultHTML += `<p>Component ${idx + 1}: ${compNames.join(", ")}</p>`;
  });
  document.getElementById("result").innerHTML = resultHTML;
}

// Attach event listener to the "ScccalculateBtn" button.
document.getElementById("ScccalculateBtn").addEventListener("click", () => {
  // Check that a SCC function is selected
  const sccSelect = document.getElementById("sccFunctionSelect");
  if (!sccSelect.value) {
    alert("Будь ласка, оберіть функцію пошуку сильної зв'язності!");
    return;
  }
  runTarjan();
});
