import sys
import time
import random
import matplotlib.pyplot as plt

sys.setrecursionlimit(10000)

def tarjan_algorithm(graph):
    index = 0
    indices = {} 
    lowlink = {}  
    stack = []      
    on_stack = {}   
    sccs = []       

    def strong_connect(v):
        nonlocal index
        indices[v] = index
        lowlink[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True

        for w in graph.get(v, []):
            if w not in indices:
                strong_connect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack.get(w, False):
                lowlink[v] = min(lowlink[v], indices[w])
        
        if lowlink[v] == indices[v]:
            component = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                component.append(w)
                if w == v:
                    break
            sccs.append(component)

    for v in graph:
        if v not in indices:
            strong_connect(v)
    return sccs

def generate_directed_graph(n):
    graph = {i: [] for i in range(n)}
    for i in range(n - 1):
        graph[i].append(i + 1)

    extra_edges = n // 2
    for _ in range(extra_edges):
        i = random.randint(0, n - 1)
        j = random.randint(0, n - 1)
        if i != j and j not in graph[i]:
            graph[i].append(j)
    
    return graph

if __name__ == '__main__':
    sizes = list(range(50, 501, 50))
    measured_times = [] 
    theoretical_times = []
    
    scale = None
    
    for n in sizes:
        graph = generate_directed_graph(n)
        m = sum(len(neighbours) for neighbours in graph.values())
        ops = n + m
        
        start_time = time.perf_counter()
        sccs = tarjan_algorithm(graph)
        end_time = time.perf_counter()
        
        elapsed = end_time - start_time
        measured_times.append(elapsed)
        
        if scale is None:
            scale = elapsed / ops  # масштабування на першій точці
        theoretical_times.append(scale * ops)
        
        print(f"n = {n}, ребер = {m}, Time = {elapsed:.6f} s, К-ть компонент = {len(sccs)}")
    
    plt.figure(figsize=(8, 6))
    plt.plot(sizes, measured_times, label='Практичний час (сек)', marker='o')
    plt.plot(sizes, theoretical_times, label='Теоретична складність O(V+E)', marker='x')
    plt.xlabel('Кількість вершин (n)')
    plt.ylabel('Час (секунди)')
    plt.title("Порівняння практичного та теоретичного часу роботи Алгоритму Тар'яна")
    plt.legend()
    plt.grid(True)
    plt.show()
