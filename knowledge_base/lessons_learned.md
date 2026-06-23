---
chunk_id: lessons_learned_core
tags: [lessons, mistakes, growth, reflection, learning, improvement, retrospection]
retrieval_triggers: ["Garv's lessons", "what has Garv learned", "Garv's failures", "what would Garv do differently", "lessons from projects", "engineering growth", "Garv's mistakes", "project retrospectives", "learning from mistakes"]
summary: "Key engineering lessons Garv Jain learned from project work, including how to avoid premature abstraction, manage scope, and build with evidence-based simplicity."
---

# Lessons Learned

## Designing for Requirements That Did Not Exist Yet

The ComplySense database adapter is the clearest example. The original layer was built to be database-agnostic — abstracting over PostgreSQL to allow future flexibility. It solved a hypothetical problem. In practice it bypassed relational integrity, added complexity with no present benefit, and had to be replaced with straightforward SQLAlchemy ORM.

The same pattern appeared in other projects in subtler forms — schema fields added for anticipated features, abstraction layers built before the usage patterns were understood.

What changed: the default question before adding any abstraction or flexibility layer became "what problem does this solve today." Extensibility is still considered, but complexity now requires evidence rather than anticipation. Building around known constraints first and letting architecture evolve as real requirements emerge has consistently produced cleaner systems than trying to anticipate them upfront.

## Letting Exploration Compete With Delivery

While building, Garv frequently moves from a feature into the architecture behind it, then into how larger systems solve the same problem, then into adjacent questions that are genuinely interesting but not part of the current milestone. The learning that comes from this is real. The cost is that core functionality sometimes remained incomplete while adjacent territory was being explored.

This happened across multiple projects — most visibly in the earlier stages of DataInsights.ai and CodeAlive, where architectural depth grew faster than the working surface area of the system.

What changed: treating exploration and delivery as separate activities rather than letting them compete. When a tangent appears, the question is whether it belongs to the current milestone or a future one. The exploration still happens — it is part of how Garv learns — but it is separated from the delivery path rather than embedded in it.

## Treating Conceptual Understanding as Operational Understanding

Early in several projects, an initial mental model of the system was formed during planning and then used as the basis for design decisions. Implementation consistently revealed constraints, edge cases, and requirements that were not visible during planning — the CodeAlive OT system, the DataInsights.ai report generation pipeline, and the ComplySense RBAC design all required significant revision once real implementation began.

The mistake was assuming that understanding a problem conceptually meant understanding it operationally. Many important details only become visible when a working system exists.

What changed: the first version of a design is now treated as a learning tool rather than a final blueprint. Uncertain areas get prototyped early specifically to surface hidden constraints before the rest of the system is built around wrong assumptions. Design revision mid-project is expected rather than treated as a planning failure.