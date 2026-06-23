---
chunk_id: technical_philosophy_core
tags: [philosophy, engineering, approach, principles, design, architecture, decision-making]
retrieval_triggers: ["Garv's engineering philosophy", "how does Garv approach design", "Garv's principles", "over-engineering", "architectural decisions", "Garv's beliefs about software", "design philosophy", "technical philosophy"]
summary: "Garv Jain's technical philosophy — the principles he uses to avoid over-engineering, handle uncertainty, and make architectural decisions grounded in real problems."
---

# Technical Philosophy

## On Over-Engineering and Under-Engineering

Garv's working definition of over-engineering is when the complexity of a solution significantly exceeds the complexity of the problem it solves — most often when a design is solving hypothetical future requirements rather than current ones.

A concrete example from ComplySense: early in the project, the database layer was built as an abstraction mimicking MongoDB's Motor API over PostgreSQL JSONB. The intent was flexibility — keeping the codebase database-agnostic. In practice, it bypassed relational integrity entirely and created a layer of complexity with no real benefit for the actual requirements. It was later replaced with straightforward SQLAlchemy ORM, which was simpler, more maintainable, and more correct.

The opposite failure — under-engineering — has also appeared. Several projects began with schemas or data models that were too minimal and required significant redesign once requirements became clearer. DataInsights.ai's cleaning pipeline and CodeAlive's collaboration architecture both went through redesigns mid-project as real constraints became visible.

The pattern from both directions: complexity is easier to add when evidence exists for it than to remove once it is embedded. The preference that emerged is systems that are simple but extensible — not heavily abstracted upfront, not so rigid they break under the first change.

## Handling Architectural Uncertainty

When the right architectural decision is unclear, Garv's typical approach is to isolate the specific uncertainty and test it directly rather than resolve it through reasoning alone.

He breaks large architectural questions into smaller ones. Instead of asking whether an entire system design is correct, he asks whether a specific retrieval strategy behaves as expected, whether a particular schema handles the access patterns cleanly, or whether a synchronization approach holds up under realistic conditions. The answer usually comes from a small implementation built around that specific concern.

Documentation and existing implementations are useful references, but direct experimentation typically carries more weight. Across most of his significant projects, architectural decisions evolved during implementation rather than before it — the design of CodeAlive's OT system, the compute-first constraint in DataInsights.ai, and the chunk boundary strategy in the portfolio RAG backend all solidified through building, not planning.

## Principles That Have Held Up

A few principles have remained consistent regardless of project or stack:

**Information flow should be easy to reason about.** In every system Garv has designed — APIs, auth flows, AI pipelines, real-time collaboration, data processing — he prefers architectures where it is clear where data originates, how it moves, and what is responsible for each transformation. Systems that are hard to trace tend to be hard to debug and hard to extend.

**Simplicity outperforms cleverness over time.** Most redesigns in his projects have involved removing layers, reducing abstraction, or replacing flexible-but-complex structures with simpler ones. Clever solutions tend to create maintenance costs that only become visible later.

**Solve for actual requirements, not anticipated ones.** The ComplySense database abstraction is one example. The FAISS-over-Pinecone decision for the portfolio RAG backend is another — a hosted vector database would be more scalable, but FAISS in memory is sufficient for the actual scale of the problem and simpler to operate.

**Let a clear constraint guide the system.** The strongest architectural decision in DataInsights.ai is the compute-first rule: the LLM never sees raw data rows. This single constraint shaped the entire pipeline — progressive report generation, section-level readiness flags, approval gates before summary generation. A clear guiding principle during design tends to produce more coherent systems than a collection of independent decisions.

## On a Common Inefficiency

The pattern Garv finds most inefficient in engineering discussions — and one he has fallen into himself — is designing for scale, flexibility, or extensibility before there is evidence those capabilities are needed. It produces abstractions and infrastructure that add complexity without adding present value.

His own ComplySense database layer is the clearest personal example. The lesson from it was not to avoid abstraction entirely, but to require evidence before adding it. Real usage patterns justify complexity better than anticipated ones.