---
layout: default
title: Blog
permalink: /blog/
---

<section class="page-title">
  <p class="eyebrow">Notes</p>
  <h1>Blog</h1>
  <p>Write new posts in <code>_posts/YYYY-MM-DD-title.md</code>.</p>
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
