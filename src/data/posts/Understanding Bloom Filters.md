---
title: 'Understanding Bloom Filters'
pubDate: 2025-06-29
description: 'Bloom filters: what they are, how they work, and how we can implement and use them in real systems.'
image:
    src: "https://images.unsplash.com/photo-1577694211890-0d02619e030a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt: "Ghost"
    createdBy: "Bertrand Colombo"
    creatorLink: "https://unsplash.com/@beberinho"
tags: ["Bloom Filters", "System Design", "en"]
draft: false
---

## Table of Contents
- [Introduction](#introduction)
- [What is a Bloom Filter?](#what-is-a-bloom-filter)
- [How Does It Work?](#how-does-it-work)
  - [Why Multiple Hash Functions?](#why-multiple-hash-functions)
- [Example Implementation Go](#example-implementation-go)
- [Using Bloom Filters with Redis Stack](#using-bloom-filters-with-redis-stack)
  - [What is Redis Stack?](#what-is-redis-stack)
  - [Installing Redis Stack](#installing-redis-stack)
  - [Basic Usage](#basic-usage)
  - [Why Use Redis Stack for Bloom Filters?](#why-use-redis-stack-for-bloom-filters)
- [Using Bloom Filter in Go with Redis Stack](#using-bloom-filter-in-go-with-redis-stack)
- [Conclusion](#conclusion)


## Introduction

Recently, while studying the Design a URL Shortener problem in System Design Interview, I came across Bloom filters again.
I remembered how useful they are for checking whether an item exists in a set quickly and with very little memory.

I thought it would be a good idea to write about Bloom filters: what they are, how they work, and how we can implement and use them in real systems.

This made me think about why Bloom filters are so popular in system design problems, so I decided to take a deeper look and share what I learned.

Have you ever needed to check if an item exists in a large set, but wanted to do it quickly and using very little memory?
Bloom filters are data structures that help you do exactly that. They can tell you if an item is definitely not in the set or maybe in the set, with very little memory usage and high speed.

In this post, we will:
- Understand how Bloom filters work.
- Implement a simple Bloom filter in code.
- See how Redis uses Bloom filters in production systems.

## What is a Bloom Filter?

A Bloom filter is a **probabilistic**(_it can give you results that are probably correct, but not always guaranteed._) data structure.
It allows you to check for membership in a set, but it has a small chance of false positives.

This means:
- If it says “no”, the item is definitely not in the set.
- If it says “yes”, the item might be in the set.


Here is a simple diagram showing how a Bloom filter works between a client and storage:

<pre class="mermaid">
sequenceDiagram
    participant Client
    participant Filter
    participant Storage

    Client->>Filter: Do you have 'key1'?
    Filter-->>Client: No

    Client->>Filter: Do you have 'key2'?
    Filter-->>Client: Yes
    Client->>Storage: Do you have 'key2'?
    Storage-->>Client: Yes, here is key2

    Client->>Filter: Do you have 'key3'?
    Filter-->>Client: Yes (False Positive)
    Client->>Storage: Do you have 'key3'?
    Storage-->>Client: No
</pre>

In this diagram, you can see:
- When the filter says “no”, there is no need to check the storage.
- When it says “yes”, it might be a true positive or a false positive, leading to unnecessary disk access.

Bloom filters use:
- Bit arrays to store data.
- Multiple hash functions to map items to bits in the array. Using more than one hash function helps spread the items across the bit array and reduces the chance of false positives.

Because of their efficiency, Bloom filters are widely used in real-world systems.

For example, they are used in:
- Web crawlers to check if a URL has already been visited.
- URL shorteners to quickly check if a short code already exists before creating a new one.
- Databases and caches to avoid unnecessary disk lookups.
- Network systems to quickly check membership without storing full data.

Now, let’s see how Bloom filters actually work in more detail.

## How Does It Work?

A Bloom filter works by using multiple hash functions to set and check bits in a bit array.

<pre class="mermaid">
graph TD
    Item["Item: apple"] --> Hash1["Hash Function 1 → index 2"]
    Item --> Hash2["Hash Function 2 → index 5"]
    Item --> Hash3["Hash Function 3 → index 8"]

    subgraph BitArray["Bit Array"]
        direction LR
        B0["0"]
        B1["0"]
        B2["1"]
        B3["0"]
        B4["0"]
        B5["1"]
        B6["0"]
        B7["0"]
        B8["1"]
        B9["0"]
    end

    Hash1 --> B2
    Hash2 --> B5
    Hash3 --> B8
</pre>

Here is how it works step by step:

**Adding an item:**

When you add an item to the Bloom filter, it runs the item through several hash functions.
Each hash function returns an index in the bit array.
The filter sets the bits at these indexes to **1**.
**Using multiple hash functions**[*](#why-multiple-hash-functions) ensures that each item affects multiple bits, which makes the filter more accurate.

<pre class="mermaid">
graph TB
    subgraph HashFunctions["Hash Functions"]
        direction LR
        Hash1["Hash1 → index 2"]
        Hash2["Hash2 → index 5"]
        Hash3["Hash3 → index 8"]
    end

    Item["Add Item: apple"] --> Hash1
    Item --> Hash2
    Item --> Hash3

    subgraph BitArray["Bit Array (indexes 0-9)"]
        direction LR
        B0["0"]
        B1["0"]
        B2["0 → 1"]
        B3["0"]
        B4["0"]
        B5["0 → 1"]
        B6["0"]
        B7["0"]
        B8["0 → 1"]
        B9["0"]
    end

    Hash1 --> B2
    Hash2 --> B5
    Hash3 --> B8
</pre>

**Checking an item:**

When you check for an item, the same hash functions are used to calculate the indexes.
If any of these bits are **0**, the item is definitely not in the set.
If all bits are **1**, the item might be in the set. (This is where false positives happen.)

<pre class="mermaid">
graph TB
    subgraph HashFunctions["Hash Functions"]
        direction LR
        Hash1["Hash1 → index 2"]
        Hash2["Hash2 → index 5"]
        Hash3["Hash3 → index 8"]
    end

    Item["Check Item: apple"] --> Hash1
    Item --> Hash2
    Item --> Hash3

    Hash1 --> Check2["Check bit 2"]
    Hash2 --> Check5["Check bit 5"]
    Hash3 --> Check8["Check bit 8"]

    subgraph BitArray["Bit Array (indexes 0-9)"]
        direction LR
        B0["0"]
        B1["0"]
        B2["1"]
        B3["0"]
        B4["0"]
        B5["1"]
        B6["0"]
        B7["0"]
        B8["1"]
        B9["0"]
    end

    Check2 --> B2
    Check5 --> B5
    Check8 --> B8

    B2 --> IsSet2["bit 2 is set"]
    B5 --> IsSet5["bit 5 is set"]
    B8 --> IsSet8["bit 8 is set"]

    IsSet2 --> FinalResult["Result"]
    IsSet5 --> FinalResult
    IsSet8 --> FinalResult

    subgraph Outcome["Outcome"]
        direction LR
        Outcome1["All bits set → maybe in set"]
        Outcome2["Any bit unset → definitely not in set"]
    end

    FinalResult --> Outcome1
    FinalResult --> Outcome2
</pre>

**Why False Positives Occur:**

False positives happen because different items can produce the same indexes after hashing.
As more items are added, the chance of these overlaps increases.

### Why Multiple Hash Functions?

**If we used only one hash function:**
- Every item would set only one bit in the bit array.
- Different items could easily set the same bit (collision), causing high false positive rates.

**By using k different hash functions:**
- Each item sets k bits in the array.
- When checking, all k bits must be set to return “maybe in the set”.
- This makes it less likely that multiple items accidentally match all k bits, reducing false positives.

**In short:**
- More hash functions = better accuracy (up to a point).

However, using too many hash functions will slow down the filter without giving much improvement.
 
## Example Implementation Go

Let’s implement a simple Bloom filter in Go to understand how it works in practice.
In this implementation:

We use xxHash for fast hashing.

We store bits efficiently using a byte slice ([]byte) instead of a boolean array.

Multiple hash functions are simulated by salting the data with a counter.

Here is the full code:

```go

package main

import (
        "fmt"

        "github.com/cespare/xxhash/v2"
)

type BloomFilter struct {
        size      uint64
        hashCount uint64
        bitArray  []byte
}

func NewBloomFilter(size, hashCount uint64) *BloomFilter {
        byteSize := (size + 7) / 8
        return &BloomFilter{
                size:      size,
                hashCount: hashCount,
                bitArray:  make([]byte, byteSize),
        }
}

func (bf *BloomFilter) getHashes(data string) []uint64 {
        hashes := make([]uint64, bf.hashCount)
        for i := uint64(0); i < bf.hashCount; i++ {
                h := xxhash.New()
                h.Write(fmt.Appendf(nil, "%s%d", data, i))
                hashes[i] = h.Sum64() % bf.size
        }
        return hashes
}

func (bf *BloomFilter) setBit(pos uint64) {
        byteIndex := pos / 8
        bitIndex := pos % 8
        bf.bitArray[byteIndex] |= 1 << bitIndex
}

func (bf *BloomFilter) getBit(pos uint64) bool {
        byteIndex := pos / 8
        bitIndex := pos % 8
        return (bf.bitArray[byteIndex] & (1 << bitIndex)) != 0
}

func (bf *BloomFilter) Add(data string) {
        for _, idx := range bf.getHashes(data) {
                bf.setBit(idx)
        }
}

func (bf *BloomFilter) Check(data string) bool {
        for _, idx := range bf.getHashes(data) {
                if !bf.getBit(idx) {
                        return false
                }
        }
        return true
}

```

**Explanation:**

- **NewBloomFilter:** Initializes the filter with given size and number of hash functions.
- **getHashes:** Generates multiple hashes by salting the input with a counter.
- **setBit / getBit:** Efficiently sets and checks bits using bitwise operations.
- **Add:** Adds an item to the Bloom filter.
- **Check:** Checks if an item might exist in the filter.

Bloom filters are simple but powerful.
In the next section, we will see how to use Bloom filters with Redis for scalable and production-ready membership checks.

## Using Bloom Filters with Redis Stack

In production systems, you often need a distributed and scalable Bloom filter.
Redis Stack makes this easy because it includes RedisBloom by default, along with other useful modules like RediSearch and RedisJSON.

### What is Redis Stack?

Redis Stack is an enhanced version of Redis that combines:
- Core Redis data structures
- Modules such as Bloom filters, JSON, Search, and TimeSeries

With Redis Stack, you can use Bloom filters out of the box without extra setup.

### Installing Redis Stack

If you use Docker, you can start Redis Stack quickly:

```bash

docker run -d -p 6379:6379 redis/redis-stack:latest

```

This runs Redis enabled on port 6379.

### Basic Usage

If you want to use redis-cli directly inside the Redis Stack container, follow these steps:

```bash

docker ps
docker exec -it <container_id_or_name> redis-cli

```

This will open the Redis CLI inside your running Redis Stack container. You can now run commands like:

```bash 

# Create a Bloom filter named myfilter
BF.RESERVE myfilter 0.01 1000
# Syntax: BF.RESERVE {key} {error_rate} {capacity}

# Add an item
BF.ADD myfilter "apple"

# Check if an item exists
BF.EXISTS myfilter "apple"
# Returns 1 (exists) or 0 (does not exist)

```

### Why Use Redis Stack for Bloom Filters?

- **No extra module setup required** – RedisBloom is included by default.
- **High performance and scalability** for distributed systems.
- **Production-ready solution** with official support from Redis.

In the next section, we will summarise what we learned about Bloom filters and when to use them in your projects.

## Using Bloom Filter in Go with Redis Stack

Here is a simple example using go-redis and Redis Stack:

```go

package main

import (
        "context"
        "fmt"

        "github.com/redis/go-redis/v9"
)

type RedisBloomFilter struct {
        client *redis.Client
        key    string
}

func NewRedisBloomFilter(addr, key string, errorRate float64, capacity int64) (*RedisBloomFilter, error) {
        rdb := redis.NewClient(&redis.Options{
                Addr: addr,
        })

        ctx := context.Background()

        err := rdb.Do(ctx, "BF.RESERVE", key, fmt.Sprintf("%f", errorRate), capacity).Err()
        if err != nil && err.Error() != "ERR item exists" {
                return nil, fmt.Errorf("failed to create bloom filter: %v", err)
        }

        return &RedisBloomFilter{
                client: rdb,
                key:    key,
        }, nil
}

func (rbf *RedisBloomFilter) Add(item string) (bool, error) {
        ctx := context.Background()
        added, err := rbf.client.Do(ctx, "BF.ADD", rbf.key, item).Bool()
        if err != nil {
                return false, fmt.Errorf("failed to add item: %v", err)
        }
        return added, nil
}

func (rbf *RedisBloomFilter) Check(item string) (bool, error) {
        ctx := context.Background()
        exists, err := rbf.client.Do(ctx, "BF.EXISTS", rbf.key, item).Bool()
        if err != nil {
                return false, fmt.Errorf("failed to check item: %v", err)
        }
        return exists, nil
}

```

## Conclusion

In this post, we explored Bloom filters, a powerful and memory-efficient data structure that:
- Allows fast membership checks with a small chance of false positives
- Uses bit arrays and multiple hash functions to store and check data efficiently

We:
- Learned what Bloom filters are and how they work
- Implemented a simple Bloom filter in Go using xxHash and bit-level storage
- Integrated Bloom filters with Redis Stack for scalable and distributed systems

### When should you use Bloom filters?

- When you need fast membership checks
- When memory usage is critical
- When false positives are acceptable, but false negatives are not

### Final thoughts

Bloom filters are simple to implement but extremely powerful in real-world applications such as caches, URL shorteners, web crawlers, and databases.
They save memory and time, making your systems faster and more efficient.

You can find the full implementation on GitHub:
[View the full code on GitHub](https://github.com/yplog/bloomfilter-go-example)