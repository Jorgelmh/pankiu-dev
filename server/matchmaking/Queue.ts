import { Language } from "../interfaces/QueueParam/Language";
import { PersonSearch } from "../interfaces/search/PersonSearch";
/**
 *  ==========================
 *      MatchMaking Queues
 *  ==========================
 */

/* FIFO implementation of a queue */
export default class Queue<Type extends PersonSearch> {
  /* Data structure to store entries */
  protected collection: Type[];

  constructor() {
    /* Start empty queue */
    this.collection = [];
  }

  /* Add new person to the queue */
  public queue(person: Type): void {
    this.collection.push(person);
  }

  /* Remove first item in the queue */
  public dequeue(index: number): Type {
    /* Dequeue first element in the queue */
    const person = this.collection.splice(index, 1)[0];
    return person;
  }

  /* Remove person from queue when disconnected or leaves the queue */
  public remove(person: PersonSearch): boolean {
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
  public size(): number {
    return this.collection.length;
  }

  /* Returns the array */
  public getCollection(): Type[] {
    return this.collection;
  }
}
