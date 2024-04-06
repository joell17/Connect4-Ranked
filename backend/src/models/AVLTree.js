// Create node
const Node = function (item) {
    this.item = item;
    this.height = 1;
    this.left = null;
    this.right = null;
};

//AVL Tree
const AVLTree = function () {
    let root = null;

    //return height of the node
    this.height = (N) => {
        if (N === null) {
            return 0;
        }

        return N.height;
    };

    this.getRoot = () => {
        return root;
    };

    //right rotate
    this.rightRotate = (y) => {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        return x;
    };

    //left rotate
    this.leftRotate = (x) => {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        return y;
    };

    // get balance factor of a node
    this.getBalanceFactor = (N) => {
        if (N == null) {
            return 0;
        }

        return this.height(N.left) - this.height(N.right);
    };

    // helper function to insert a node
    const insertNodeHelper = (node, item) => {
        // find the position and insert the node
        if (node === null) {
            return new Node(item);
        }

        const compareResult = item.compareTo(node.item);
        if (compareResult < 0) {
            node.left = insertNodeHelper(node.left, item);
        } else if (compareResult > 0) {
            node.right = insertNodeHelper(node.right, item);
        } else {
            return node; // Item already exists, no need to insert
        }

        // update the balance factor of each node
        // and, balance the tree
        node.height =
            1 + Math.max(this.height(node.left), this.height(node.right));

        let balanceFactor = this.getBalanceFactor(node);

        if (balanceFactor > 1) {
            if (item.compareTo(node.left.item) < 0) {
                return this.rightRotate(node);
            } else {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }

        if (balanceFactor < -1) {
            if (item.compareTo(node.right.item) > 0) {
                return this.leftRotate(node);
            } else {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    };

    // insert a node
    this.insertNode = (item) => {
        root = insertNodeHelper(root, item);
    };

    //get node with minimum value
    this.nodeWithMimumValue = (node) => {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    };

    // delete helper
    const deleteNodeHelper = (root, item) => {
        // find the node to be deleted and remove it
        if (root == null) {
            return root;
        }

        const compareResult = item.compareTo(root.item);
        if (compareResult < 0) {
            root.left = deleteNodeHelper(root.left, item);
        } else if (compareResult > 0) {
            root.right = deleteNodeHelper(root.right, item);
        } else {
            // Node with only one child or no child
            if (root.left === null || root.right === null) {
                let temp = root.left ? root.left : root.right;
                // No child case
                if (temp == null) {
                    temp = root;
                    root = null;
                } else {
                    // One child case
                    root = temp; // Copy the contents of the non-empty child
                }
            } else {
                // Node with two children: Get the inorder successor (smallest in the right subtree)
                let temp = this.nodeWithMimumValue(root.right);
                root.item = temp.item;
                root.right = deleteNodeHelper(root.right, temp.item);
            }
        }

        // If the tree had only one node then return
        if (root == null) {
            return root;
        }

        // Update the balance factor of each node and balance the tree
        root.height =
            Math.max(this.height(root.left), this.height(root.right)) + 1;

        let balanceFactor = this.getBalanceFactor(root);

        // Left Left Case
        if (balanceFactor > 1 && this.getBalanceFactor(root.left) >= 0) {
            return this.rightRotate(root);
        }

        // Left Right Case
        if (balanceFactor > 1 && this.getBalanceFactor(root.left) < 0) {
            root.left = this.leftRotate(root.left);
            return this.rightRotate(root);
        }

        // Right Right Case
        if (balanceFactor < -1 && this.getBalanceFactor(root.right) <= 0) {
            return this.leftRotate(root);
        }

        // Right Left Case
        if (balanceFactor < -1 && this.getBalanceFactor(root.right) > 0) {
            root.right = this.rightRotate(root.right);
            return this.leftRotate(root);
        }

        return root;
    };

    //delete a node
    this.deleteNode = (item) => {
        root = deleteNodeHelper(root, item);
    };

    // print the tree in pre - order
    this.preOrder = (callback) => {
        preOrderHelper(root, callback);
    };

    const preOrderHelper = (node, callback) => {
        if (node) {
            callback(node.item);
            preOrderHelper(node.left, callback);
            preOrderHelper(node.right, callback);
        }
    };

    // Inorder traversal of the tree
    this.inOrder = (callback) => {
        inOrderHelper(root, callback);
    };

    const inOrderHelper = (node, callback) => {
        if (node) {
            inOrderHelper(node.left, callback);
            callback(node.item);
            inOrderHelper(node.right, callback);
        }
    };
};

module.exports = AVLTree;
