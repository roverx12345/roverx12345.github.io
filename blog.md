---
layout: default
title: Blog
permalink: /blog/
---

<section class="page-title">
  <p class="eyebrow" data-i18n-zh="笔记" data-i18n-en="Notes">笔记</p>
  <h1 data-i18n-zh="博客" data-i18n-en="Blog">博客</h1>
  <p data-i18n-zh="这里记录研究、工程和学习过程中的想法。" data-i18n-en="Notes on research, engineering, and things I am learning along the way.">这里记录研究、工程和学习过程中的想法。</p>
</section>

<section class="post-list">
  {% for post in site.posts %}
    <article class="post-card">
      <p class="meta">{{ post.date | date: "%Y-%m-%d" }}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p>{{ post.description }}</p>
    </article>
  {% endfor %}
</section>
