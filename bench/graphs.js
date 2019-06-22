const Benchmark = require('benchmark');
const UnweightedAdjacencyMatrix = require('../lib/unweighted-adjacency-matrix');
const WeightedAdjacencyMatrixMixin = require('../lib/weighted-adjacency-matrix');
const UnweightedAdjacencyList = require('../lib/unweighted-adjacency-list');
const WeightedAdjacencyListMixin = require('../lib/weighted-adjacency-list');
const GraphMixin = require('../lib/graph');

const benchmarkOptions = {
  onStart(event) {
    console.log(event.currentTarget.name);
  },
  onCycle(event) {
    console.log(`   ${String(event.target)}`);
  },
  onComplete(event) {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  },
};

const getIndex = size => (Math.random() * size) | 0;

const GraphListUnweighted = GraphMixin(UnweightedAdjacencyList, true);
const GraphListUnweightedDirected = GraphMixin(UnweightedAdjacencyList);
const GraphListWeighted = GraphMixin(WeightedAdjacencyListMixin(Int32Array), true);
const GraphListWeightedDirected = GraphMixin(WeightedAdjacencyListMixin(Int32Array));
const GraphMatrixUnweighted = GraphMixin(UnweightedAdjacencyMatrix, true);
const GraphMatrixUnweightedDirected = GraphMixin(UnweightedAdjacencyMatrix);
const GraphMatrixWeighted = GraphMixin(WeightedAdjacencyMatrixMixin(Int32Array), true);
const GraphMatrixWeightedDirected = GraphMixin(WeightedAdjacencyMatrixMixin(Int32Array));

const SIZE = 100;
const listUnweighted = new GraphListUnweighted({ vertices: SIZE, edges: SIZE * 10 });
const listUnweightedDirected = new GraphListUnweightedDirected({ vertices: SIZE, edges: SIZE * 10 });
const listWeighted = new GraphListWeighted({ vertices: SIZE, edges: SIZE * 10 });
const listWeightedDirected = new GraphListWeightedDirected({ vertices: SIZE, edges: SIZE * 10 });
const matrixUnweighted = new GraphMatrixUnweighted({ vertices: SIZE });
const matrixUnweightedDirected = new GraphMatrixUnweightedDirected({ vertices: SIZE });
const matrixWeighted = new GraphMatrixWeighted({ vertices: SIZE });
const matrixWeightedDirected = new GraphMatrixWeightedDirected({ vertices: SIZE });

const suits = [
  new Benchmark.Suite('Graphs Add/Remove Edges:', benchmarkOptions)
    .add('Unweighted List Undirected', () => {
      for (let i = 0; i < SIZE; i++) {
        if (!listUnweighted.isFull()) listUnweighted.addEdge(getIndex(SIZE), getIndex(SIZE));
        listUnweighted.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Unweighted List Directed', () => {
      for (let i = 0; i < SIZE; i++) {
        if (!listUnweightedDirected.isFull()) {
          listUnweightedDirected.addEdge(getIndex(SIZE), getIndex(SIZE));
        }
        listUnweightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Weighted List Undirected', () => {
      for (let i = 0; i < SIZE; i++) {
        if (!listWeighted.isFull())listWeighted.addEdge(getIndex(SIZE), getIndex(SIZE));
        listWeighted.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Weighted List Directed', () => {
      for (let i = 0; i < SIZE; i++) {
        if (!listWeightedDirected.isFull()) {
          listWeightedDirected.addEdge(getIndex(SIZE), getIndex(SIZE));
        }
        listWeightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Unweighted Matrix Undirected', () => {
      for (let i = 0; i < SIZE; i++) {
        matrixUnweighted.addEdge(getIndex(SIZE), getIndex(SIZE), getIndex(SIZE));
        matrixUnweighted.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Unweighted Matrix Directed', () => {
      for (let i = 0; i < SIZE; i++) {
        matrixUnweightedDirected.addEdge(getIndex(SIZE), getIndex(SIZE), getIndex(SIZE));
        matrixUnweightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Weighted Matrix Undirected', () => {
      for (let i = 0; i < SIZE; i++) {
        matrixWeighted.addEdge(getIndex(SIZE), getIndex(SIZE), getIndex(SIZE));
        matrixWeighted.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    })
    .add('Weighted Matrix Directed', () => {
      for (let i = 0; i < SIZE; i++) {
        matrixWeightedDirected.addEdge(getIndex(SIZE), getIndex(SIZE), getIndex(SIZE));
        matrixWeightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
      }
    }),

  new Benchmark.Suite('Graphs Traverse BFS:', benchmarkOptions)
    .add('Unweighted List', () => {
      const bfs = [...listUnweighted.traverse(false, getIndex(SIZE))];
    })
    .add('Unweighted List Directed', () => {
      const bfs = [...listUnweightedDirected.traverse(false, getIndex(SIZE))];
    })
    .add('Weighted List Undirected', () => {
      const bfs = [...listWeighted.traverse(false, getIndex(SIZE))];
    })
    .add('Weighted List Directed', () => {
      const bfs = [...listWeightedDirected.traverse(false, getIndex(SIZE))];
    })
    .add('Unweighted Matrix Undirected', () => {
      const bfs = [...matrixUnweighted.traverse(false, getIndex(SIZE))];
    })
    .add('Unweighted Matrix Directed', () => {
      const bfs = [...matrixUnweightedDirected.traverse(false, getIndex(SIZE))];
    })
    .add('Weighted Matrix Undirected', () => {
      const bfs = [...matrixWeighted.traverse(false, getIndex(SIZE))];
    })
    .add('Weighted Matrix Directed', () => {
      const bfs = [...matrixWeightedDirected.traverse(false, getIndex(SIZE))];
    }),
];

if (require.main === module) {
  suits.forEach(suite => suite.run());
}

module.exports = {
  suits,
};
