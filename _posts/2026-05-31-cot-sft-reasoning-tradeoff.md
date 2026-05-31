---
title: "CoT-SFT Tradeoffs, Efficient CoT, RL, and Implicit Reasoning"
description: "A research note on why explicit CoT fine-tuning can help or hurt, and how that motivates efficient CoT, optimized CoT training, and implicit reasoning."
date: 2026-05-31 12:00:00 +0800
---

This note organizes a few current thoughts on CoT-SFT, efficient CoT, RL over CoT data, and implicit or latent reasoning. The core question is simple: why can explicit CoT fine-tuning sometimes help, but sometimes underperform answer-only behavior? In Omni Video Reasoning, this question becomes sharper because the bottleneck is not always text-only reasoning. It is often whether the model can reliably acquire and verbalize the relevant visual and audio evidence.

## Short Answer

The proposed decomposition is basically right: CoT-SFT can provide format, termination, and reasoning-pattern benefits, but it can also introduce long-output costs, answer-token dilution, train/test mismatch, and error accumulation.

```text
Observed CoT-SFT effect
= format / termination / reasoning-pattern benefit
- long-output cost
- answer-token dilution under long rationale loss
- teacher-forcing mismatch
- error accumulation across long traces
- unfaithful or hallucinated evidence amplification
```

A stricter formulation is useful: the positive side is not merely "format matching", and the negative side is not merely "longer output". CoT traces may teach useful reasoning patterns, but they may also make the model imitate unsupported or overlong rationales.

This naturally leads to three research directions: shorten explicit CoT, optimize how CoT data is used, or leave explicit natural-language CoT and move toward implicit reasoning.

## Three Paths

### Path A: Efficient Explicit CoT

The first path tries to reduce the degradation term while preserving the useful parts of explicit reasoning. The goal is not to remove reasoning supervision, but to make it shorter, more controlled, and less redundant.

Candidate variants include:

- answer-first CoT
- short rationale / one-sentence rationale
- evidence bullets only
- token-budgeted CoT
- rationale compression
- masked rationale loss / answer reweighting

This path is the closest fit to the current Daily-Omni ablations, because it directly probes whether the main issue is length, supervision dilution, or train/test mismatch.

### Path B: Optimized Explicit CoT

The second path tries to increase the benefit of CoT data. Instead of mechanically imitating every teacher rationale, the model should learn from the traces that are actually useful.

Possible tools include:

- CoT filtering / rewriting
- DPO / ORPO preference learning
- GRPO / RL with answer reward
- format reward
- length penalty
- evidence faithfulness reward

The risk is that RL does not automatically solve the length problem. If the reward only checks the final answer, it may encourage shortcuts. If the reward overvalues detailed reasoning, it may make outputs even longer. A useful reward needs to jointly constrain answer correctness, format validity, length, and evidence faithfulness.

### Path C: Implicit / Latent Reasoning

The third path no longer asks the model to output a better natural-language CoT. Instead, it replaces explicit CoT with latent, soft, abstract, or claim-level intermediate representations.

Relevant variants include:

- pause / latent tokens
- continuous thought
- SoftCoT / CODI / Coconut
- abstract reasoning tokens
- claim-level verifier
- latent evidence slots

I would not frame this as a natural continuation of CoT optimization. It is a separate branch: instead of asking how to write better intermediate thoughts, it asks which intermediate states need to be written in natural language at all.

## Preconditions

| Category | Precondition | If it fails |
| --- | --- | --- |
| Model capability | The model must be able to generate long outputs stably, without early stopping, loops, format collapse, or special-token failures. | CoT-SFT is mostly training output stability, not reasoning. |
| Model capability | The model must already have basic instruction following and final-answer formatting ability. | Format gains, parsing gains, and reasoning gains become hard to separate. |
| Multimodal evidence | The model must extract relevant visual/audio evidence with reasonable reliability. | If the evidence is wrong, CoT may only make the wrong observation longer and more coherent. |
| Data | Teacher CoT must be grounded, option-discriminative, and contain compressible redundancy. | Compression may remove useful information, and RL may reinforce bad rationales. |
| Training objective | The final answer token must not be drowned out by a long rationale loss. | The model may learn style and explanation patterns while getting worse at final answer selection. |
| Train/test alignment | Training should not condition the answer on a gold rationale when inference requires the model to generate its own rationale. | This creates a teacher-forcing mismatch. |
| RL | Rewards should jointly constrain answer correctness, format validity, length, and evidence faithfulness. | Final-answer-only rewards can encourage shortcuts; detail-seeking rewards can make outputs even longer. |

## Literature Evidence

### 1. Long CoT can degrade smaller or weaker models

[Through the Valley: Path to Effective Long CoT Training for Small Language Models](https://arxiv.org/abs/2506.07712) reports Long CoT Degradation and attributes part of the problem to error accumulation in longer responses.

### 2. Efficient or short CoT is a supported path

[CoT-Valve: Length-Compressible Chain-of-Thought Tuning](https://arxiv.org/abs/2502.09601) studies controllable compression of reasoning-chain length while preserving performance.

[Long-Short Chain-of-Thought Mixture Supervised Fine-Tuning](https://arxiv.org/abs/2505.03469) mixes long CoT with structure-preserving short rewrites to reduce overthinking and response length.

### 3. Preference / RL can better exploit CoT, but may increase length

[Thinking Preference Optimization](https://arxiv.org/abs/2502.13173) improves reasoning after long-CoT SFT through preference optimization, but it prefers long CoT over short CoT and reports longer outputs. This supports RL or preference learning as a way to increase the benefit term, but not as an automatic solution to the length problem.

### 4. CoT can be unfaithful or rationalizing

[Language Models Don't Always Say What They Think](https://arxiv.org/abs/2305.04388) shows that CoT explanations can systematically misrepresent the true cause of a model's answer.

[Chain-of-Thought Reasoning In The Wild Is Not Always Faithful](https://arxiv.org/abs/2503.08679) studies faithfulness risks under more realistic prompting conditions.

### 5. Multimodal CoT has evidence-faithfulness risks

[SPD-Faith Bench](https://arxiv.org/abs/2602.07833) identifies perceptual blindness and perception-reasoning dissociation in multimodal CoT.

[Thinking Before Looking](https://huggingface.co/papers/2411.12591) studies visual hallucination mitigation in multimodal LLM reasoning.

[Understanding and Mitigating Hallucinations in Multimodal Chain-of-Thought Models](https://arxiv.org/abs/2603.27201) discusses hallucinations during multimodal CoT reasoning and visual-attention decay.

### 6. Implicit / latent reasoning is a separate branch

- [Coconut: Training LLMs to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769)
- [SoftCoT: Soft Chain-of-Thought for Efficient Reasoning with LLMs](https://arxiv.org/abs/2502.12134)
- [CODI: Compressing Chain-of-Thought into Continuous Space via Self-Distillation](https://arxiv.org/abs/2502.21074)
- [Thinking Without Words: Efficient Latent Reasoning with Abstract Chain-of-Thought](https://arxiv.org/abs/2604.22709)
- [Do Latent-CoT Models Think Step-by-Step?](https://arxiv.org/abs/2602.00449)

The last paper is a useful caution: latent-CoT does not automatically mean genuine step-by-step reasoning. It can also learn partial or shortcut strategies, so it needs its own diagnostics.

## How to State the Evidence-Amplification Claim

Avoid saying that CoT always amplifies wrong evidence. A more defensible claim is:

> Prior work on CoT faithfulness and multimodal CoT hallucination shows that generated reasoning traces are not always faithful to the underlying evidence. When visual or audio evidence is incomplete or wrong, a longer natural-language rationale can elaborate that error into a coherent but unsupported chain, causing error accumulation.

This matters for the current project because the local experiments suggest that the key bottleneck is often AV evidence acquisition and verbalization, not downstream text-only reasoning. In that regime, longer CoT may not mean "thinking more"; it may mean "writing more about unreliable evidence".

## Recommended Framing for This Project

I would rank the next steps like this:

1. Prioritize Efficient CoT first. It directly tests the length/loss/mismatch hypothesis and matches the Daily-Omni ablations.
2. Treat RL / preference as a small controlled pilot. The reward must include answer correctness, format validity, length control, and evidence faithfulness.
3. Keep implicit / latent reasoning as a separate branch. It is not simply a better CoT; it replaces the natural-language intermediate representation.

The bigger takeaway is that CoT-SFT is not a monotonic benefit. It simultaneously changes supervision density, output length, train/test consistency, and evidence expression. For multimodal reasoning, the right question is not simply whether to use CoT. It is which evidence should be explicit, which reasoning should be compressed, and which supervision should stay focused on the final answer.
