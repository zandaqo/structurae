const Graph = require('../lib/graph');

describe('Graph', () => {
  describe('DFS', () => {
    it('', () => {
      const graph = new Graph({ size: 6, directed: true, vertices: [0, 1, 2, 3, 4, 5] });
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(0, 3);
      graph.addEdge(2, 4);
      graph.addEdge(2, 5);
      const dfs = [...graph.iterate(true, 0)];
      const bfs = [...graph.iterate(false, 0)];
      expect(dfs).toEqual([0, 3, 2, 5, 4, 1]);
      expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });
});
