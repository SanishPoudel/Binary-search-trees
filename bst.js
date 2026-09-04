class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
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
    
    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);
    
    // after everything finishes
    this.root = root;
    return root;
  }

    includes(value) {
    let curr = this.root;
    
    while (curr) {
      if (curr.data === value) {
        return true;
      }

      if (value < curr.data) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return false;    
  }    

  insert(value) {
    let leaf = new Node(value);
    let curr = this.root;

    if (!this.root) { 
      this.root = leaf;
      return;
    }

    let prev = null;
    while (curr) {
      prev = curr;

      if (curr.data === value) {
        return;
      }
      else if (curr.data < value) {
        curr = curr.right;
      } else {
        curr = curr.left;
      }
    }

    if (prev.data < value) {
      prev.right = leaf;
    } else {
      prev.left = leaf;
    }
  }

  deleteItem(value) {
    let curr = this.root;
    let prev = null;
    
    while (curr) {
      if (curr.data === value) {
        // here it finds the value but now i need to delete it based on its children

        // if the root is the leaf and has no children
          if (curr === this.root) {
            this.root = null;
            return;
          }

        // no child case
        if (curr.left === null && curr.right === null) 
        {
          // if the value is not root
          if (prev.data < curr.data) {
            prev.right = null;
          } else {
            prev.left = null;
          }
          return;
        }

        // one child case
        else if (curr.left === null || curr.right === null) 
        {
          let tmpValue = (curr.left || curr.right);
          if (prev.data > curr.data) {
            prev.left = tmpValue;
            return;
          } else {
            prev.right = tmpValue;
            return;
          }
        }

        // two or more child case
        else 
        {
          let head = curr;
          prev = head;
          curr = curr.right;
          while (curr !== null && curr.left !== null) {
            prev = curr;
            curr = curr.left;
          }
          let successor = curr;
          let tmp = head.data;
          head.data = successor.data;
          successor.data = tmp;
          
          if (prev === head) {
            prev.right = successor.right;
            return;
          }
          prev.left = successor.right;
          return;
        }

      }

      prev = curr;
      if (value < curr.data) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
  }

  levelOrderForEach(callback) {
    if (typeof callback != "function") {
      throw new Error("Callback function is required");
    }
    let queue = [];
    if (this.root === null) {
      return;
    }

    queue.push(this.root);
    while (queue.length != 0) {
      let value = queue.shift();
      callback(value.data);
      if (value.left) {
        queue.push(value.left);
      }
      if (value.right) {
        queue.push(value.right);
      }
    }
  }

  preOrderForEach(callback, node = this.root) {
    if (typeof callback != "function") {
      throw new Error("Why no callback function?");
    }

    if (!node) {
      return;
    }

    callback(node.data);
    if (node.left) {
      this.preOrderForEach(callback, node.left);
    }
    if (node.right) {
      this.preOrderForEach(callback, node.right)
    }
  }

  inOrderForEach(callback, node = this.root) {
    if (typeof callback != "function") {
      throw new Error("Callback must be function");
    }

    if (!node) {
      return;
    }

    if (node.left) {
      this.inOrderForEach(callback, node.left);
    }

    callback(node.data);

    if (node.right) {
      this.inOrderForEach(callback, node.right);
    }
  }

  postOrderForEach(callback, node = this.root) {
    if (typeof callback != "function") {
      throw new Error("You forgot the callback function.")
    }

    if (!node) {
      return;
    }

    if (node.left) {
      this.postOrderForEach(callback, node.left);
    }

    if (node.right) {
      this.postOrderForEach(callback, node.right);
    }

    callback(node.data);
  }

  height(value) {
    let curr = this.root;
    
    while (curr) {
      if (curr.data === value) {

        let queue = [];
        let level = 0

        queue.push({curr, level});
        let result;

        while (queue.length != 0) {
          result = queue.shift();
          
          if (!result.curr.left && !result.curr.right) {
            return result.level;
          }

          if (result.curr.left) {

            let pair = {
              curr: result.curr.left,
              level: result.level +1
            };
            queue.push(pair);

          }
          if (result.curr.right) {

            let pair = {
              curr: result.curr.right, 
              level: result.level + 1
            };
            queue.push(pair);

          }
        }
      }

      if (value < curr.data) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return undefined; 
  }

  depth(value) {
    let curr = this.root;
    let count = 0;
    
    while (curr) {
      if (curr.data === value) {
        return count;
      }

      if (value < curr.data) {
        curr = curr.left;
        count ++;
      } else {
        curr = curr.right;
        count ++;
      }
    }
    return undefined; 
  }

  isBalanced(curr = this.root) {
    if (!curr) {
      return {
        balanced: true,
        height: 0
      };
    }
    let left = this.isBalanced(curr.left);
    if (!left.balanced) {
      return {balanced: false};
    }

    let right = this.isBalanced(curr.right);
    if (!right.balanced) {
      return {balanced: false};
    }

    let diff = Math.abs(left.height - right.height);
    if (diff > 1) {
      return {balanced: false}
    }

    return {
      balanced: true,
      height: Math.max(left.height, right.height) + 1
    };
  }

  rebalance() {
    let arr = [];
    this.levelOrderForEach(function list(item) {
      arr.push(item);
    });
    this.buildTree(arr);
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

let tree = new Tree();
tree.buildTree([1,2]);
prettyPrint(tree.root);
console.log(tree.deleteItem(1));
prettyPrint(tree.root);