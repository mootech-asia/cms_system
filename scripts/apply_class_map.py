#!/usr/bin/env python3
"""Token-level class replacement for HTML files.

Reads a JSON mapping {old_class_token: "new class string"} from stdin's
first arg (a .json file) and applies it to every `class="..."` attribute
in the given HTML files: each whitespace-separated token in the class
list is looked up in the mapping; a match is replaced by the mapped
string (which may itself contain multiple utility classes); tokens with
no mapping entry are left untouched (state modifiers like "active",
structural hook classes still needed by JS/CSS-attribute-selectors, etc).
"""
import json
import re
import sys

def main():
    map_path, *html_paths = sys.argv[1:]
    with open(map_path, encoding='utf-8') as f:
        mapping = json.load(f)

    class_re = re.compile(r'class="([^"]*)"')
    full_map = mapping.get('__full__', {})

    def repl(m):
        original = m.group(1)
        if original in full_map:
            return 'class="' + full_map[original] + '"'
        tokens = original.split()
        out = []
        for t in tokens:
            if t in mapping:
                out.extend(mapping[t].split())
            else:
                out.append(t)
        # de-dup while preserving order (a hook class + its own utility
        # replacement might both list the same token)
        seen = set()
        deduped = []
        for t in out:
            if t not in seen:
                seen.add(t)
                deduped.append(t)
        return 'class="' + ' '.join(deduped) + '"'

    for path in html_paths:
        with open(path, encoding='utf-8') as f:
            html = f.read()
        new_html = class_re.sub(repl, html)
        if new_html != html:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f'updated {path}')
        else:
            print(f'no change {path}')

if __name__ == '__main__':
    main()
