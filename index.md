---
layout: default
title: Home
description: Personal homepage of Jianghan Chao.
---

<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow" data-i18n-zh="个人主页" data-i18n-en="Personal Homepage">个人主页</p>
    <h1 data-i18n-zh="{{ site.author.name }}" data-i18n-en="{{ site.author.english_name }}">{{ site.author.name }}</h1>
    <p class="subtitle" data-i18n-zh="{{ site.author.affiliation }}的 {{ site.author.title }}。" data-i18n-en="{{ site.author.title_en }} at {{ site.author.affiliation_en }}, starting from 2025.">{{ site.author.affiliation }}的 {{ site.author.title }}。</p>
    <div class="hero-actions">
      <a class="button primary" href="{{ '/publications/' | relative_url }}" data-i18n-zh="查看论文" data-i18n-en="View Publications">查看论文</a>
      <a class="button secondary" href="{{ '/blog/' | relative_url }}" data-i18n-zh="阅读博客" data-i18n-en="Read Blog">阅读博客</a>
    </div>
  </div>
  <aside class="profile-panel" aria-label="Profile summary">
    <div class="avatar">RX</div>
    <dl>
      <div>
        <dt data-i18n-zh="英文名" data-i18n-en="English Name">英文名</dt>
        <dd>{{ site.author.english_name }}</dd>
      </div>
      <div>
        <dt data-i18n-zh="邮箱" data-i18n-en="Email">邮箱</dt>
        <dd><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></dd>
      </div>
      <div>
        <dt>GitHub</dt>
        <dd><a href="https://github.com/{{ site.author.github }}">@{{ site.author.github }}</a></dd>
      </div>
      <div>
        <dt data-i18n-zh="地点" data-i18n-en="Location">地点</dt>
        <dd data-i18n-zh="中国，北京" data-i18n-en="Beijing, China">中国，北京</dd>
      </div>
    </dl>
  </aside>
</section>

<section class="section-grid">
  <div>
    <p class="eyebrow" data-i18n-zh="关于" data-i18n-en="About">关于</p>
    <h2 data-i18n-zh="简介" data-i18n-en="About Me">简介</h2>
    <p data-i18n-zh="我是晁姜晗，目前是中国人民大学高瓴人工智能学院和北京中关村学院的 2025 级联培博士生，关注人工智能研究、工程实践，以及持续学习中的问题与方法。" data-i18n-en="I am Jianghan Chao, a joint PhD student at Gaoling School of Artificial Intelligence, Renmin University of China, and Beijing Zhongguancun Academy, starting from 2025. My interests span AI research, engineering practice, and the methods behind continuous learning.">我是晁姜晗，目前是中国人民大学高瓴人工智能学院和北京中关村学院的 2025 级联培博士生，关注人工智能研究、工程实践，以及持续学习中的问题与方法。</p>
  </div>
  <div>
    <p class="eyebrow" data-i18n-zh="近期" data-i18n-en="Now">近期</p>
    <h2 data-i18n-zh="近期关注" data-i18n-en="Current Focus">近期关注</h2>
    <p data-i18n-zh="我目前主要关注多模态和视频理解，尤其是跨模态感知、推理与视频内容理解。" data-i18n-en="My current focus is multimodality and video understanding, especially cross-modal perception, reasoning, and understanding video content.">我目前主要关注多模态和视频理解，尤其是跨模态感知、推理与视频内容理解。</p>
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <p class="eyebrow" data-i18n-zh="精选成果" data-i18n-en="Selected Work">精选成果</p>
    <h2 data-i18n-zh="精选论文" data-i18n-en="Selected Publications">精选论文</h2>
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
    <p class="eyebrow" data-i18n-zh="写作" data-i18n-en="Writing">写作</p>
    <h2 data-i18n-zh="最新博客" data-i18n-en="Latest Blog">最新博客</h2>
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
