import re, os, glob

css_files = glob.glob('assets/css/*.css')
defined = set()
for f in css_files:
    src = open(f, encoding='utf-8').read()
    for m in re.finditer(r'\.([A-Za-z_][\w-]*)', src):
        defined.add(m.group(1))

used = {}
for f in glob.glob('assets/js/*.js') + glob.glob('assets/js/pages/*.js') + ['index.html']:
    src = open(f, encoding='utf-8').read()
    for m in re.finditer(r'class="([^"]+)"', src):
        for c in m.group(1).split():
            c = c.strip()
            if c and '$' not in c and '{' not in c:
                used.setdefault(c, set()).add(os.path.basename(f))

missing = {c: v for c, v in used.items() if c not in defined}
for c in sorted(missing):
    print('FALTA .%-28s %s' % (c, ', '.join(sorted(missing[c]))))
print('\ntotal classes usadas:', len(used), '| faltando:', len(missing))
