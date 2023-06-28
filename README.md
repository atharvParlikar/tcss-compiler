# tcss compiler

tcss is a way of writing tailwindcss, tcss combines tailwind's awesome utility classes with clean css syntax.

## to get started

clone the repo

```bash
git clone https://github.com/atharvParlikar/tcss-compiler.git
```
then once you are into the repo, run

```bash
npm run dev
```

## syntax

```
.btn {
    bg-black <-- tailwindcss utility classes
    font-white
    p-10
    rounded-lg
    @css <-- anything inside this will be treated as normal css
        -webkit-text-stroke: 4px gray; <-- normal css for more flexibility
    @endcss
}
```
note: tcss does not support comments as of now so the arrows above are invalid, they are just there for ease of understanding.

---
## TODO
- [ ] tcss plugin for vite-react
- [ ] making scope of tcss files local to the importing html/jsx
- [ ] LSP and colorscheme for vscode
- [ ] publish tcss-compiler to npm

note : this project is at very early stage and i am still figuering out how to make this work, this is just a prototype.


