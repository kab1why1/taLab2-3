import time
import random
import matplotlib.pyplot as plt

class Vertex:
    def __init__(self, sign):
        self.sign = sign

class Graph:
    def __init__(self):
        self.vertices = []
        self.neighbour_vertices = {}
        self.vertices_dict = {}

    def add_vertex(self, sign):
        if sign not in self.vertices_dict:
            vertex = Vertex(sign)
            self.vertices.append(vertex)
            self.vertices_dict[sign] = vertex
            self.neighbour_vertices[sign] = []

    def add_edge(self, from_sign, to_sign):
        self.add_vertex(from_sign)
        self.add_vertex(to_sign)
        if to_sign not in self.neighbour_vertices[from_sign]:
            self.neighbour_vertices[from_sign].append(to_sign)

    def get(self, sign):
        return self.vertices_dict.get(sign)

def algorithm_by_paths(graph: Graph):
    index = 0
    indices = {}
    S = []
    P = []
    sccs = []

    def dfs(v: Vertex):
        nonlocal index
        indices[v.sign] = index
        index += 1
        S.append(v)
        P.append(v)

        for w_sign in graph.neighbour_vertices.get(v.sign, []):
            w = graph.get(w_sign)
            if w.sign not in indices:
                dfs(w)
            elif w in S:
                while P and indices[P[-1].sign] > indices[w.sign]:
                    P.pop()
        if P and P[-1] == v:
            P.pop()
            component = []
            while True:
                w = S.pop()
                component.append(w.sign)
                if w == v:
                    break
            sccs.append(component)

    for v in graph.vertices:
        if v.sign not in indices:
            dfs(v)
    return sccs

def generate_directed_graph(n):
    g = Graph()
    for i in range(n):
        g.add_vertex(i)
    for i in range(n - 1):
        g.add_edge(i, i + 1)
    extra_edges = n // 2
    for _ in range(extra_edges):
        i = random.randint(0, n - 1)
        j = random.randint(0, n - 1)
        if i != j:
            g.add_edge(i, j)
    return g

if __name__ == '__main__':
    sizes = list(range(50, 501, 50))
    measured_times = []
    theoretical_times = []
    
    scale_values = []
    
    for n in sizes:
        runs = 30 if n < 400 else 100  # Більше запусків для великих графів
        total_time = 0.0
        total_edges = 0
        
        for _ in range(runs):
            graph = generate_directed_graph(n)
            m = sum(len(neighbours) for neighbours in graph.neighbour_vertices.values())
            total_edges += m
            ops = n + m
            
            start_time = time.perf_counter()
            _ = algorithm_by_paths(graph)
            end_time = time.perf_counter()
            
            total_time += (end_time - start_time)
        
        avg_time = total_time / runs
        avg_edges = total_edges / runs
        ops = n + avg_edges
        
        measured_times.append(avg_time)
        scale_values.append(avg_time / ops)
        
        print(f"n = {n}, середнє ребер = {avg_edges:.1f}, середній час = {avg_time:.6f} s")

    # Використовуємо середній масштаб для останніх 4-5 точок
    scale = sum(scale_values[-5:]) / len(scale_values[-5:])
    
    for n, avg_edges in zip(sizes, [ (n + n//2) for n in sizes ]):
        ops = n + avg_edges
        theoretical_times.append(scale * ops)
    
    plt.figure(figsize=(8, 6))
    plt.plot(sizes, measured_times, label='Практичний час (сек)', marker='o')
    plt.plot(sizes, theoretical_times, label='Теоретична складність O(V+E)', marker='x')
    plt.xlabel('Кількість вершин (n)')
    plt.ylabel('Час (секунди)')
    plt.title("Порівняння практичного та теоретичного часу роботи Алгоритм компонент сильної зв'язності по шляхах")
    plt.legend()
    plt.grid(True)
    plt.show()
