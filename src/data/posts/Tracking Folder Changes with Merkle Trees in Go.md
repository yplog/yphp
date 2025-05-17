---
title: "Tracking Folder Changes with Merkle Trees in Go"
pubDate: 2025-05-10
description: "In this post, I build a simple Go program that watches a folder and uses a Merkle tree to detect changes in the files."
image:
  src: "https://images.unsplash.com/photo-1517157488732-b80ab10430e4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt: "Tree in Rome"
  createdBy: "Jeroen den Otter"
  creatorLink: "https://unsplash.com/@jeroendenotter"
tags: ["go", "merkle-tree", "file-watching"]
draft: false
---

## Table of Contents

- [Introduction](#introduction)
- [Building the Merkle Watcher](#building-the-merkle-watcher)
  - [Folder Structure and Merkle Tree Overview](#folder-structure-and-merkle-tree-overview)
  - [Reading the Folder And Preparing Data Blocks](#reading-the-folder-and-preparing-data-blocks)
  - [Merkle Tree Implementation](#merkle-tree-implementation)
- [Wrapping Up](#wrapping-up)

## Introduction

A Merkle tree is a way to check if data has changed. It works by turning each piece of data into a hash, then combining those hashes step by step until there is only one final hash called the root. If even one small part of the data changes, the root hash will also change. This makes it easy to detect changes. Merkle trees are used in systems like blockchains to keep data safe and correct.

## Building the Merkle Watcher

To see how Merkle trees work in practice, we’ll build a simple example using Go. In this example, we’ll watch a folder and calculate its Merkle root based on the contents of its files. If any file changes, the Merkle root will change too—showing us that something inside the folder has been updated. 
You can find the full source code on [GitHub](https://github.com/yplog/tracing-folder-changes-with-merkle-tree).

### Folder Structure and Merkle Tree Overview

In our example, we use a folder named **watched** that contains a few text files: **file1.txt**, **file2.txt**, **file3.txt**, and **file4.txt**. Each file holds some data, and we’ll calculate a hash for each one. These hashes will then be combined step by step to build a Merkle tree, ending with a single root hash that represents the entire folder’s contents.

Here is the folder structure, shown using the `tree` command:

```bash
tree watched
watched
├── file1.txt
├── file2.txt
├── file3.txt
└── file4.txt

1 directory, 4 files
```

Below is a diagram showing how a Merkle tree is built from the files inside the watched folder. Each file is hashed, and these hashes are then combined in pairs to form higher-level hashes. This process continues until a single root hash is created, which represents the entire folder's state.

If any part of the data changes, the resulting root hash will change as well — making it easy to detect modifications.

<pre class="mermaid">
graph TD
    %% Leaf hashes
    A1["hash(file1.txt)"]
    A2["hash(file2.txt)"]
    A3["hash(file3.txt)"]
    A4["hash(file4.txt)"]

    %% First level
    B1["hash(A1 + A2)"]
    B2["hash(A3 + A4)"]

    %% Root
    R["Merkle Root = hash(B1 + B2)"]

    %% Connections
    A1 --> B1
    A2 --> B1
    A3 --> B2
    A4 --> B2
    B1 --> R
    B2 --> R
</pre>

Now let’s build a simple Go program that watches the watched folder and prints the Merkle root whenever something changes. We’ll read the content of each file in the folder, hash it, build the Merkle tree, and compare the resulting root hash over time.

Let’s break down how this program works, step by step.

### Reading the Folder And Preparing Data Blocks

First, we walk through the folder and collect the content of all files:

```go
func readFiles(dir string) (map[string][]byte, error) {
    files := make(map[string][]byte)
    filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
        if err != nil || d.IsDir() {
            return nil
        }
        content, err := os.ReadFile(path)
        relPath, _ := filepath.Rel(dir, path)
        files[relPath] = content
        return nil
    })
}
```

We store each file's content in a `map[string][]byte`, using the file’s relative path as the key.

We convert this map into a sorted slice of content blocks:

```go
func filesToBlocks(files map[string][]byte) [][]byte {
    var keys []string
    for k := range files {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    var blocks [][]byte
    for _, k := range keys {
        blocks = append(blocks, files[k])
    }
    return blocks
}
```

Sorting ensures that the Merkle tree is deterministic: the same folder state will always produce the same Merkle root.
Each file’s content becomes a leaf node in the Merkle tree.

### Merkle Tree Implementation

At the core of the tree is the MerkleNode struct:

```go
type MerkleNode struct {
    Left   *MerkleNode
    Right  *MerkleNode
    Hash   []byte
    Data   []byte
    IsLeaf bool
}

type MerkleTree struct {
	Root *MerkleNode
}
```

Leaf nodes hold actual file content in Data and are marked with `IsLeaf: true`.
Internal nodes hold only a **Hash** and links to their left and right child nodes.

We use a helper function to create nodes, and within it, we use the SHA-256 algorithm to hash data. SHA-256 is a widely used cryptographic hash function that produces a 256-bit (32-byte) output. It's fast, deterministic, and collision-resistant — making it ideal for detecting even the smallest changes in file content.

```go
func hash(data []byte) []byte {
    h := sha256.Sum256(data)
    return h[:]
}

func NewMerkleNode(left, right *MerkleNode, data []byte) *MerkleNode {
    if left == nil && right == nil {
        // Leaf node
        nodeHash := hash(data)
        return &MerkleNode{Hash: nodeHash, Data: data, IsLeaf: true}
    }
    // Internal node
    combined := append(left.Hash, right.Hash...)
    nodeHash := hash(combined)
    return &MerkleNode{Left: left, Right: right, Hash: nodeHash}
}
```

This lets us create both leaf nodes (with raw data) and internal nodes (with combined hashes).

The NewMerkleTree function builds the full tree:

```go
func NewMerkleTree(dataBlocks [][]byte) *MerkleTree {
    var nodes []*MerkleNode
    for _, data := range dataBlocks {
        nodes = append(nodes, NewMerkleNode(nil, nil, data))
    }
    for len(nodes) > 1 {
        var newLevel []*MerkleNode
        for i := 0; i < len(nodes); i += 2 {
            if i+1 == len(nodes) {
                // Duplicate last node if odd number
                newLevel = append(newLevel, NewMerkleNode(nodes[i], nodes[i], nil))
            } else {
                newLevel = append(newLevel, NewMerkleNode(nodes[i], nodes[i+1], nil))
            }
        }
        nodes = newLevel
    }
    return &MerkleTree{Root: nodes[0]}
}
```

This function builds the tree from bottom up, pairing nodes and hashing them recursively.
If there’s an odd number of nodes at any level, the last node is duplicated to maintain a balanced structure.

With these core components in place, our Merkle tree implementation can efficiently track changes to any files in the watched folder. There are certainly many different and more optimized ways to implement this functionality, but the main purpose of this exercise is to understand the Merkle tree concept and see it in action with a practical example.

## Wrapping Up

In this post, we explored how Merkle trees work by building a simple tool in Go that watches a folder and computes a Merkle root from its file contents. Along the way, we walked through how the tree is constructed, how it detects changes efficiently, how to generate and verify Merkle proofs for specific data, and how to visualize the full tree structure.

You can find the full source code on [GitHub](https://github.com/yplog/tracing-folder-changes-with-merkle-tree).
