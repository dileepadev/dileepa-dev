# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> Release work - objectives, release steps, tagging - is tracked in each release's GitHub issue,
> where a checkbox can be ticked without a commit. What shipped is in [CHANGELOG.md](CHANGELOG.md).
> This file holds only code-level work that no issue tracks yet (none right now), and the
> standing rules. Open work: [issues](https://github.com/dileepadev/dileepa-dev/issues). The
> cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md).

## Standing rules

Not tasks, and not to be "cleaned up" later.

- **Keep the two same-site slug redirects indefinitely.** A redirect rule costs nothing to keep;
  removing one costs a live link.
- **Keep the pinned content ref pinned.** `BLOG_CONTENT_REF` is a commit SHA on the blog repo's
  `main`, bumped deliberately when publishing. An unpinned ref makes a build's output depend on
  when it ran.
