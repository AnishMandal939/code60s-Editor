// SimpleLezerLinter.ts
import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";

export function simpleLezerLinter() {
  return linter(view => {
    const {state} = view
    const tree = syntaxTree(state)

    // If the document is empty, return no errors
    if (state.doc.length === 0) {
      return []
    }

    if (tree.length === state.doc.length) {
      let pos: number | null = null
      tree.iterate({enter: n => {
        if (pos == null && n.type.isError) {
          pos = n.from
          return false
        }
      }})

      if (pos != null)
        return [{from: pos, to: pos+1, severity: 'error', message: state.sliceDoc(pos, pos+1) + ` is not allowed | Syntax Error at position ${pos} and line ${state.doc.lineAt(pos).number}`}]
    } 

    return []
  })
}