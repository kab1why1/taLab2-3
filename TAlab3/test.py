def tarjan_algorithm(graph):
    sccs = []
    not_visited = list(graph.keys())
    visited_all_neighbours = []
    
    while not_visited:
        stack = []
        start = not_visited[0]
        stack.append(start)
        
        while stack:
            vertex = stack[-1]
            neighbours = [v for v in graph.get(vertex, []) if v not in stack and v in not_visited]
            
            if vertex in not_visited:
                not_visited.remove(vertex)
            
            if not neighbours:
                visited_all_neighbours.append(vertex)
                break
            else:
                stack.append(neighbours[0])
        
        sccs.append(list(stack))
    
    return sccs


def print_sccs(sccs):
    output = ""
    for scc in sccs:
        if scc:
            output += ", ".join(scc) + "\n        \n"
    output += "\n"
    return output



def dfs_search(graph, start):
    visited = set()
    order = []
    
    def dfs(v):
        if v not in visited:
            visited.add(v)
            order.append(v)
            for neighbour in graph.get(v, []):
                dfs(neighbour)
    
    dfs(start)
    return order


def transpose(graph):
    transposed = {v: [] for v in graph}
    for v, neighbours in graph.items():
        for neighbour in neighbours:
            transposed.setdefault(neighbour, []).append(v)
    return transposed


def algorithm_ccs(graph):
    start = list(graph.keys())[0]
    sccs1 = {start: dfs_search(graph, start)}
    
    transposed = transpose(graph)
    sccs2 = {start: dfs_search(transposed, start)}

    return tarjan_algorithm(graph)


graph = {
    'A': ['B'],                     # 1
    'B': ['A', 'C'],                # 2
    'C': ['D', 'B', 'E'],           # 3
    'D': ['C', 'F', 'G', 'I'],      # 4
    'F': ['E', 'K', 'J'],           # 5
    'G': ['D', 'J', 'I', 'H'],      # 6 
    'H': ['G', 'I'],                # 7
    'I': ['G', 'J', 'D'],           # 8
    'J': ['K', 'I', 'D'],           # 9
    'K': ['F'],                     # 10
    'E': ['F'],                     # 11 
}


if __name__ == "__main__":
    sccs = tarjan_algorithm(graph)
    print("Strongly Connected Components:")
    print(print_sccs(sccs))
