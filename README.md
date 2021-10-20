# Canvas sketches

**_I am no-longer actively adding to this project._**

This is a collection of sketches that I created late 2017 to early 2018. I made a quick [index of each individual project](https://rileyjshaw.com/canvas), which I [wrote about here](https://rileyjshaw.commit--blog.com/rileyjshaw/canvas/1bded12b1bbe518e87ffbab8c0c3a4d80f10fb46).

## Making changes

```
git clone git@github.com:rileyjshaw/canvas.git
cd canvas
git checkout master
# Make some changes.
# Load the relevant component into `src/index.js`.
# Edit `package.json:homepage` to reflect the current sketch.
npm run build
# Copy the contents of `/build` into `/built_final/<sketch_name>`.
npm run deploy-final
```

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

