---
title: "CoT-SFT 的收益、衰减与三条研究路径"
description: "整理 CoT-SFT 在显式推理、长输出成本、证据忠实性与 latent reasoning 之间的权衡。"
date: 2026-05-31 12:00:00 +0800
---

这篇笔记整理了最近关于 CoT-SFT、efficient CoT、用 RL 更好利用 CoT 数据，以及 implicit / latent reasoning 的一些判断。核心问题很朴素：显式 CoT 为什么有时有效，有时又会输给 answer-only？如果把它放在 Omni Video Reasoning 的语境下，这个问题还会变得更尖锐，因为瓶颈未必总是文本推理，很多时候是视频、音频证据本身是否被可靠提取。

## 一句话结论

显式 CoT 有收益，也有衰减。收益来自格式、终止模式、推理模板和自检行为；衰减来自长输出成本、答案监督被 rationale token 稀释、teacher-forcing mismatch、长链错误累积，以及不可靠 evidence 被自然语言 rationale 展开或合理化。

```text
CoT-SFT 效果
= 格式 / 终止 / 推理模式收益
- 长输出成本
- final answer token 被 rationale token 稀释
- teacher-forcing mismatch
- 长链错误累积
- 不可靠 evidence 被长 rationale 展开或合理化
```

因此，我更倾向于把后续研究拆成三条线：缩短显式 CoT、更好地优化显式 CoT，以及跳出自然语言 CoT 做 implicit / latent reasoning。

## 三条路径

### 方向 A：Efficient Explicit CoT

第一条路径的目标是降低显式 CoT 的负项：更短、更受控、更少冗余，同时尽量保留 evidence 和 reasoning signal。可尝试的做法包括：

- answer-first CoT
- short rationale / one-sentence rationale
- evidence bullets only
- token-budgeted CoT
- rationale compression
- masked rationale loss / answer reweighting

这条线最适合作为当前 Daily-Omni ablation 的直接延伸，因为它不改变任务形态，只是在控制输出长度和监督分配。

### 方向 B：Optimized Explicit CoT

第二条路径不是机械模仿所有 teacher rationale，而是筛选、偏好或强化真正有用的 reasoning trace。可尝试的做法包括：

- CoT filtering / rewriting
- DPO / ORPO preference
- GRPO / RL with answer reward
- format reward
- length penalty
- evidence faithfulness reward

这条线的风险在于：如果 reward 只看最终答案，模型可能学 shortcut；如果 reward 过度偏好详细推理，输出可能越训越长。所以它需要同时约束答案正确性、格式合法性、长度和 evidence faithfulness。

### 方向 C：Implicit / Latent Reasoning

第三条路径不再追求输出更好的自然语言 CoT，而是把中间推理压到 latent、soft token、abstract token 或 claim selector 里。可关注的方向包括：

- pause / latent tokens
- continuous thought
- SoftCoT / CODI / Coconut
- abstract reasoning tokens
- claim-level verifier
- latent evidence slots

我不太想把这条线写成 CoT 优化的自然延伸。它更像是替换自然语言中间表示的另一条路线：不再问「怎样写出更好的思考过程」，而是问「哪些中间状态真的需要被写成自然语言」。

## 这些判断依赖什么前提

| 类别 | 前提 | 如果不成立，会发生什么 |
| --- | --- | --- |
| 模型能力 | 模型必须能稳定长输出，不能频繁早停、重复、格式崩坏或特殊 token loop。 | CoT-SFT 首先是在修输出稳定性，谈不上真正利用 CoT。 |
| 模型能力 | 模型已有基本 instruction following 和 final-answer 格式能力。 | 格式收益、解析收益和推理收益会混在一起。 |
| 多模态 evidence | 模型能比较可靠地从视频/音频中提取关键证据。 | 如果 evidence 错了，CoT 可能只是把错误讲得更长、更自洽。 |
| 数据 | teacher CoT 必须 grounded、option-discriminative，且长度中确实存在可压缩冗余。 | 短 CoT 或压缩 CoT 可能丢掉关键信息；RL 也可能强化坏 rationale。 |
| 训练目标 | final answer token 不能被长 rationale token 的 loss 稀释。 | 模型学会了风格和长解释，但最终答案决策变差。 |
| 训练/推理一致性 | 训练时答案不能依赖 gold rationale，而推理时却要求模型自己生成 rationale。 | 会产生 teacher-forcing mismatch。 |
| RL | reward 必须同时约束答案、格式、长度和 evidence faithfulness。 | 只看最终答案可能奖励 shortcut；只奖励详细推理可能把输出越拉越长。 |

## 文献线索

### 长 CoT 可能导致退化

[Through the Valley: Path to Effective Long CoT Training for Small Language Models](https://arxiv.org/abs/2506.07712) 提出 Long CoT Degradation：小模型在有限 long-CoT 数据上可能明显退化，原因之一是长响应中的错误累积。

### Efficient / Short CoT 是一条有文献支撑的路径

[CoT-Valve: Length-Compressible Chain-of-Thought Tuning](https://arxiv.org/abs/2502.09601) 探索对 reasoning chain 长度的可控压缩，目标是在显著缩短 token 的同时尽量保持性能。

[Long-Short Chain-of-Thought Mixture SFT](https://arxiv.org/abs/2505.03469) 使用 long + short CoT 混合训练，目标是减少 teacher 过度思考带来的冗长输出。

### Preference / RL 可以更好利用 CoT，但会引入长度风险

[Thinking Preference Optimization](https://arxiv.org/abs/2502.13173) 通过偏好优化继续提升 long-CoT SFT 后的推理能力，但它偏好 long CoT，也报告了输出长度增加。这说明 RL / preference 可以提高收益项，但不天然解决长度负项。

### CoT 可能不忠实，甚至合理化错误

[Language Models Don't Always Say What They Think](https://arxiv.org/abs/2305.04388) 说明 CoT explanation 可能系统性误代表真实决策原因，并会在偏置输入下合理化错误答案。

[Chain-of-Thought Reasoning In The Wild Is Not Always Faithful](https://arxiv.org/abs/2503.08679) 在更真实的 prompting 条件下讨论 CoT faithfulness 问题。

### 多模态 CoT 的 evidence faithfulness 风险

[SPD-Faith Bench](https://arxiv.org/abs/2602.07833) 提出 perceptual blindness 和 perception-reasoning dissociation，并把问题关联到 visual attention decay 和 representation shift。

[Thinking Before Looking](https://huggingface.co/papers/2411.12591) 讨论 multimodal LLM reasoning 中视觉 hallucination 的缓解问题。

[Understanding and Mitigating Hallucinations in Multimodal Chain-of-Thought Models](https://arxiv.org/abs/2603.27201) 关注 MCoT 中 hallucination 与视觉注意力衰减等问题。

### Implicit / Latent Reasoning 是独立分支

- [Coconut: Training LLMs to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769)
- [SoftCoT: Soft Chain-of-Thought for Efficient Reasoning with LLMs](https://arxiv.org/abs/2502.12134)
- [CODI: Compressing Chain-of-Thought into Continuous Space via Self-Distillation](https://arxiv.org/abs/2502.21074)
- [Thinking Without Words: Efficient Latent Reasoning with Abstract Chain-of-Thought](https://arxiv.org/abs/2604.22709)
- [Do Latent-CoT Models Think Step-by-Step?](https://arxiv.org/abs/2602.00449)

最后一篇也提醒我们：latent-CoT 并不天然等于真正的 step-by-step reasoning，它也可能学到 partial 或 shortcut 策略。

## 关于「不可靠 evidence 被 CoT 放大」

这个判断不应该写成「CoT 必然放大错误 evidence」。更稳妥的表述是：

> 已有 CoT faithfulness 和 multimodal CoT hallucination 研究表明，生成的 reasoning trace 不一定忠实于真实证据；当底层视觉/音频 evidence 不完整或错误时，较长的自然语言 rationale 可能把这个错误展开成自洽但不受支持的推理链，从而产生错误累积。

对 Video-Holmes 和 Daily-Omni 这类任务来说，这一点尤其重要。主瓶颈并不总是文本推理，而经常是 AV evidence acquisition / verbalization。长 CoT 在这种情况下可能不是「多想一步」，而是「把不可靠 evidence 多写几步」。

## 对当前项目的建议

我会把优先级排成这样：

1. 先做 Efficient CoT。这最贴近当前 Daily-Omni ablation，尤其是 answer-prefix masked CoT、short rationale、evidence bullets 和 answer-token reweighting。
2. RL / preference 只做小规模 pilot。reward 必须同时覆盖答案正确、格式合法、长度受控和 evidence faithful，否则很容易把输出越训越长。
3. Implicit / latent reasoning 单独成线。不要把它写成 CoT 优化的自然延伸，它是替换自然语言中间表示的另一条路线。

更大的 takeaway 是：CoT-SFT 不是一个单调收益项。它同时改变了监督密度、输出长度、训练/推理一致性和证据表达方式。对于多模态推理任务，真正需要问的不是「要不要 CoT」，而是「哪些证据需要显式写出，哪些推理应该被压缩，哪些监督应该留给最终答案」。
