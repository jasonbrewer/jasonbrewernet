# Jason Brewer — portfolio site

Plain HTML / CSS / JavaScript in separate files. No build step, no server.
Double-click `index.html` to view.

## Pages

```
index.html        Home page (the main reel grid)
collection.html   A sub-gallery, e.g. collection.html?c=steri-clean
project.html      An individual project page, e.g. project.html?p=drone
css/styles.css    ALL styling — design tokens at the top
js/data.js        YOUR CONTENT — the only file you edit
js/app.js         Builds the pages (leave alone)
assets/home/      Home-page thumbnails
assets/thumbs/    Collection thumbnails
assets/gallery/   Project still images
```

## How it fits together

- The **home page** shows the `HOME` tiles from `js/data.js`.
- One home tile ("Buying a Franchise") points at `collection.html?c=steri-clean`,
  which shows the **Steri-Clean Collection** grid.
- Every other tile points at a **project page** like `project.html?p=drone`.

## Add or change a tile

Edit the `HOME` list (or a collection's `tiles`) in `js/data.js`:

```js
{ title:"Location Drone Reel", thumb:"assets/home/drone-reel.jpg", href:"project.html?p=drone" }
```

`href` can go anywhere: a project page, a collection, or an external URL.
Drop the image at the `thumb` path — until you do, a titled placeholder shows.

## Add a whole new collection (no new HTML needed)

1. Add a key under `COLLECTIONS` in `js/data.js` with a `title` and `tiles`.
2. Point a `HOME` tile's `href` at `collection.html?c=YOURKEY`.

## Fill in a project page

Edit that project's entry in the `PROJECTS` list:

```js
{ slug:"drone", title:"Location Drone Reel", category:"Aerial",
  description:"...", video:{type:"youtube", id:"..."},
  gallery:["assets/gallery/a.jpg","assets/gallery/b.jpg"] }
```

Video options: `{type:"youtube",id}` · `{type:"vimeo",id}` ·
`{type:"file",src}` · `{type:"embed",src}`. Known YouTube/Vimeo videos
are already filled in; the CCV ones are left blank until you re-host them.

## Restyle

All of the look lives in the token block at the top of `css/styles.css`
(`--bg`, `--accent`, `--thumb-min`, fonts, etc.). Change a token once and
the whole site follows.
