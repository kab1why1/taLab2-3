import time
import random
import matplotlib.pyplot as plt

def dijkstra(graph, start, end):
    # Ініціалізація відстаней, попередників та множини відвіданих вершин
    distances = {node: float('inf') for node in graph}
    prev = {node: None for node in graph}
    visited = set()
    distances[start] = 0

    while True:
        current_node = None
        current_min_dist = float('inf')
        
        # Знаходимо невідвідану вершину з мінімальною відстанню
        for node, dist in distances.items():
            if node not in visited and dist < current_min_dist:
                current_min_dist = dist
                current_node = node
        
        if current_node is None:  # всі вершини відвідані або недоступні
            break

        # Якщо досягли цільової вершини – можна завершити пошук
        if current_node == end:
            break
        
        visited.add(current_node)
        
        # Оновлення відстаней для суміжних вершин
        for edge in graph.get(current_node, []):
            neighbor = edge['node']
            weight = edge['dist']
            if neighbor not in visited:
                new_dist = distances[current_node] + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    prev[neighbor] = current_node

    if distances[end] == float('inf'):
        return {'distance': float('inf'), 'path': []}
    
    # Відновлення шляху від кінцевої вершини до початкової
    path = []
    current = end
    while current is not None:
        path.insert(0, current)
        current = prev[current]
    
    return {'distance': distances[end], 'path': path}

def generate_complete_graph(n):
    graph = {}
    for i in range(n):
        graph[i] = []
        for j in range(n):
            if i != j:
                weight = random.uniform(0.1, 1.0)
                graph[i].append({'node': j, 'dist': weight})
    return graph

# Масив розмірів графа (кількість вершин)
n_values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
measured_times = []  # практичний час виконання (середній для кожного n)
iterations = 5       # кількість вимірювань для кожного графа

for n in n_values:
    graph = generate_complete_graph(n)
    total_time = 0.0
    for _ in range(iterations):
        start_time = time.perf_counter()
        # Обчислюємо шлях від вершини 0 до вершини n-1
        dijkstra(graph, 0, n-1)
        end_time = time.perf_counter()
        total_time += (end_time - start_time)
    avg_time = total_time / iterations
    measured_times.append(avg_time)
    print(f"n = {n}, середній час: {avg_time*1000:.5f} мс")

k = measured_times[-1] / (n_values[-1] ** 2)
theoretical_times = [k * n**2 for n in n_values]

# Побудова графіку
plt.figure(figsize=(10, 6))
plt.plot(n_values, [t*1000 for t in measured_times], marker='o', label='Практична (виміряна)')
plt.plot(n_values, [t*1000 for t in theoretical_times], marker='o', linestyle='--', label='Теоретична O(n²)')

plt.xlabel("Кількість вершин (n)")
plt.ylabel("Час виконання (мс)")
plt.title("Порівняння практичної та теоретичної складності алгоритму Дейкстри")
plt.legend()
plt.grid(True)
plt.show()
