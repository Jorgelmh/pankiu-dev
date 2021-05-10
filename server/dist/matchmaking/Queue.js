"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  ==========================
 *      MatchMaking Queues
 *  ==========================
 */
/* FIFO implementation of a queue */
class Queue {
  constructor() {
    /* Start empty queue */
    this.collection = [];
  }
  /* Add new person to the queue */
  queue(person) {
    this.collection.push(person);
  }
  /* Remove first item in the queue */
  dequeue(index) {
    /* Dequeue first element in the queue */
    const person = this.collection.splice(index, 1)[0];
    return person;
  }
  /* Remove person from queue when disconnected or leaves the queue */
  remove(person) {
    const index = this.collection.findIndex(
      (entry) => entry.user.id === person.user.id
    );
    if (index >= 0) {
      this.collection.splice(index, 1);
      return true;
    }
    return false;
  }
  /* Return the size of the queue */
  size() {
    return this.collection.length;
  }
  /* Returns the array */
  getCollection() {
    return this.collection;
  }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map
