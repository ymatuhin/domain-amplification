export class Queue {
  size: number = 30;
  handling: boolean = false;
  tasks: Function[] = [];
  microtasks: Function[] = [];

  addTask(task: Function) {
    this.tasks.push(task);
    requestIdleCallback(this.handle.bind(this));
  }

  addMicroTask(task: Function) {
    this.microtasks.push(task);
    setTimeout(this.handle.bind(this));
  }

  handle() {
    if (this.handling) return;
    const micros = this.microtasks.splice(0, this.size);
    const rest = this.tasks.splice(0, this.size - micros.length);
    const all = micros.concat(rest);
    if (all.length === 0) return;

    all.forEach((handler) => handler());
    this.handling = false;

    const noTimeOut = micros.length === this.size || all.length < this.size;
    if (noTimeOut) this.handle();
    else setTimeout(() => this.handle());
  }
}
