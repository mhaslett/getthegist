# Onboarding flow for Lookback for Mac

- This is a static HTML page with a simple wizard with figures for the onboarding flow.
- Can be server locally.
- Using Babel.

## Develop

Potentially over engineered, but dammit, this is a robust dev setup. In order to have a *nice* and lean dev experience while prototyping, this is set up with live injections of CSS and reload on JS saves. Hence the gulp setup.

**Run server**

```
gulp serve
```

JS and SCSS changes will reload or live inject site, respectively.

**Build**

```
gulp build
open index.html
```

Produces JS and CSS in `dist`.

***

Made by Johan.
