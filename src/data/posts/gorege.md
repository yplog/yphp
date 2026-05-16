---
title: "gorege: A Small Rule Engine for Go"
pubDate: 2026-05-14
description: "I built a small Go library for first-match rule evaluation. Here's what it does and how it works."
image:
  src: "https://raw.githubusercontent.com/yplog/gorege/main/.github/logo.png"
  alt: "gorege logo"
  createdBy: "Asu Pala"
  creatorLink: "https://asupala.me"
tags: ["go", "open-source", "rule-engine", "en"]
draft: false
---

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [How It Works](#how-it-works)
  - [Dimensions and Rules](#dimensions-and-rules)
  - [Matchers](#matchers)
  - [Evaluation](#evaluation)
- [Key Features](#key-features)
  - [Explain](#explain)
  - [PartialCheck](#partialcheck)
  - [Closest](#closest)
  - [Dead and Shadowed Rule Warnings](#dead-and-shadowed-rule-warnings)
- [JSON Config and CLI](#json-config-and-cli)
- [Under the Hood: The Trie](#under-the-hood-the-trie)
- [Conclusion](#conclusion)
- [References](#references)

## Introduction

I kept writing the same kind of logic in different projects: access control, feature flags, product availability. The shape was always the same — you have a tuple of values, a list of rules, and you want to know which rule wins.

I turned this pattern into a library called **gorege**. The code is on [GitHub](https://github.com/yplog/gorege), and the Go package reference is on [pkg.go.dev](https://pkg.go.dev/github.com/yplog/gorege). It is a small Go library for first-match rule evaluation. It has zero dependencies and is safe to use from multiple goroutines.

## The Problem

Imagine you are building a facility booking system. The rules look like this:

- Gold members can use any facility, any day.
- Guests cannot use the sauna on Monday or Tuesday.
- Everyone else can access everything.
  You could write this with `if` statements. But rules pile up fast, order starts to matter, and debugging gets hard. You also cannot easily ask: _"what is the nearest allowed option for this user?"_

## How It Works

### Dimensions and Rules

You build an engine with **dimensions** and **rules**. Dimensions define the axes of your tuple. Rules are checked in order, and the first match wins.

```go
e, warnings, err := gorege.New(
    gorege.WithDimensions(
        gorege.Dim("membership", "Gold member", "Regular member", "Guest"),
        gorege.Dim("day", "Mon", "Tue", "Wed", "Thu", "Fri"),
        gorege.Dim("facility", "Swimming pool", "Gym", "Sauna"),
    ),
    gorege.WithRules(
        gorege.Allow("Gold member", gorege.Wildcard, gorege.Wildcard),
        gorege.Deny("Guest", gorege.AnyOf("Mon", "Tue"), "Sauna"),
        gorege.Allow(gorege.AnyOf("Guest", "Regular member"), gorege.Wildcard, gorege.Wildcard),
    ),
)
```

### Matchers

Each slot in a rule can be one of three things:

| Matcher                      | Meaning                                       |
| ---------------------------- | --------------------------------------------- |
| `"Gold member"`              | Exact match                                   |
| `gorege.AnyOf("Mon", "Tue")` | Matches any of the listed values              |
| `gorege.Wildcard`            | Matches any value declared for that dimension |

### Evaluation

The engine checks rules one by one. The first rule where all matchers pass wins.

```go
ok, _ := e.Check("Guest", "Mon", "Sauna") // false
ok, _ = e.Check("Guest", "Wed", "Sauna")  // true
```

<pre class="mermaid">
graph TD
    Input["Input: Guest, Mon, Sauna"]
    R1["Rule 1: Allow Gold member, *, *"]
    R2["Rule 2: Deny Guest, Mon or Tue, Sauna"]
    Result["Result: DENY"]
    Input --> R1
    R1 -->|"Guest ≠ Gold member, skip"| R2
    R2 -->|"all match"| Result
</pre>

If no rule matches, the result is `false`.

## Key Features

### Explain

Instead of just `true` or `false`, you can ask which rule matched and why.

```go
x, _ := e.Explain("Guest", "Mon", "Sauna")
// x.Matched    → true
// x.Allowed    → false
// x.RuleIndex  → 1
// x.RuleName   → "deny-guest-sauna-early-week"
// x.Action     → DENY
```

This is useful for debugging and audit logs.

### PartialCheck

You can check a partial tuple — fewer values than dimensions. This answers: "can this user access _anything_ at all?"

```go
ok, _ := e.PartialCheck("Guest")        // true — some full tuple is still allowed
ok, _ = e.PartialCheck("Guest", "Mon")  // true — some facility is still allowed on Monday
```

Trailing dimensions are left open. A DENY rule will not fire unless all its slots are matched.

### Closest

If a tuple is denied, `Closest` finds the nearest allowed one. It changes as few dimensions as possible.

```go
res, _ := e.Closest("Guest", "Mon", "Sauna")
// res.Conditions → ["Guest", "Wed", "Sauna"]
// res.Distance   → 1
// res.DimName    → "day"
// res.Value      → "Wed"
```

It checks all tuples at distance 1 first (one dimension changed), then distance 2, and so on.

<pre class="mermaid">
graph TD
    Input["Guest, Mon, Sauna (DENY)"]
    subgraph "Distance 1"
        C1["Gold member, Mon, Sauna"]
        C2["Regular member, Mon, Sauna"]
        C3["Guest, Tue, Sauna"]
        C4["Guest, Wed, Sauna ✓"]
        C5["..."]
    end
    Input --> C1
    Input --> C2
    Input --> C3
    Input --> C4
    Input --> C5
    C4 --> Result["Found: Guest, Wed, Sauna (ALLOW)"]
</pre>

There is also `ClosestIn`, which only changes one dimension. Useful when only one axis can vary.

### Dead and Shadowed Rule Warnings

When you build an engine, gorege checks your rules and warns you about:

- **Dead rules** — rules that can never match any input.
- **Shadowed rules** — rules that could match, but an earlier rule always wins first.

```go
_, warnings, _ := gorege.New(
    gorege.WithDimensions(gorege.DimValues("a", "b")),
    gorege.WithRules(
        gorege.Allow(gorege.Wildcard), // matches everything
        gorege.Deny("a"),              // never wins
    ),
)
// warnings[0].Kind    → WarningKindShadowed
// warnings[0].Message → "shadowed rule 1: never wins first-match..."
```

## JSON Config and CLI

You can also load rules from a `.json` file:

```json
{
  "$schema": "https://raw.githubusercontent.com/yplog/gorege/v1.0.0/schema/gorege-config.schema.json",
  "dimensions": [
    {
      "name": "membership",
      "values": ["Gold member", "Regular member", "Guest"]
    },
    { "name": "day", "values": ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { "name": "facility", "values": ["Swimming pool", "Gym", "Sauna"] }
  ],
  "rules": [
    {
      "action": "ALLOW",
      "name": "allow-gold",
      "conditions": ["Gold member", "*", "*"]
    },
    {
      "action": "DENY",
      "name": "deny-guest",
      "conditions": ["Guest", ["Mon", "Tue"], "Sauna"]
    },
    {
      "action": "ALLOW",
      "name": "allow-rest",
      "conditions": [["Guest", "Regular member"], "*", "*"]
    }
  ]
}
```

The `$schema` field gives you autocomplete and validation in most editors. There is also a CLI:

```bash
gorege check   rules.json Guest Wed Sauna   # true
gorege explain rules.json Guest Mon Sauna   # which rule matched
gorege closest rules.json Guest Mon Sauna   # nearest allowed tuple
gorege lint    rules.json                   # dead/shadow warnings
gorege diff    old.json new.json            # what changed between two rule files
```

The `diff` command is useful in code review. It checks every possible input tuple and shows which ones changed from ALLOW to DENY, or the other way around.

## Under the Hood: The Trie

The first version used a simple loop over rules. It worked, but it got slower as rules grew.

I added a **Priority Multi-path Trie** to fix this. Each rule is inserted into the trie when the engine is built. Every node stores `minRuleIdx` — the smallest rule index reachable from that node. During search, the engine skips branches that cannot beat the current best match.

<pre class="mermaid">
graph TD
    Root["Root (minIdx=0)"]
    Root -->|"Gold member"| N1["node (minIdx=0)"]
    Root -->|"Guest"| N2["node (minIdx=1)"]
    Root -->|"wildcard"| N3["node (minIdx=2)"]
    N1 -->|"wildcard"| N4["Rule 0: ALLOW"]
    N2 -->|"Mon or Tue"| N5["Rule 1: DENY"]
    N2 -->|"wildcard"| N6["Rule 2: ALLOW"]
    N3 -->|"wildcard"| N7["Rule 2: ALLOW"]
</pre>

`AnyOf("Mon", "Tue")` creates two separate branches in the trie, one for `Mon` and one for `Tue`. Children are stored in a slice up to 16 entries, then switched to a map.

The numbers were good. At 200 rules, `Check` went from ~1500 ns down to ~12 ns. At 1000 rules, from ~7300 ns to ~12 ns. Zero allocations on the hot path.

## Conclusion

gorege does one thing: first-match rule evaluation over a fixed tuple of dimensions. If you keep writing the same access control or feature flag logic in Go, it might be a good fit.

The API is stable under semver (1.x). You can install it with:

```bash
go get github.com/yplog/gorege
```

See [pkg.go.dev/github.com/yplog/gorege](https://pkg.go.dev/github.com/yplog/gorege) for the full API. It is MIT licensed. The [GitHub repository](https://github.com/yplog/gorege) has example programs for feature flags, e-commerce availability, and HTTP authorization.

## References

- [gorege on GitHub](https://github.com/yplog/gorege) — source, issues, and examples
- [gorege on pkg.go.dev](https://pkg.go.dev/github.com/yplog/gorege) — package documentation and module versions
- [recht](https://github.com/dashersw/recht) — the Node.js library that influenced gorege's API
- [Building an Autocomplete System with Trie](/blog/building-an-autocomplete-system-with-trie) — a previous post on this blog about tries
