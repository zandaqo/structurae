const GraphMixin = require('../lib/graph.js');

const UnweightedAdjacencyList = require('../lib/unweighted-adjacency-list');
const UnweightedAdjacencyMatrix = require('../lib/unweighted-adjacency-matrix');
const WeightedAdjacencyListMixin = require('../lib/weighted-adjacency-list');
const WeightedAdjacencyMatrixMixin = require('../lib/weighted-adjacency-matrix');

const Graphs = [
  ['WeightedList', GraphMixin(WeightedAdjacencyListMixin(Int32Array))],
  ['WeightedMatrix', GraphMixin(WeightedAdjacencyMatrixMixin(Int32Array))],
  ['UnweightedList', GraphMixin(UnweightedAdjacencyList)],
  ['UnweightedMatrix', GraphMixin(UnweightedAdjacencyMatrix)],
];

describe('Graph', () => {
  Graphs.forEach((item) => {
    const GraphType = item[0];
    const GraphClass = item[1];
    describe(GraphType, () => {
      let graph;
      beforeEach(() => {
        graph = new GraphClass({ vertices: 6, edges: 12 });
        graph.addEdge(0, 1, 3);
        graph.addEdge(0, 2, 2);
        graph.addEdge(0, 3, 1);
        graph.addEdge(2, 4, 8);
        graph.addEdge(2, 5, 6);
      });

      describe('resetColors', () => {
        it('resets all coloring of vertices done during traversals', () => {
          expect(graph.isBlack(0)).toBe(false);
          expect(graph.isBlack(5)).toBe(false);
          const bfs = [...graph.traverse()];
          expect(graph.isBlack(0)).toBe(true);
          expect(graph.isBlack(5)).toBe(true);
          graph.resetColors();
          expect(graph.isBlack(0)).toBe(false);
          expect(graph.isBlack(5)).toBe(false);
        });
      });

      describe('traverse', () => {
        it('does a Breadth First Search on the graph', () => {
          const bfs = [...graph.traverse()];
          expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
        });

        it('does a Depth First Search on the graph if `isDFS=true`', () => {
          const dfs = [...graph.traverse(true)];
          expect(dfs).toEqual([0, 3, 2, 5, 4, 1]);
        });

        it('yields edging vertices if `white=true`', () => {
          const bfs = [...graph.traverse(false, 0, false, true)];
          expect(bfs).toEqual([1, 2, 3, 4, 5]);
        });

        it('yields fully processed vertices if `black=true`', () => {
          const bfs = [...graph.traverse(false, 0, false, false, true)];
          expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
        });
      });

      describe('path', () => {
        it('finds the shortest path between two vertices', () => {
          const path = graph.path(0, 5);
          expect(path).toEqual([0, 2, 5]);
        });

        it('returns an empty array if no path is found', () => {
          const path = graph.path(3, 5);
          expect(path).toEqual([]);
        });

        if (GraphClass.weighted) {
          it('finds the shortest path between two vertices for DAGs', () => {
            graph.addEdge(3, 5, -1);
            expect(graph.path(0, 5, true)).toEqual([0, 3, 5]);
            expect(graph.path(0, 4, true)).toEqual([0, 2, 4]);
            expect(graph.path(1, 4, true)).toEqual([]);
          });
          it('finds the shortest path between two vertices with non-negative edges', () => {
            graph.addEdge(4, 0, 8);
            expect(graph.path(0, 5, false, true)).toEqual([0, 2, 5]);
            graph.addEdge(1, 5, 1);
            expect(graph.path(0, 5, false, true)).toEqual([0, 1, 5]);
            expect(graph.path(3, 5, false, true)).toEqual([]);
          });
          it('finds the shortest path between two vertices for any graph', () => {
            graph.addEdge(4, 0, 8);
            graph.addEdge(3, 5, -1);
            expect(graph.path(0, 5)).toEqual([0, 3, 5]);
            expect(graph.path(2, 5)).toEqual([2, 5]);
            expect(graph.path(1, 5)).toEqual([]);
          });
        }
      });

      describe('isAcyclic', () => {
        it('checks whether the graph is acyclic', () => {
          expect(graph.isAcyclic()).toBe(true);
          graph.addEdge(1, 0, 1);
          expect(graph.isAcyclic()).toBe(false);
          graph.removeEdge(1, 0);
          expect(graph.isAcyclic()).toBe(true);
          graph.addEdge(5, 0, 1);
          expect(graph.isAcyclic()).toBe(false);
          graph.removeEdge(5, 0);
          expect(graph.isAcyclic()).toBe(true);
          graph.addEdge(5, 3, 1).addEdge(3, 2, 1);
          expect(graph.isAcyclic()).toBe(false);
        });
      });

      describe('topologicalSort', () => {
        it('returns a list of vertices sorted topologically', () => {
          expect(graph.topologicalSort()).toEqual([0, 3, 2, 5, 4, 1]);
        });
      });

      describe('tree', () => {
        it('returns a spanning tree of the graph', () => {
          expect(graph.tree()).toEqual([-1, 0, 0, 0, 2, 2]);
          graph.addEdge(0, 5, 1);
          expect(graph.tree())
            .toEqual(GraphClass.weighted ? [-1, 0, 0, 0, 2, 0] : [-1, 0, 0, 0, 2, 2]);
          graph.addEdge(3, 4, 1);
          expect(graph.tree())
            .toEqual(GraphClass.weighted ? [-1, 0, 0, 0, 3, 0] : [-1, 0, 0, 0, 3, 2]);
          graph.addEdge(5, 2, 2);
          expect(graph.tree())
            .toEqual(GraphClass.weighted ? [-1, 0, 5, 0, 3, 0] : [-1, 0, 0, 0, 3, 2]);
        });
      });
    });
  });
});
