class MinHeap {
	constructor() {
			this.heap = [];
	}

	getParentIndex(i) { return Math.floor((i - 1) / 2); }
	getLeftChildIndex(i) { return 2 * i + 1; }
	getRightChildIndex(i) { return 2 * i + 2; }

	cost(i) { return this.heap[i][0]; }

	swap(i1, i2) {
			[this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
	}

	peek() {
			return this.heap.length === 0 ? null : this.heap[0];
	}

	push(cost, tileId) {
			this.heap.push([cost, tileId]);
			this.heapifyUp();
	}

	heapifyUp() {
			let index = this.heap.length - 1;
			while (index > 0 && this.cost(index) < this.cost(this.getParentIndex(index))) {
					this.swap(index, this.getParentIndex(index));
					index = this.getParentIndex(index);
			}
	}

	pop() {
			if (this.heap.length === 0) return null;
			if (this.heap.length === 1) return this.heap.pop();
			const item = this.heap[0];
			this.heap[0] = this.heap.pop();
			this.heapifyDown();
			return item;
	}

	heapifyDown() {
			let index = 0;
			while (this.getLeftChildIndex(index) < this.heap.length) {
					let smallerChildIndex = this.getLeftChildIndex(index);
					const rightChildIndex = this.getRightChildIndex(index);
					if (rightChildIndex < this.heap.length && this.cost(rightChildIndex) < this.cost(smallerChildIndex)) {
							smallerChildIndex = rightChildIndex;
					}
					if (this.cost(index) < this.cost(smallerChildIndex)) {
							break;
					} else {
							this.swap(index, smallerChildIndex);
					}
					index = smallerChildIndex;
			}
	}
}

if (typeof module !== 'undefined' && module.exports) {
module.exports = MinHeap;
}
