---
title: "Building an Autocomplete System with Trie"
pubDate: 2025-08-09
description: "Creating a Trie-based autocomplete system in TypeScript."
image:
  src: "https://images.unsplash.com/photo-1554900773-4dd76725f876?q=80&w=1169&auto=format&fit=crop"
  alt: "The Stuttgart library"
  createdBy: "Niklas Ohlrogge"
  creatorLink: "https://unsplash.com/@ohlrogge"
tags: ["trie", "autocomplete", "typescript", "en"]
draft: false
---

## Table of Contents

- [Trie Data Structure](#trie-data-structure)
- [Why Trie for Autocomplete?](#why-trie-for-autocomplete?)
  - [Tries vs Trees](#tries-vs-trees)
- [Trie Operations](#trie-operations)
- [Data Model](#data-model)
- [Implementation](#implementation)
- [Conclusion](#conclusion)
- [References](#references)

## Trie Data Structure

A Trie is a tree-like data structure designed to store strings efficiently for fast prefix queries. Each node represents a character in the string, and paths from the root to a node form prefixes.

This section is inspired by and adapted from [ByteByteGo’s Design a Search Autocomplete System](https://bytebytego.com/courses/system-design-interview/design-a-search-autocomplete-system).

Key points:

- Root node: represents an empty string.
- Each edge: a character transition.
- Nodes can mark the end of a valid word.
- Common prefixes are stored once, saving repeated storage of the same characters.
- To optimize autocomplete, frequency and top-k results can be cached at each node.

> In the context of autocomplete, top-k means returning only the k most relevant or highest-ranked suggestions for a given prefix, rather than all possible matches.
>
> Example:
>
> If a Trie contains the words true (35), try (29), tree (10), and a user types tr with k=2, we return:
> [true: 35, try: 29]
>
> Instead of all matches, we show only the top 2 by score.

Advantages:

- Search complexity depends on prefix length, not dictionary size.
- Natural fit for autocomplete and spell-check.

Disadvantages:

- Higher memory usage than hash maps for small sets.

For example, storing cat and car will share the path ca.

<pre class="mermaid">
graph LR
  R((root))
  R --> C[c]
  C --> A[a]
  A --> T[t]
  A --> R2[r]
  R2 --> T2[t]
  R2 --> E[e]

  T  --> CAT["cat"]
  R2 --> CAR["car"]
  T2 --> CART["cart"]
  E --> CARE["care"]

  classDef endNode fill:#9f9,stroke:#333,stroke-width:2px;
  class T,R2,T2,E endNode;

  style R fill:#f9c,stroke:#333,stroke-width:2px;
</pre>

## Why Trie for Autocomplete?

We need fast prefix lookups. A Trie (prefix tree) lets us jump directly to the node that represents the typed prefix and then list matching words under it. This is usually faster than scanning an index in a relational database for every keystroke.

### Tries vs Trees

<pre class="mermaid">
graph TD
  subgraph "B-tree Example"
    BRoot["Root: [30]"] 
    BRoot --> BL1["Left: [10, 20]"]
    BRoot --> BR1["Right: [40, 50]"]
    
    BL1 --> BL2["[5, 8]"]
    BL1 --> BL3["[12, 15]"]
    BL1 --> BL4["[22, 25]"]
    
    BR1 --> BR2["[35, 38]"]
    BR1 --> BR3["[42, 45]"]
    BR1 --> BR4["[55, 60]"]
  end

  subgraph "Trie Example"
    TRoot(("root")) --> C["c"]
    C --> A["a"]
    A --> T["t"]
    A --> R["r"]
    R --> T2["t"]
    
    TRoot --> D["d"]
    D --> O["o"]
    O --> G["g"]
  end

  classDef endNode fill:#9f9,stroke:#333,stroke-width:2px;
  class T,T2,G endNode;

  classDef blNode fill:#ffe,stroke:#333,stroke-width:1px;
  class BL2,BL3,BL4 blNode;

  classDef brNode fill:#ffe,stroke:#333,stroke-width:1px;
  class BR2,BR3,BR4 brNode;

  style BRoot fill:#bbf,stroke:#333,stroke-width:2px;
  style TRoot fill:#f9c,stroke:#333,stroke-width:2px;
</pre>

**Are they the same?**

No. Both are tree structures, but they work differently:

**Tree (like B-tree):**

- Stores any type of data
- Groups keys by value ranges
- Good for databases and sorting

**Trie:**

- Made specifically for strings
- Splits words character by character
- Perfect for prefix searches like autocomplete

**Key differences:**

- **Data storage:** Trees group similar values, tries split by characters
- **Search method:** Trees compare values at each step, tries follow letters one by one
- **Best use:** Trees for general databases, tries for word searches

**In short:** Every trie is a tree, but not every tree is a trie. Use tries when you need fast prefix matching for words.

## Trie Operations

Common operations on a Trie include:

- **Insert(word) — O(L):** Add a new word to the trie. We visit each character once, so time depends on word length (L).
- **Search(word) — O(L):** Check if a word exists in the trie. We follow the path character by character.
- **StartsWith(prefix) — O(P):** Find if any words start with this prefix. We only need to reach the prefix node, then stop.
- **Delete(word) — O(L):** Remove a word from the trie. We find the word path and mark it as "not a word" (or remove unused nodes).
- **Suggest(prefix, k) — O(P + M log k):** Get top k suggestions for a prefix. First find the prefix (P time), then collect and rank results (M = number of matches found).

**Why these times?**

- L = length of the word
- P = length of the prefix
- M = number of matching words
- k = how many results we want

**The key insight:** search time depends on word length, not how many total words are stored!

## Data Model

For our autocomplete system, we need to store more than just the words. Each suggestion should have additional data like frequency (how often it's searched).

```typescript
interface TrieNode {
  children: Map<string, TrieNode>; // character -> next node
  isEndOfWord: boolean; // marks valid word ending
  frequency: number; // how popular this word is
}

interface WordData {
  text: string; // the actual word
  frequency: number; // search count or popularity score
}
```

## Implementation

This section will walk through creating a basic project structure for a TypeScript-based autocomplete system using a Trie.

```sh
src/
├── types/
│   └── data.ts           # Type definitions and sample data
├── core/
│   ├── trie.ts           # Trie data structure implementation
│   └── autocomplete.ts   # AutocompleteSystem wrapper
```

Below is our Trie implementation, with explanations for each part:

**TrieNode class:** Represents a single node in the trie. It contains:

- **children:** map of character → next TrieNode.
- **isEndOfWord:** marks the end of a complete word.
- **frequency:** stores how often this word is used.
- **wordData:** holds the full WordData object.

```typescript
// src/core/trie.ts
export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;
  wordData?: WordData;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
  }
}
```

**Trie class:** The main data structure.

- **insert:** Adds a word, creating nodes as needed.
- **search:** Checks if a full word exists.
- **startsWith:** Checks if any word begins with the given prefix.
- **findNode (private):** Traverses down to the node for a word or prefix.
- **suggest:** Returns the top-k most frequent matches for a prefix.
- **collectWords (private):** Recursively gathers all words under a node.
- **incrementFrequency:** Increases frequency count for a word.
- **getFrequency:** Retrieves the frequency of a word.
- **delete:** Removes a word if present, cleaning up unused nodes.

```typescript
// src/core/trie.ts
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string, frequency: number = 1): void {
    let currentNode = this.root;

    for (const char of word.toLowerCase()) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }

      currentNode = currentNode.children.get(char)!;
    }

    currentNode.isEndOfWord = true;
    currentNode.frequency = frequency;
    currentNode.wordData = {
      text: word,
      frequency,
    };
  }

  search(word: string): boolean {
    const node = this.findNode(word.toLowerCase());
    return node?.isEndOfWord ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix.toLowerCase()) !== null;
  }

  private findNode(word: string): TrieNode | null {
    let currentNode = this.root;

    for (const char of word) {
      if (!currentNode.children.has(char)) {
        return null;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return currentNode;
  }

  suggest(prefix: string, k: number = 10): WordData[] {
    const prefixNode = this.findNode(prefix.toLowerCase());
    if (!prefixNode) {
      return [];
    }

    const suggestions: WordData[] = [];
    this.collectWords(prefixNode, suggestions);

    return suggestions.sort((a, b) => b.frequency - a.frequency).slice(0, k);
  }

  private collectWords(node: TrieNode, results: WordData[]): void {
    if (node.isEndOfWord && node.wordData) {
      results.push(node.wordData);
    }

    for (const childNode of node.children.values()) {
      this.collectWords(childNode, results);
    }
  }

  incrementFrequency(word: string): boolean {
    const node = this.findNode(word.toLowerCase());
    if (node && node.isEndOfWord && node.wordData) {
      node.frequency++;
      node.wordData.frequency++;
      return true;
    }
    return false;
  }

  getFrequency(word: string): number {
    const node = this.findNode(word.toLowerCase());
    if (node && node.isEndOfWord) {
      return node.frequency;
    }
    return 0;
  }

  delete(word: string): boolean {
    return this.deleteHelper(this.root, word.toLowerCase(), 0);
  }

  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) {
        return false;
      }

      node.isEndOfWord = false;
      node.wordData = undefined;

      return node.children.size === 0;
    }

    const char = word[index];
    if (!char) {
      return false;
    }

    const childNode = node.children.get(char);

    if (!childNode) {
      return false;
    }

    const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }

    return false;
  }
}
```

You can find the full implementation on GitHub:
[View the full code on GitHub](https://github.com/yplog/autocomplete-system-with-trie)

## Conclusion

We explored how to build an efficient autocomplete system using the Trie data structure. We covered the fundamental concepts, implementation details.

This was built as a learning exercise — a humble starting point for anyone interested in experimenting with Tries and building their own search features.

## References

- [ByteByteGo, Design a Search Autocomplete System](https://bytebytego.com/courses/system-design-interview/design-a-search-autocomplete-system)
- [Prefix Hash Tree An Indexing Data Structure over Distributed Hash Tables](https://people.eecs.berkeley.edu/~sylvia/papers/pht.pdf)
