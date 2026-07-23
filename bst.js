class Node {
  constructor(value = null, leftChild = null, rightChild = null) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

class Tree {
  constructor (root = null) {
    this.root = root;
  }

  buildTree(array = [], start = 0, end) {

    if (end === undefined) { 
      // this is for first call scenario so we don't repeat this recursively
      array = [...new Set(array)];
      array.sort((a,b) => a - b);
      end = array.length - 1;
    }
    
    if (start > end) {
      // escape condition
      return null;
    }

    let mid = Math.floor((start + end) / 2);
    let root = new Node(array[mid]); 
    
    root.leftChild = this.buildTree(array, start, mid - 1);
    root.rightChild = this.buildTree(array, mid + 1, end);
    
    // after everything finishes
    return root;
  }

}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
}