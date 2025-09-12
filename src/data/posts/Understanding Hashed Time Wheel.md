---
title: 'Understanding Hashed Time Wheel'
pubDate: 2025-09-13
description: 'A beginner-friendly explanation of the Hashed Time Wheel algorithm for managing timers efficiently.'
image:
    src: 'https://images.unsplash.com/photo-1740058893447-59ad4fbe22ba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    alt: "Musée d'Orsay, Rue de la Légion d'Honneur, Paris, France"
    createdBy: 'goffredo crollalanza'
    creatorLink: 'https://unsplash.com/@goffpix'
tags: ["timers", "algorithms", "en"]
draft: false
---

## Table of Contents

- [Introduction](#introduction)
- [Why Do We Need Hashed Time Wheel?](#why-do-we-need-hashed-time-wheel?)
- [How Does It Work?](#how-does-it-work?)
  - [Example](#example)
- [Implementation](#implementation)
- [Conclusion](#conclusion)

## Introduction

Efficient timer management is critical in networking, scheduling, and distributed systems.  
Traditional approaches often become slow when there are many timers.  
The **Hashed Time Wheel (HTW)** algorithm solves this by providing a simple yet efficient way to manage thousands of timers.


## Why Do We Need Hashed Time Wheel?

- Managing timers with a priority queue (min-heap) can be **O(log n)** for insertion and deletion.  
- In high-performance systems (like Netty or Kafka), we need something closer to **O(1)**.  
- Time wheel algorithms give us this improvement by trading precision for efficiency.


## How Does It Work?

Imagine a clock:
- Each slot in the wheel represents a small time interval (tick).  
- Timers are placed into slots based on their expiration time.  
- When the clock ticks, timers in the current slot are checked and executed.  

If the timer does not fit into the first round, it waits for multiple rotations.

### Example

Suppose:
- Tick = 1 second  
- Wheel size = 8 slots  

If a timer is set for 10 seconds:  
- It goes to slot `(current + 10) % 8 = 2`.  
- But it also remembers it needs **1 full rotation** before execution.

<pre class="mermaid">
pie
    title Time Wheel (8 slots)
    "Slot 0" : 1
    "Slot 1" : 1
    "Slot 2" : 1
    "Slot 3" : 1
    "Slot 4" : 1
    "Slot 5" : 1
    "Slot 6" : 1
    "Slot 7" : 1
</pre>

## Implementation

```typescript
type TimerCallback = () => void;

class Timer {
  rounds: number;
  callback: TimerCallback;

  constructor(rounds: number, callback: TimerCallback) {
    this.rounds = rounds;
    this.callback = callback;
  }
}

class HashedTimeWheel {
  private slots: Timer[][];
  private currentSlot: number = 0;
  private intervalId?: NodeJS.Timeout;

  constructor(
    private tickDuration: number, // in ms
    private wheelSize: number
  ) {
    this.slots = Array.from({ length: wheelSize }, () => []);
  }

  addTimer(delay: number, callback: TimerCallback) {
    const ticks = Math.floor(delay / this.tickDuration);
    const slot = (this.currentSlot + ticks) % this.wheelSize;
    const rounds = Math.floor(ticks / this.wheelSize);

    if (!this.slots[slot]) {
      this.slots[slot] = [];
    }
    this.slots[slot].push(new Timer(rounds, callback));
  }

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      console.log("tick", this.currentSlot);
      const timers = this.slots[this.currentSlot] ?? [];

      for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        if (timer?.rounds === 0) {
          timer?.callback();
          timers.splice(i, 1);
          i--;
        } else {
          timer!.rounds--;
        }
      }

      this.currentSlot = (this.currentSlot + 1) % this.wheelSize;
    }, this.tickDuration);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

// Example usage
const wheel = new HashedTimeWheel(1000, 8); // tick = 1s, 8 slots
wheel.start();

wheel.addTimer(3000, () => console.log("Timer 1 fired after 3s"));
wheel.addTimer(3000, () => console.log("Timer 2 fired after 3s"));

wheel.addTimer(8000, () => console.log("Timer 3 fired after 8s"));

wheel.addTimer(10000, () => console.log("Timer 4 fired after 10s"));

wheel.addTimer(16000, () => console.log("Timer 5 fired after 16s"));
```

We implemented a simple Hashed Time Wheel with 8 slots and a tick duration of 1 second.
Timers are added with different delays, and the wheel executes them when their time comes.

**Output**
```sh
bun run ./index
tick 0
tick 1
tick 2
tick 3
Timer 1 fired after 3s
Timer 2 fired after 3s
tick 4
tick 5
tick 6
tick 7
tick 0
Timer 3 fired after 8s
tick 1
tick 2
Timer 4 fired after 10s
tick 3
tick 4
tick 5
tick 6
tick 7
tick 0
Timer 5 fired after 16s
tick 1
tick 2
tick 3
```

## Conclusion

Hashed Time Wheel is a simple but powerful algorithm.
It makes timer management scalable, which is why it’s widely used in real-world systems.
If you’re building anything that needs to handle thousands of timers, this algorithm is worth learning.