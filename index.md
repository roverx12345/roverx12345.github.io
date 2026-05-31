---
layout: default
title: Home
description: Personal homepage of Rover X.
---

<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">Personal Homepage</p>
    <h1>{{ site.author.name }}</h1>
    <p class="subtitle">{{ site.author.title }} at {{ site.author.affiliation }}. I write about research, engineering, and things I am learning.</p>
    <div class="hero-actions">
      <a class="button primary" href="{{ '/publications/' | relative_url }}">View Publications</a>
      <a class="button secondary" href="{{ '/blog/' | relative_url }}">Read Blog</a>
    </div>
  </div>
  <aside class="profile-panel" aria-label="Profile summary">
    <div class="avatar">RX</div>
    <dl>
      <div>
        <dt>Email</dt>
        <dd><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></dd>
      </div>
      <div>
        <dt>GitHub</dt>
        <dd><a href="https://github.com/{{ site.author.github }}">@{{ site.author.github }}</a></dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>Update in <code>_config.yml</code></dd>
      </div>
    </dl>
  </aside>
</section>

<section class="section-grid">
  <div>
    <p class="eyebrow">About</p>
    <h2>简介</h2>
    <p>这里可以写你的研究方向、当前职位、教育经历和长期兴趣。建议保持 2-4 句话，首页读起来会很清爽。</p>
  </div>
  <div>
    <p class="eyebrow">Now</p>
    <h2>近期关注</h2>
    <p>用这里放正在做的项目、开放合作方向、近期论文或你希望别人第一眼看到的信息。</p>
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <p class="eyebrow">Selected Work</p>
    <h2>精选 Publications</h2>
  </div>
  <div class="publication-list compact">
    {% assign selected_publications = site.data.publications | where: "selected", true %}
    {% for publication in selected_publications limit: 3 %}
      <article class="publication-item">
        <h3>{{ publication.title }}</h3>
        <p>{{ publication.authors }}</p>
        <p class="meta">{{ publication.venue }}, {{ publication.year }}</p>
      </article>
    {% endfor %}
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <p class="eyebrow">Writing</p>
    <h2>最新 Blog</h2>
  </div>
  <div class="post-list">
    {% for post in site.posts limit: 3 %}
      <article class="post-card">
        <p class="meta">{{ post.date | date: "%Y-%m-%d" }}</p>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.description }}</p>
      </article>
    {% endfor %}
  </div>
</section>
