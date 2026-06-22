/**
 * B+Tree challenge — skeleton.
 *
 * Implement the 7 phases in order. Test each phase before moving to the next.
 *
 *   Phase 1: print() — visualize the tree
 *   Phase 2: search(key)
 *   Phase 3: insert without splits
 *   Phase 4: insert with leaf split
 *   Phase 5: insert with internal node split
 *   Phase 6: insert with root split (height grows)
 *   Phase 7: rangeScan(low, high)
 *
 * Conventions used here:
 *   - `order` = max number of children an internal node can have.
 *   - A leaf can hold up to (order - 1) entries before it must split.
 *   - All data (key, value) lives ONLY in leaves.
 *   - Internal nodes hold separator keys + child pointers only.
 *   - Leaves are linked together via `next` to support range scans.
 *   - On leaf split: smallest key of right half is COPIED up.
 *   - On internal split: median key MOVES up (not copied).
 */

class BPlusNode {
  constructor({ isLeaf = false, order }) {
    this.isLeaf = isLeaf;
    this.order = order;

    this.keys = [];
    this.children = [];  // internal nodes only — array of BPlusNode
    this.values = [];    // leaves only — values aligned with keys
    this.next = null;    // leaves only — pointer to next leaf
    this.parent = null;  // optional; you can omit if you prefer recursion
  }

  isOverflow() {
    return this.isLeaf
      ? this.keys.length > this.order - 1
      : this.children.length > this.order;
  }
}

class BPlusTree {
  constructor(order = 4) {
    if (order < 3) throw new Error('order must be >= 3');
    this.order = order;
    this.root = new BPlusNode({ isLeaf: true, order });
  }

  /**
   * Phase 2 — exact-match search.
   * Returns the value for `key`, or null if not found.
   *
   * Algorithm:
   *   1. Start at root.
   *   2. While current node is internal, find which child the key belongs to
   *      and descend.
   *   3. At the leaf, search for the key in the keys array.
   */
  search(key) {
    // TODO
  }

  /**
   * Phases 3-6 — insert (key, value).
   *
   * Phase 3: navigate to the correct leaf and insert at the sorted position.
   *          Assume no overflow.
   * Phase 4: when the leaf overflows, split it. Copy the smallest key of the
   *          right half up to the parent. Maintain the `next` linked list.
   * Phase 5: when promotion overflows an internal node, split it too. Move
   *          the median key up (do not copy).
   * Phase 6: when the root overflows, create a brand-new root containing
   *          one separator. This is the only place the tree grows in height.
   */
  insert(key, value) {
    // TODO
  }

  /**
   * Phase 7 — range scan.
   * Returns an array of [key, value] pairs where low <= key <= high.
   *
   * Algorithm:
   *   1. Walk down to the leaf where `low` would live.
   *   2. Walk forward through leaves via `next`, collecting matching entries.
   *   3. Stop as soon as a key > high.
   */
  rangeScan(low, high) {
    // TODO
  }

  /**
   * Phase 1 — pretty-print the tree level by level.
   * You'll use this constantly while debugging. Suggested format:
   *
   *   L0: [30 | 60]
   *   L1: [10, 20] [30, 40, 50] [60, 70]
   *
   * BFS through the tree, grouping nodes by depth.
   */
  print() {
    // TODO
  }

  // ---- Helpers you'll probably want ----

  /**
   * Walk from root to the leaf where `key` should live.
   * Useful in both search() and insert().
   */
  _findLeaf(key) {
    // TODO
  }
}

module.exports = { BPlusTree, BPlusNode };

// ---- Quick smoke test (uncomment to run) ----
//
// const t = new BPlusTree(4);
// for (const k of [10, 20, 30, 40, 50, 60, 70]) t.insert(k, `v${k}`);
// t.print();
// console.log('search 40:', t.search(40));        // expect 'v40'
// console.log('search 99:', t.search(99));        // expect null
// console.log('range 25..65:', t.rangeScan(25, 65));
// // expect [[30,'v30'],[40,'v40'],[50,'v50'],[60,'v60']]
