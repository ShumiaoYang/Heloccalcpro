---
title: 'Is SaaS dead? My realizations while rebuilding the "Banking Black Box" in the age of AI.'
date: "2026-04-16"
excerpt: "Thinking of a Ex-core banking architect ."
author: "Sapling Yang"
---

Over the last year, there’s been a lot of talk about whether AI will eventually replace SaaS. But after actually rolling up my sleeves and building a new product from scratch, I’ve started asking a more specific question: What exactly are the problems that a general LLM cannot solve—at least not reliably?

I’ve been working on a vertical tool called **HELOCCalculator.pro**. Initially, the idea was simple: build a "better" calculator. There are plenty of these out there—you put in your home value and income, and it spits out a number. The implementation is easy, and users get it instantly.

But I quickly ran into a wall. I realized these "simple models" are almost always wrong in critical scenarios.

When I tried to simulate actual bank underwriting using public formulas, the results were way off. Not just a little bit, but off by an entire order of magnitude. Drawing on my 20 years of experience building core banking systems, I decided to go deeper and look at how these decisions are actually made.

**It turns out, the logic is a "Black Box" for a reason:**

Debt-to-income (DTI) isn't calculated on current rates; it’s calculated on a "stressed" rate to protect the lender. Interest rates aren't static; they shift dynamically based on LTV tiers and credit score buckets. And once a draw period ends, the entire repayment model flips into a completely different math engine.

At that point, I had a choice. I could continue building a "simple" tool—it would be easier to launch, easier to explain, and probably "good enough" for basic content marketing. Or, I could do the hard thing: try to replicate the actual, complex, and often user-unfriendly logic used by the banks.

That path was much harder. Not only was the implementation a nightmare, but the product itself became harder to explain. In the world of finance, the closer a model gets to reality, the less "intuitive" the results seem to the average user. For a while, I genuinely wondered if I was moving in the wrong direction.

**But then I realized something: Solving the logic is only half the battle. The other half is helping the user understand and trust that logic.**

The bank’s system is designed to filter risk; it doesn't owe you an explanation. It just says "No." But as a product builder, you have to explain *why*. Why was the limit lower than expected? Why did the rate jump? What happens if you change just one variable?

This is where the traditional systems fail, and where the real opportunity for "AI + SaaS" begins.

LLMs are great at generalities, but they struggle with these "semi-closed" domains where the rules aren't public or standardized. However, once you’ve done the hard work of deconstructing those rules into code, AI becomes incredibly valuable—not as the decision-maker, but as the **interpreter**. It can explain the result, simulate paths forward, and offer actual strategy.

If I had to summarize what I've learned so far, it’s this: For years, SaaS was about "simplifying the world." But in the AI era, the real opportunity might be in **restoring the complexity** that was previously hidden.

I don't think SaaS is going away. But the products that just "wrap" existing capabilities will find it harder to survive. The products that truly understand the internal logic of a specific domain will become more essential than ever.

That’s the path I’m on now. I’m not sure if it’s the "right" one yet, but it’s certainly the most honest one I’ve found.

<ArchitectNote>
这段会渲染成专家洞察框。
</ArchitectNote>
