import time
import random
import matplotlib.pyplot as plt
import sys

# Збільшуємо ліміт рекурсії, щоб уникнути помилок для більших графів
sys.setrecursionlimit(10000)

def terriAlgorithm(graph, start, end):
    """
    Алгоритм знаходження найкоротшого шляху за допомогою DFS з урахуванням унікальності ребер.
    graph: словник, де ключ — вершина, а значення — список ребер (словники з 'node' та 'dist')
    start: початкова вершина
    end: кінцева вершина
    Повертає словник з ключами 'distance' та 'path'.
    """
    bestDistance = float('inf')
    bestPath = None

    def dfs(current, currentDistance, path, usedEdges):
        nonlocal bestDistance, bestPath
        # Якщо досягли кінцевої вершини — перевіряємо чи це найкращий шлях
        if current == end:
            if currentDistance < bestDistance:
                bestDistance = currentDistance
                bestPath = path.copy()
            return

        # Якщо поточна відстань уже перевищує найкращу знайдену, виходимо
        if currentDistance >= bestDistance:
            return

        for edge in graph.get(current, []):
            neighbor = edge['node']
            d = edge['dist']
            edgeKey = f"{current}->{neighbor}"
            if edgeKey not in usedEdges:
                usedEdges.add(edgeKey)
                path.append(neighbor)
                dfs(neighbor, currentDistance + d, path, usedEdges)
                path.pop()
                usedEdges.remove(edgeKey)

    dfs(start, 0, [start], set())
    if bestDistance == float('inf'):
        return {'distance': float('inf'), 'path': []}
    return {'distance': bestDistance, 'path': bestPath}

def generate_graph(n):
    """
    Генерує орієнтований ациклічний граф із n вершин.
    Спочатку створюється остовне дерево (n-1 ребро), потім додається кілька додаткових ребер (~ n//2),
    щоб загальна кількість ребер залишалась лінійною відносно n.
    """
    graph = {i: [] for i in range(n)}
    
    # Створюємо остовне дерево: для кожної вершини від 1 до n-1 вибираємо випадкового батька з 0..(i-1)
    for i in range(1, n):
        parent = random.randint(0, i - 1)
        dist = random.randint(1, 10)
        graph[parent].append({'node': i, 'dist': dist})
    
    # Додаємо додаткові ребра (~ n//2 ребер)
    extra_edges = n // 2
    for _ in range(extra_edges):
        i = random.randint(0, n - 2)
        j = random.randint(i + 1, n - 1)
        dist = random.randint(1, 10)
        graph[i].append({'node': j, 'dist': dist})
    
    return graph

if __name__ == '__main__':
    # Масив розмірів графа (кількість вершин)
    sizes = list(range(50, 501, 50))
    measured_times = []  # Часи виконання алгоритму (в секундах)
    theoretical_ops = [] # Оцінка кількості операцій (n + m) для кожного графа

    # Для кожного розміру графа генеруємо граф, заміряємо час виконання алгоритму
    for n in sizes:
        graph = generate_graph(n)
        # Підрахунок загальної кількості ребер
        m = sum(len(edges) for edges in graph.values())
        
        start_time = time.perf_counter()
        result = terriAlgorithm(graph, 0, n - 1)
        end_time = time.perf_counter()
        
        elapsed = end_time - start_time
        measured_times.append(elapsed)
        theoretical_ops.append(n + m)  # Операцій ~ n + m
        
        print(f"n = {n}, m = {m}, Time = {elapsed:.6f} s, Result = {result}")

    # Нормалізація теоретичних операцій до часу: підбираємо коефіцієнт за першою точкою
    scale = measured_times[0] / theoretical_ops[0]
    theoretical_times = [scale * op for op in theoretical_ops]

    # Побудова графіка
    plt.figure(figsize=(8, 6))
    plt.plot(sizes, measured_times, label='Практичний час (сек)', marker='o')
    plt.plot(sizes, theoretical_times, label='Теоретична складність (scaled)', marker='x')
    plt.xlabel('Кількість вершин (n)')
    plt.ylabel('Час (секунди)')
    plt.title('Порівняння практичного та теоретичного часу роботи terriAlgorithm')
    plt.legend()
    plt.grid(True)
    plt.show()
