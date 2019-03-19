# horsy

* write html-like into a tagged template and get an array of html elements. 
  * objects returned by template expressions assigned to attributes stay attributes in the produced element.
  * functions returned by template expressions assigned to tags get passed attributes and children and must return a node
* works great with web components
* doesn't do much else (~200 lines of not-code-golf code)

```
import h, { setChildren } from 'horsy'
let elements = h`<span>hello</span> <span>world</span>`
setChildren(document.body, elements)
```
