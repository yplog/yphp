---
title: 'About System Design, Chapter 2'
pubDate: 2025-02-03
description: 'In this second part of the series, I’ll focus on key properties that affect how systems behave: Consistency, Availability, Partition Tolerance, Latency, Durability, Reliability, Fault Tolerance, and Scalability.'
image:
    src: 'https://images.unsplash.com/photo-1556611832-c5f358b0057e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    alt: 'Greenwich Foot Tunnel , London, England'
    createdBy: 'Maria Teneva'
    creatorLink: 'https://unsplash.com/@miteneva'
tags: ['System Design', 'Software Architecture', 'en']
draft: true
---

## Table of Contents

- [Introduction](#introduction)
- [Consistency](#consistency)
    - [Data Consistency](#data-consistency)
- [References](#references)

## Introduction

In the first part of this series, I introduced some fundamental system design concepts. Now, in this second part, I’ll focus on key properties that affect how systems behave: **Consistency**, **Availability**, **Partition Tolerance**, **Latency**, **Durability**, **Reliability**, **Fault Tolerance**, and **Scalability**.

These concepts help us understand how systems handle failures, performance, and growth. I’ll explain each one in a simple way with practical examples. Let’s get started!

## Consistency

Consistency means that a system or data remains correct and aligned with certain rules and expectations at all times.

### Data Consistency

It means that a dataset or database is always in a valid and consistent state.
Example, in an e-commerce site, if a product shows 10 items in stock but goes negative when multiple users buy it, that is an inconsistency.

It is an important part of ACID (*Atomicity*, *Consistency*, *Isolation*, *Durability*), especially in relational databases.
Example, in a banking system, when money is withdrawn from an account, the same amount should be deducted elsewhere. If one part updates but the other does not, it creates an inconsistency.

Okay, what is the ACID?
- **Atomicity**: A single operation is either completed or not at all.
- **Consistency**: The database is always in a valid and consistent state.
- **Isolation**: The operations are independent of each other.
- **Durability**: Once a transaction is committed, it remains in the database even after a system failure.

We don’t need to go deeper into these concepts for now—just knowing what they are is enough.

### Consistency in Distributed Systems

In a system spread across multiple servers or data centers, all nodes must have the same data or update it in a specific way.

They are primarily two types of consistency models that can be used in distributed systems:

- **Strong Consistency**: Ensures that all nodes must have the same data at the same time.
- **Eventual Consistency**: Ensures that all nodes will have the same data, but not immediately.

We get approximately a table like this.

| Feature | Strong Consistency | Eventual Consistency |
| --- | --- | --- |
| Speed | Slower due to synchronization overhead. | Faster because updates propagate asynchronously. |
| Availability | Lower, as system may reject requests during synchronization. | Higher, as updates are accepted without waiting for synchronization. |
| Use Cases | Financial systems, critical applications. | Social media feeds, caching systems. |
| Complexity | More complex due to strict coordination.	 | Simpler and more scalable. |
| Trade-off | More consistent data, but slower operations. | Faster operations, but less consistent data. |

Okay, let's see a diagram to understand this better.

<pre class="mermaid">
graph TD;
    A[n = Total Replicas] -->|Read from r replicas| B(Read Process);
    A -->|Write to w replicas| C(Write Process);
    B --> D{r + w > n ?};
    C --> D;
    D -->|Yes| E(Strong Consistency);
    D -->|No| F(Eventual Consistency);
</pre>

- If **r + w > n**, the system has strong consistency. This is because reading and writing overlap at least in one replica, ensuring that all reads get the latest data.
- If **r + w ≤ n**, the system has eventual consistency. This means the data read might be outdated sometimes, but it will be updated over time.

## References

And further reading:
- [System Design Guide for Software Professionals](https://www.packtpub.com/en-us/product/system-design-guide-for-software-professionals-9781805124993), Dhirendra Sinha, Tejas Chopra
- [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/), Martin Kleppmann
- [Replicated Data Consistency Explained Through Baseball](https://www.microsoft.com/en-us/research/wp-content/uploads/2011/10/ConsistencyAndBaseballReport.pdf), Eric Brewer
